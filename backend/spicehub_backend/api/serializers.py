from rest_framework import serializers
from .models import Category, MenuItem, Waiter, Order, MissedCall

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'image_url', 'item_count']

class MenuItemSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = MenuItem
        fields = ['id', 'name', 'description', 'price', 'category', 'category_name', 'image_url', 'tag', 'rating', 'review_count']

class WaiterSerializer(serializers.ModelSerializer):
    is_available = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Waiter
        fields = ['id', 'name', 'phone_number', 'current_orders', 'max_capacity', 'is_available']

class OrderSerializer(serializers.ModelSerializer):
    assigned_waiter_name = serializers.CharField(source='assigned_waiter.name', read_only=True)
    
    class Meta:
        model = Order
        fields = ['id', 'table_number', 'items', 'total_price', 'assigned_waiter', 'assigned_waiter_name', 'status', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class MissedCallSerializer(serializers.ModelSerializer):
    waiter_name = serializers.CharField(source='waiter.name', read_only=True)
    order_table = serializers.CharField(source='order.table_number', read_only=True)
    
    class Meta:
        model = MissedCall
        fields = ['id', 'waiter', 'waiter_name', 'order', 'order_table', 'phone_number', 'call_sid', 'call_status', 'reason', 'created_at', 'resolved', 'resolved_at']
        read_only_fields = ['created_at']
