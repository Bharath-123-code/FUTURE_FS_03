import threading
import logging
from twilio.rest import Client
from twilio.twiml.voice_response import VoiceResponse, Hangup
from django.conf import settings

logger = logging.getLogger(__name__)

def send_whatsapp_order(order_details, waiter_phone):
    """
    Send WhatsApp message with order details to the waiter
    
    Args:
        order_details (dict): Order information including items, table number, etc.
        waiter_phone (str): Waiter's phone number
    
    Returns:
        bool: True if successful, False otherwise
    """
    try:
        # Initialize Twilio client
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        
        # Format the order message
        message = format_order_message(order_details)
        
        # Send WhatsApp message
        message_obj = client.messages.create(
            body=message,
            from_=f'whatsapp:{settings.TWILIO_PHONE_NUMBER}',
            to=f'whatsapp:{waiter_phone}'
        )
        
        logger.info(f"WhatsApp order notification sent to {waiter_phone}. Message SID: {message_obj.sid}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send WhatsApp order notification: {str(e)}")
        return False

def trigger_waiter_alert_call(waiter_phone):
    """
    Trigger a missed call to the waiter using Twilio Voice API
    The call will automatically hang up after 5 seconds (2 rings)
    
    Args:
        waiter_phone (str): Waiter's phone number
    
    Returns:
        bool: True if successful, False otherwise
    """
    try:
        # Initialize Twilio client
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        
        # Create TwiML for automatic hangup after 5 seconds
        twiml_response = VoiceResponse()
        twiml_response.say("New order assigned. Please check your WhatsApp.")
        twiml_response.pause(length=3)
        twiml_response.append(Hangup())
        
        # Make the call
        call = client.calls.create(
            twiml=str(twiml_response),
            from_=settings.TWILIO_PHONE_NUMBER,
            to=waiter_phone,
            timeout=10,  # Call will timeout after 10 seconds
            method='GET'
        )
        
        logger.info(f"Waiter alert call triggered to {waiter_phone}. Call SID: {call.sid}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to trigger waiter alert call: {str(e)}")
        return False

def format_order_message(order_details):
    """
    Format order details into a clean WhatsApp message
    
    Args:
        order_details (dict): Order information
    
    Returns:
        str: Formatted message
    """
    items = order_details.get('items', [])
    table_number = order_details.get('table_number', 'N/A')
    total_price = order_details.get('total_price', 0)
    
    # Start building the message
    message = f"🍽️ *NEW ORDER ALERT*\n\n"
    message += f"🪑 *Table: {table_number}*\n\n"
    message += f"📋 *Order Items:*\n"
    
    # Add each item
    for i, item in enumerate(items, 1):
        item_name = item.get('name', 'Unknown Item')
        quantity = item.get('quantity', 1)
        price = item.get('price', 0)
        item_total = price * quantity
        
        message += f"{i}. {item_name} x{quantity} - ${item_total:.2f}\n"
    
    # Add total
    message += f"\n💰 *Total: ${total_price:.2f}*\n"
    message += f"\n⏰ Please attend to this order immediately!"
    
    return message

def send_notifications_background(order_details, waiter_phone):
    """
    Send both WhatsApp and missed call notifications in background thread
    
    Args:
        order_details (dict): Order information
        waiter_phone (str): Waiter's phone number
    """
    def notification_task():
        try:
            # Send WhatsApp notification
            whatsapp_success = send_whatsapp_order(order_details, waiter_phone)
            
            # Send missed call notification
            call_success = trigger_waiter_alert_call(waiter_phone)
            
            if whatsapp_success and call_success:
                logger.info("Both notifications sent successfully")
            else:
                logger.warning("One or both notifications failed")
                
        except Exception as e:
            logger.error(f"Background notification task failed: {str(e)}")
    
    # Run in background thread
    thread = threading.Thread(target=notification_task, daemon=True)
    thread.start()
    
    return thread
