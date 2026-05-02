from django.db import models
from django.db.models import JSONField
from decimal import Decimal

class Category(models.Model):
    name = models.CharField(max_length=100)
    image_url = models.URLField(max_length=500, blank=True)
    item_count = models.IntegerField(default=0)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Categories"

class MenuItem(models.Model):
    TAG_CHOICES = [
        ('Bestseller', 'Bestseller'),
        ('Spicy', 'Spicy'),
        ('New', 'New'),
        ('Vegetarian', 'Vegetarian'),
        ('Non-Vegetarian', 'Non-Vegetarian'),
    ]
    
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='menu_items')
    image_url = models.URLField(max_length=500, blank=True)
    tag = models.CharField(max_length=20, choices=TAG_CHOICES, blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=4.5)
    review_count = models.IntegerField(default=0)
    
    def __str__(self):
        return self.name

class Waiter(models.Model):
    name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=20)
    current_orders = models.IntegerField(default=0)
    max_capacity = models.IntegerField(default=2)
    
    def is_available(self):
        return self.current_orders < self.max_capacity
    
    def __str__(self):
        return f"{self.name} (Orders: {self.current_orders}/{self.max_capacity})"

class Order(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Accepted', 'Accepted'),
        ('Completed', 'Completed'),
    ]
    
    table_number = models.IntegerField()
    items = JSONField(default=list)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    assigned_waiter = models.ForeignKey(Waiter, on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Order {self.id} - Table {self.table_number} ({self.status})"

class MissedCall(models.Model):
    waiter = models.ForeignKey(Waiter, on_delete=models.CASCADE, related_name='missed_calls')
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='missed_calls', null=True, blank=True)
    phone_number = models.CharField(max_length=20)
    call_sid = models.CharField(max_length=100, blank=True)
    call_status = models.CharField(max_length=50, default='failed')
    reason = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    resolved = models.BooleanField(default=False)
    resolved_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"Missed call to {self.waiter.name} at {self.phone_number} ({self.created_at.strftime('%Y-%m-%d %H:%M')})"
    
    class Meta:
        ordering = ['-created_at']
