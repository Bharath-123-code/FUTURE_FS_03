from django.contrib import admin
from .models import Category, MenuItem, Waiter, Order

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'item_count', 'image_url']
    search_fields = ['name']
    list_editable = ['item_count']

@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'tag']
    list_filter = ['category', 'tag']
    search_fields = ['name', 'description']
    list_editable = ['price', 'tag']

@admin.register(Waiter)
class WaiterAdmin(admin.ModelAdmin):
    list_display = ['name', 'phone_number', 'current_orders', 'max_capacity', 'is_available']
    readonly_fields = ['current_orders', 'is_available']
    search_fields = ['name', 'phone_number']
    list_filter = ['max_capacity']
    
    def is_available(self, obj):
        return obj.is_available()
    is_available.boolean = True  # Shows as True/False icon
    is_available.short_description = 'Available'

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'table_number', 'total_price', 'assigned_waiter', 'status', 'created_at']
    list_filter = ['status', 'assigned_waiter', 'created_at']
    search_fields = ['table_number']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'created_at'
