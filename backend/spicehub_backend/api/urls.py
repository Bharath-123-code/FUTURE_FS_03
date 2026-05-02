from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, MenuItemViewSet, WaiterViewSet, OrderViewSet, MissedCallViewSet, AvailableWaitersView

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'menu-items', MenuItemViewSet)
router.register(r'waiters', WaiterViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'missed-calls', MissedCallViewSet)
router.register(r'available-waiters', AvailableWaitersView, basename='available-waiters')

urlpatterns = [
    path('', include(router.urls)),
]
