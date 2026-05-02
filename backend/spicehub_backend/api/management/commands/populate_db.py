from django.core.management.base import BaseCommand
from api.models import Category, MenuItem, Waiter

class Command(BaseCommand):
    help = 'Populate database with sample data'

    def handle(self, *args, **options):
        # Create categories
        categories_data = [
            {'name': 'Starters', 'item_count': 8},
            {'name': 'Main Course', 'item_count': 12},
            {'name': 'Pizza', 'item_count': 6},
            {'name': 'Burgers', 'item_count': 5},
            {'name': 'Beverages', 'item_count': 10},
            {'name': 'Desserts', 'item_count': 7},
            {'name': 'Salads', 'item_count': 4},
            {'name': 'Soups', 'item_count': 3},
        ]

        categories = {}
        for cat_data in categories_data:
            category = Category.objects.create(**cat_data)
            categories[category.name] = category
            self.stdout.write(f'Created category: {category.name}')

        # Create menu items
        menu_items_data = [
            # Starters
            {'name': 'Chicken Wings', 'description': 'Crispy fried chicken wings with spicy sauce', 'price': 12.99, 'category': categories['Starters'], 'tag': 'Spicy', 'rating': 4.5, 'review_count': 25},
            {'name': 'Mozzarella Sticks', 'description': 'Golden fried mozzarella cheese sticks', 'price': 8.99, 'category': categories['Starters'], 'tag': 'Vegetarian', 'rating': 4.2, 'review_count': 18},
            {'name': 'French Fries', 'description': 'Crispy golden french fries', 'price': 5.99, 'category': categories['Starters'], 'tag': 'Vegetarian', 'rating': 4.0, 'review_count': 45},
            {'name': 'Onion Rings', 'description': 'Beer battered onion rings', 'price': 7.99, 'category': categories['Starters'], 'tag': 'Vegetarian', 'rating': 4.3, 'review_count': 22},

            # Main Course
            {'name': 'Chicken Biryani', 'description': 'Aromatic basmati rice with tender chicken and spices', 'price': 15.99, 'category': categories['Main Course'], 'tag': 'Non-Vegetarian', 'rating': 4.8, 'review_count': 67},
            {'name': 'Paneer Butter Masala', 'description': 'Creamy tomato curry with soft paneer cubes', 'price': 13.99, 'category': categories['Main Course'], 'tag': 'Vegetarian', 'rating': 4.6, 'review_count': 34},
            {'name': 'Grilled Salmon', 'description': 'Fresh Atlantic salmon grilled to perfection', 'price': 18.99, 'category': categories['Main Course'], 'tag': 'Non-Vegetarian', 'rating': 4.7, 'review_count': 28},
            {'name': 'Vegetable Pulao', 'description': 'Fragrant rice with mixed vegetables and nuts', 'price': 11.99, 'category': categories['Main Course'], 'tag': 'Vegetarian', 'rating': 4.4, 'review_count': 19},

            # Pizza
            {'name': 'Margherita Pizza', 'description': 'Classic pizza with tomato sauce, mozzarella, and basil', 'price': 14.99, 'category': categories['Pizza'], 'tag': 'Vegetarian', 'rating': 4.5, 'review_count': 89},
            {'name': 'Pepperoni Pizza', 'description': 'Spicy pepperoni with mozzarella cheese', 'price': 16.99, 'category': categories['Pizza'], 'tag': 'Non-Vegetarian', 'rating': 4.6, 'review_count': 76},
            {'name': 'BBQ Chicken Pizza', 'description': 'BBQ sauce, chicken, onions, and cilantro', 'price': 17.99, 'category': categories['Pizza'], 'tag': 'Non-Vegetarian', 'rating': 4.7, 'review_count': 52},

            # Burgers
            {'name': 'Classic Cheeseburger', 'description': 'Beef patty with cheese, lettuce, tomato, and special sauce', 'price': 12.99, 'category': categories['Burgers'], 'tag': 'Non-Vegetarian', 'rating': 4.4, 'review_count': 103},
            {'name': 'Veggie Burger', 'description': 'Plant-based patty with avocado and sprouts', 'price': 11.99, 'category': categories['Burgers'], 'tag': 'Vegetarian', 'rating': 4.2, 'review_count': 41},
            {'name': 'Bacon Burger', 'description': 'Double beef patty with crispy bacon and cheese', 'price': 15.99, 'category': categories['Burgers'], 'tag': 'Non-Vegetarian', 'rating': 4.5, 'review_count': 67},

            # Beverages
            {'name': 'Coca Cola', 'description': 'Classic cola drink', 'price': 2.99, 'category': categories['Beverages'], 'rating': 4.0, 'review_count': 156},
            {'name': 'Fresh Orange Juice', 'description': 'Freshly squeezed orange juice', 'price': 4.99, 'category': categories['Beverages'], 'rating': 4.3, 'review_count': 78},
            {'name': 'Iced Coffee', 'description': 'Cold brewed coffee with milk', 'price': 3.99, 'category': categories['Beverages'], 'rating': 4.1, 'review_count': 45},
            {'name': 'Green Tea', 'description': 'Traditional green tea', 'price': 2.49, 'category': categories['Beverages'], 'rating': 4.2, 'review_count': 23},

            # Desserts
            {'name': 'Chocolate Brownie', 'description': 'Rich chocolate brownie with vanilla ice cream', 'price': 6.99, 'category': categories['Desserts'], 'tag': 'Vegetarian', 'rating': 4.8, 'review_count': 92},
            {'name': 'Tiramisu', 'description': 'Classic Italian coffee-flavored dessert', 'price': 7.99, 'category': categories['Desserts'], 'tag': 'Vegetarian', 'rating': 4.6, 'review_count': 38},
            {'name': 'Cheesecake', 'description': 'New York style cheesecake with berry compote', 'price': 8.99, 'category': categories['Desserts'], 'tag': 'Vegetarian', 'rating': 4.7, 'review_count': 56},
        ]

        for item_data in menu_items_data:
            menu_item = MenuItem.objects.create(**item_data)
            self.stdout.write(f'Created menu item: {menu_item.name}')

        # Create waiters
        waiters_data = [
            {'name': 'John Smith', 'phone_number': '+1234567890', 'current_orders': 0, 'max_capacity': 3},
            {'name': 'Sarah Johnson', 'phone_number': '+1234567891', 'current_orders': 0, 'max_capacity': 2},
            {'name': 'Mike Davis', 'phone_number': '+1234567892', 'current_orders': 0, 'max_capacity': 3},
            {'name': 'Emma Wilson', 'phone_number': '+1234567893', 'current_orders': 0, 'max_capacity': 2},
        ]

        for waiter_data in waiters_data:
            waiter = Waiter.objects.create(**waiter_data)
            self.stdout.write(f'Created waiter: {waiter.name}')

        self.stdout.write(self.style.SUCCESS('Successfully populated database with sample data'))