from django.contrib import admin
from .models import Trainer, GymClass, ClassSchedule, Booking, Membership, WorkoutLog


@admin.register(Trainer)
class TrainerAdmin(admin.ModelAdmin):
    list_display = ('user', 'specialties', 'years_experience', 'rating', 'is_available')
    list_filter = ('is_available', 'specialties')
    search_fields = ('user__username', 'user__email', 'specialties')
    ordering = ('-rating',)


@admin.register(GymClass)
class GymClassAdmin(admin.ModelAdmin):
    list_display = ('name', 'class_type', 'difficulty', 'trainer', 'duration_minutes', 'max_capacity', 'is_active')
    list_filter = ('class_type', 'difficulty', 'is_active')
    search_fields = ('name', 'description')
    ordering = ('name',)


@admin.register(ClassSchedule)
class ClassScheduleAdmin(admin.ModelAdmin):
    list_display = ('gym_class', 'day_of_week', 'start_time', 'end_time', 'room', 'is_active')
    list_filter = ('day_of_week', 'is_active')
    search_fields = ('gym_class__name', 'room')
    ordering = ('day_of_week', 'start_time')


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('user', 'class_schedule', 'booking_date', 'status', 'created_at')
    list_filter = ('status', 'booking_date')
    search_fields = ('user__username', 'user__email', 'class_schedule__gym_class__name')
    ordering = ('-booking_date', '-created_at')
    date_hierarchy = 'booking_date'


@admin.register(Membership)
class MembershipAdmin(admin.ModelAdmin):
    list_display = ('user', 'plan_type', 'status', 'start_date', 'end_date', 'auto_renew')
    list_filter = ('plan_type', 'status', 'auto_renew')
    search_fields = ('user__username', 'user__email')
    ordering = ('-start_date',)
    date_hierarchy = 'start_date'


@admin.register(WorkoutLog)
class WorkoutLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'exercise_name', 'sets', 'reps', 'weight_kg', 'workout_date')
    list_filter = ('workout_date',)
    search_fields = ('user__username', 'exercise_name')
    ordering = ('-workout_date', '-created_at')
    date_hierarchy = 'workout_date'
