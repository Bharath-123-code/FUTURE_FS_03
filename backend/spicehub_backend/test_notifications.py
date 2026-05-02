"""
Test script for notification system
Run this script to test WhatsApp and missed call functionality
"""

import os
import sys
import django

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'spicehub_backend.settings')
django.setup()

from api.notifications import send_whatsapp_order, trigger_waiter_alert_call, format_order_message

def test_format_order_message():
    """Test the order message formatting"""
    print("Testing order message formatting...")
    
    test_order = {
        'table_number': 5,
        'items': [
            {'name': 'Biryani', 'quantity': 2, 'price': 12.99},
            {'name': 'Naan', 'quantity': 4, 'price': 2.50}
        ],
        'total_price': 30.98
    }
    
    message = format_order_message(test_order)
    print("Formatted message:")
    print(message)
    print("-" * 50)
    return True

def test_whatsapp_notification():
    """Test WhatsApp notification (requires valid Twilio credentials)"""
    print("Testing WhatsApp notification...")
    
    test_order = {
        'table_number': 5,
        'items': [
            {'name': 'Biryani', 'quantity': 2, 'price': 12.99},
            {'name': 'Naan', 'quantity': 4, 'price': 2.50}
        ],
        'total_price': 30.98
    }
    
    # Replace with actual phone number for testing
    test_phone = "+1234567890"  # Replace with test phone number
    
    try:
        result = send_whatsapp_order(test_order, test_phone)
        if result:
            print("✅ WhatsApp notification sent successfully")
        else:
            print("❌ WhatsApp notification failed")
        return result
    except Exception as e:
        print(f"❌ WhatsApp notification error: {str(e)}")
        return False

def test_missed_call():
    """Test missed call notification (requires valid Twilio credentials)"""
    print("Testing missed call notification...")
    
    # Replace with actual phone number for testing
    test_phone = "+1234567890"  # Replace with test phone number
    
    try:
        result = trigger_waiter_alert_call(test_phone)
        if result:
            print("✅ Missed call notification triggered successfully")
        else:
            print("❌ Missed call notification failed")
        return result
    except Exception as e:
        print(f"❌ Missed call notification error: {str(e)}")
        return False

def main():
    """Run all tests"""
    print("=" * 60)
    print("SPICEHUB NOTIFICATION SYSTEM TESTS")
    print("=" * 60)
    
    # Test message formatting (always works)
    format_test = test_format_order_message()
    
    # Test WhatsApp (requires Twilio setup)
    print("\nNOTE: WhatsApp and missed call tests require valid Twilio credentials")
    print("Make sure to update settings.py with your Twilio credentials\n")
    
    whatsapp_test = test_whatsapp_notification()
    missed_call_test = test_missed_call()
    
    print("\n" + "=" * 60)
    print("TEST SUMMARY:")
    print(f"Message Formatting: {'✅ PASS' if format_test else '❌ FAIL'}")
    print(f"WhatsApp Notification: {'✅ PASS' if whatsapp_test else '❌ FAIL'}")
    print(f"Missed Call Notification: {'✅ PASS' if missed_call_test else '❌ FAIL'}")
    print("=" * 60)

if __name__ == "__main__":
    main()
