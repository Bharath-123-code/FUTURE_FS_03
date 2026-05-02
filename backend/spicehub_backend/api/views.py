from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404
from django.db import models
from .models import Category, MenuItem, Waiter, Order, MissedCall
from .serializers import CategorySerializer, MenuItemSerializer, WaiterSerializer, OrderSerializer, MissedCallSerializer

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class MenuItemViewSet(viewsets.ModelViewSet):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        queryset = MenuItem.objects.all()
        category_id = self.request.query_params.get('category')
        search_query = self.request.query_params.get('search')
        
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        
        if search_query:
            queryset = queryset.filter(
                models.Q(name__icontains=search_query) |
                models.Q(description__icontains=search_query) |
                models.Q(tag__icontains=search_query)
            )
        
        return queryset

class WaiterViewSet(viewsets.ModelViewSet):
    queryset = Waiter.objects.all()
    serializer_class = WaiterSerializer
    
    @action(detail=True, methods=['post'])
    def assign_order(self, request, pk=None):
        waiter = self.get_object()
        if waiter.is_available():
            waiter.current_orders += 1
            waiter.save()
            return Response({'status': 'order assigned', 'current_orders': waiter.current_orders})
        else:
            return Response({'status': 'waiter not available'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def complete_order(self, request, pk=None):
        waiter = self.get_object()
        if waiter.current_orders > 0:
            waiter.current_orders -= 1
            waiter.save()
            return Response({'status': 'order completed', 'current_orders': waiter.current_orders})
        else:
            return Response({'status': 'no orders to complete'}, status=status.HTTP_400_BAD_REQUEST)

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    
    def perform_create(self, serializer):
        """
        Override perform_create to add Twilio notifications directly
        """
        # First save the order
        order = serializer.save()

        # If the frontend passes an assigned waiter, use them when available.
        selected_waiter = order.assigned_waiter
        if selected_waiter and selected_waiter.current_orders >= selected_waiter.max_capacity:
            selected_waiter = None

        # If no valid selected waiter, assign the next available waiter.
        if not selected_waiter:
            selected_waiter = Waiter.objects.filter(current_orders__lt=models.F('max_capacity')).first()

        if selected_waiter:
            order.assigned_waiter = selected_waiter
            selected_waiter.current_orders += 1
            selected_waiter.save()
            order.save()

            # Check if Twilio is properly configured before attempting to send notifications
            try:
                from twilio.rest import Client
                from twilio.twiml.voice_response import VoiceResponse
                from django.conf import settings

                # Check if Twilio credentials are properly set (not placeholder values)
                if (settings.TWILIO_ACCOUNT_SID and 
                    settings.TWILIO_AUTH_TOKEN and 
                    settings.TWILIO_ACCOUNT_SID != 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' and
                    settings.TWILIO_AUTH_TOKEN != 'your_auth_token'):
                    
                    print(f"Attempting to call waiter: {selected_waiter.name} at {selected_waiter.phone_number}")
                    print(f"From number: {settings.TWILIO_PHONE_NUMBER}")

                    client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)

                    items_list = "\n".join([
                        f"{item.get('quantity', 1)}x {item.get('name', 'Unknown')} - ${item.get('price', 0):.2f}"
                        for item in order.items
                    ])

                    call_message = (
                        f"Hello {selected_waiter.name}. You have a new order from SpiceHub. "
                        f"Table number {order.table_number}. "
                        f"Order total is ${order.total_price:.2f}. "
                        f"Items: {items_list}. "
                        f"Please attend to this order immediately."
                    )

                    print(f"Call message: {call_message}")

                    twiml_response = VoiceResponse()
                    twiml_response.say(call_message, voice='alice', language='en-US')
                    twiml_response.hangup()

                    voice_call = client.calls.create(
                        twiml=str(twiml_response),
                        from_=settings.TWILIO_PHONE_NUMBER,
                        to=selected_waiter.phone_number,
                        timeout=10
                    )

                    print(f"Voice call initiated successfully: {voice_call.sid}")
                else:
                    print("Twilio not properly configured - skipping notification")
                    # Create a missed call record for configuration issue
                    MissedCall.objects.create(
                        waiter=selected_waiter,
                        order=order,
                        phone_number=selected_waiter.phone_number,
                        call_status='failed',
                        reason="Twilio not properly configured"
                    )
                    
            except Exception as e:
                print(f"Twilio notification failed: {str(e)}")
                import traceback
                print(f"Full traceback: {traceback.format_exc()}")
                
                # Create a missed call record - don't let this break the order creation
                try:
                    MissedCall.objects.create(
                        waiter=selected_waiter,
                        order=order,
                        phone_number=selected_waiter.phone_number,
                        call_status='failed',
                        reason=f"Twilio error: {str(e)}"
                    )
                except Exception as missed_call_error:
                    print(f"Failed to create missed call record: {missed_call_error}")
                    # Even this shouldn't break the order creation

        return order
    
    @action(detail=True, methods=['post'])
    def accept_order(self, request, pk=None):
        order = self.get_object()
        if order.status == 'Pending':
            order.status = 'Accepted'
            order.save()
            return Response({'status': 'order accepted'})
        else:
            return Response({'status': 'order cannot be accepted'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def complete_order(self, request, pk=None):
        order = self.get_object()
        if order.status == 'Accepted':
            order.status = 'Completed'
            order.save()
            
            # Release the waiter
            if order.assigned_waiter:
                order.assigned_waiter.current_orders -= 1
                order.assigned_waiter.save()
            
            return Response({'status': 'order completed'})
        else:
            return Response({'status': 'order cannot be completed'}, status=status.HTTP_400_BAD_REQUEST)


class MissedCallViewSet(viewsets.ModelViewSet):
    queryset = MissedCall.objects.all()
    serializer_class = MissedCallSerializer
    
    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        missed_call = self.get_object()
        missed_call.resolved = True
        missed_call.save()
        return Response({'status': 'missed call resolved'})
    
    @action(detail=False, methods=['get'])
    def unresolved(self, request):
        unresolved_calls = MissedCall.objects.filter(resolved=False)
        serializer = self.get_serializer(unresolved_calls, many=True)
        return Response(serializer.data)

class AvailableWaitersView(viewsets.ReadOnlyModelViewSet):
    """
    Returns only waiters who are available for new orders (current_orders < max_capacity)
    Used for the 'Choose Your Waiter' dropdown in the React frontend checkout.
    """
    serializer_class = WaiterSerializer
    
    def get_queryset(self):
        return Waiter.objects.filter(current_orders__lt=models.F('max_capacity'))
