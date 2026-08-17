from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Trainer, GymClass, ClassSchedule, Booking, Membership, WorkoutLog
from .serializers import (
    TrainerSerializer, GymClassSerializer, ClassScheduleSerializer,
    BookingSerializer, MembershipSerializer, WorkoutLogSerializer
)
from . import selectors, services


class TrainerViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for browsing trainers
    """
    queryset = Trainer.objects.filter(is_available=True)
    serializer_class = TrainerSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['user__display_name', 'specialties', 'bio']
    ordering_fields = ['rating', 'years_experience', 'hourly_rate']
    ordering = ['-rating']


class GymClassViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for browsing gym classes
    """
    queryset = GymClass.objects.filter(is_active=True)
    serializer_class = GymClassSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    filterset_fields = ['class_type', 'difficulty']
    ordering = ['name']


class ClassScheduleViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for browsing class schedules
    """
    serializer_class = ClassScheduleSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    filterset_fields = ['day_of_week', 'gym_class__class_type']
    ordering = ['day_of_week', 'start_time']
    
    def get_queryset(self):
        return selectors.get_week_schedule()
    
    @action(detail=False, methods=['get'])
    def week_schedule(self, request):
        """Get schedule for the current week"""
        schedules = self.get_queryset()
        serializer = self.get_serializer(schedules, many=True)
        
        # Group by day
        grouped = {}
        for item in serializer.data:
            day = item['day_name']
            if day not in grouped:
                grouped[day] = []
            grouped[day].append(item)
        
        return Response(grouped)


class BookingViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing class bookings
    """
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    filterset_fields = ['status', 'booking_date']
    ordering = ['-booking_date', '-created_at']
    
    def get_queryset(self):
        return selectors.get_bookings_for_user(self.request.user)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel a booking"""
        booking = self.get_object()
        
        try:
            booking = services.cancel_booking(booking)
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = self.get_serializer(booking)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """Get user's upcoming bookings"""
        bookings = selectors.get_upcoming_bookings(request.user)
        serializer = self.get_serializer(bookings, many=True)
        return Response(serializer.data)


class MembershipViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing memberships
    """
    serializer_class = MembershipSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return selectors.get_memberships_for_user(self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_membership(self, request):
        """Get current user's membership"""
        membership = selectors.get_user_membership(request.user)
        if membership:
            serializer = self.get_serializer(membership)
            return Response(serializer.data)
        
        return Response(
            {'detail': 'No active membership found'},
            status=status.HTTP_404_NOT_FOUND
        )


class WorkoutLogViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing workout logs
    """
    serializer_class = WorkoutLogSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['exercise_name', 'notes']
    ordering = ['-workout_date', '-created_at']
    
    def get_queryset(self):
        return selectors.get_workout_logs_for_user(self.request.user)
    
    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Get recent workout logs (last 30 days)"""
        logs = selectors.get_recent_workout_logs(request.user)
        serializer = self.get_serializer(logs, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get workout statistics"""
        stats = selectors.get_workout_stats(request.user)
        return Response(stats)
