from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import apis

router = DefaultRouter()
router.register(r'trainers', apis.TrainerViewSet, basename='trainer')
router.register(r'classes', apis.GymClassViewSet, basename='gymclass')
router.register(r'schedules', apis.ClassScheduleViewSet, basename='schedule')
router.register(r'bookings', apis.BookingViewSet, basename='booking')
router.register(r'memberships', apis.MembershipViewSet, basename='membership')
router.register(r'workout-logs', apis.WorkoutLogViewSet, basename='workoutlog')

urlpatterns = [
    path('', include(router.urls)),
]
