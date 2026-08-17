from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator


class Trainer(models.Model):
    """
    Model for gym trainers/instructors
    """
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='trainer_profile'
    )
    specialties = models.CharField(max_length=255, help_text="e.g., Strength, Cardio, Yoga")
    certifications = models.TextField(blank=True)
    years_experience = models.PositiveIntegerField(default=0)
    bio = models.TextField(blank=True)
    hourly_rate = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    is_available = models.BooleanField(default=True)
    rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=5.0,
        validators=[MinValueValidator(0), MaxValueValidator(5)]
    )
    total_clients = models.PositiveIntegerField(default=0)
    
    class Meta:
        db_table = 'trainers'
        ordering = ['-rating', 'user__display_name']
    
    def __str__(self):
        return f"Trainer: {self.user.display_name}"


class GymClass(models.Model):
    """
    Model for gym classes/sessions
    """
    CLASS_TYPES = (
        ('strength', 'Strength Training'),
        ('cardio', 'Cardio'),
        ('yoga', 'Yoga'),
        ('hiit', 'HIIT'),
        ('spin', 'Spin'),
        ('pilates', 'Pilates'),
        ('boxing', 'Boxing'),
        ('crossfit', 'CrossFit'),
    )
    
    DIFFICULTY_LEVELS = (
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    )
    
    name = models.CharField(max_length=200)
    description = models.TextField()
    class_type = models.CharField(max_length=20, choices=CLASS_TYPES)
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_LEVELS)
    trainer = models.ForeignKey(
        Trainer,
        on_delete=models.SET_NULL,
        null=True,
        related_name='classes'
    )
    duration_minutes = models.PositiveIntegerField(default=60)
    max_capacity = models.PositiveIntegerField(default=20)
    image = models.ImageField(upload_to='classes/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'gym_classes'
        ordering = ['name']
        verbose_name_plural = 'Gym Classes'
    
    def __str__(self):
        return f"{self.name} ({self.class_type})"


class ClassSchedule(models.Model):
    """
    Model for scheduled class sessions
    """
    DAYS_OF_WEEK = (
        (0, 'Monday'),
        (1, 'Tuesday'),
        (2, 'Wednesday'),
        (3, 'Thursday'),
        (4, 'Friday'),
        (5, 'Saturday'),
        (6, 'Sunday'),
    )
    
    gym_class = models.ForeignKey(
        GymClass,
        on_delete=models.CASCADE,
        related_name='schedules'
    )
    day_of_week = models.IntegerField(choices=DAYS_OF_WEEK)
    start_time = models.TimeField()
    end_time = models.TimeField()
    room = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'class_schedules'
        ordering = ['day_of_week', 'start_time']
        unique_together = ['gym_class', 'day_of_week', 'start_time']
    
    def __str__(self):
        return f"{self.gym_class.name} - {self.get_day_of_week_display()} {self.start_time}"
    
    @property
    def available_spots(self):
        booked_count = self.bookings.filter(status='confirmed').count()
        return self.gym_class.max_capacity - booked_count


class Booking(models.Model):
    """
    Model for class bookings/reservations
    """
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    )
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='bookings'
    )
    class_schedule = models.ForeignKey(
        ClassSchedule,
        on_delete=models.CASCADE,
        related_name='bookings'
    )
    booking_date = models.DateField(help_text="Date of the class session")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='confirmed')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'bookings'
        ordering = ['-booking_date', '-created_at']
        unique_together = ['user', 'class_schedule', 'booking_date']
    
    def __str__(self):
        return f"{self.user.username} - {self.class_schedule} on {self.booking_date}"


class Membership(models.Model):
    """
    Model for gym memberships
    """
    PLAN_TYPES = (
        ('basic', 'Basic'),
        ('standard', 'Standard'),
        ('premium', 'Premium'),
        ('vip', 'VIP'),
    )
    
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('cancelled', 'Cancelled'),
        ('expired', 'Expired'),
    )
    
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='membership'
    )
    plan_type = models.CharField(max_length=20, choices=PLAN_TYPES, default='basic')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    start_date = models.DateField()
    end_date = models.DateField()
    monthly_fee = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    auto_renew = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'memberships'
        ordering = ['-start_date']
    
    def __str__(self):
        return f"{self.user.username} - {self.plan_type} ({self.status})"
    
    @property
    def is_active(self):
        from datetime import date
        return self.status == 'active' and self.end_date >= date.today()


class WorkoutLog(models.Model):
    """
    Model for tracking user workouts
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='workout_logs'
    )
    exercise_name = models.CharField(max_length=200)
    sets = models.PositiveIntegerField(default=0)
    reps = models.PositiveIntegerField(default=0)
    weight_kg = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    duration_minutes = models.PositiveIntegerField(null=True, blank=True)
    calories_burned = models.PositiveIntegerField(null=True, blank=True)
    notes = models.TextField(blank=True)
    workout_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'workout_logs'
        ordering = ['-workout_date', '-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.exercise_name} on {self.workout_date}"
