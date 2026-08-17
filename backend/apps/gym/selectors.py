from datetime import date, timedelta
from django.db.models import Count, Sum, Avg
from .models import ClassSchedule, Booking, Membership, WorkoutLog

def get_week_schedule():
    return ClassSchedule.objects.filter(is_active=True).select_related('gym_class', 'gym_class__trainer')

def get_bookings_for_user(user):
    if user.role in ['admin', 'receptionist'] or user.is_superuser:
        return Booking.objects.all()
    return Booking.objects.filter(user=user)

def get_upcoming_bookings(user):
    today = date.today()
    return get_bookings_for_user(user).filter(
        booking_date__gte=today,
        status__in=['pending', 'confirmed']
    )

def get_memberships_for_user(user):
    if user.role in ['admin', 'receptionist'] or user.is_superuser:
        return Membership.objects.all()
    return Membership.objects.filter(user=user)

def get_user_membership(user):
    try:
        return Membership.objects.get(user=user)
    except Membership.DoesNotExist:
        return None

def get_workout_logs_for_user(user):
    if user.role in ['admin', 'trainer'] or user.is_superuser:
        return WorkoutLog.objects.all()
    return WorkoutLog.objects.filter(user=user)

def get_recent_workout_logs(user):
    start_date = date.today() - timedelta(days=30)
    return get_workout_logs_for_user(user).filter(workout_date__gte=start_date)

def get_workout_stats(user):
    logs = get_recent_workout_logs(user)
    return logs.aggregate(
        total_workouts=Count('id'),
        total_calories=Sum('calories_burned'),
        avg_duration=Avg('duration_minutes'),
        total_sets=Sum('sets'),
        total_reps=Sum('reps')
    )
