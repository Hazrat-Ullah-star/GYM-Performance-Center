from rest_framework import serializers
from .models import Trainer, GymClass, ClassSchedule, Booking, Membership, WorkoutLog
from apps.users.serializers import UserSerializer


class TrainerSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Trainer
        fields = [
            'id', 'user', 'specialties', 'certifications', 'years_experience',
            'bio', 'hourly_rate', 'is_available', 'rating', 'total_clients'
        ]
        read_only_fields = ['rating', 'total_clients']


class GymClassSerializer(serializers.ModelSerializer):
    trainer = TrainerSerializer(read_only=True)
    available_spots = serializers.SerializerMethodField()
    
    class Meta:
        model = GymClass
        fields = [
            'id', 'name', 'description', 'class_type', 'difficulty', 'trainer',
            'duration_minutes', 'max_capacity', 'image', 'is_active', 'available_spots'
        ]
    
    def get_available_spots(self, obj):
        # Calculate average available spots across all schedules
        schedules = obj.schedules.filter(is_active=True)
        if not schedules.exists():
            return obj.max_capacity
        return obj.max_capacity  # Simplified for now


class ClassScheduleSerializer(serializers.ModelSerializer):
    gym_class = GymClassSerializer(read_only=True)
    gym_class_id = serializers.PrimaryKeyRelatedField(
        queryset=GymClass.objects.all(),
        source='gym_class',
        write_only=True
    )
    available_spots = serializers.ReadOnlyField()
    day_name = serializers.CharField(source='get_day_of_week_display', read_only=True)
    
    class Meta:
        model = ClassSchedule
        fields = [
            'id', 'gym_class', 'gym_class_id', 'day_of_week', 'day_name',
            'start_time', 'end_time', 'room', 'is_active', 'available_spots'
        ]


class BookingSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class_schedule = ClassScheduleSerializer(read_only=True)
    class_schedule_id = serializers.PrimaryKeyRelatedField(
        queryset=ClassSchedule.objects.all(),
        source='class_schedule',
        write_only=True
    )
    class_name = serializers.CharField(source='class_schedule.gym_class.name', read_only=True)
    
    class Meta:
        model = Booking
        fields = [
            'id', 'user', 'class_schedule', 'class_schedule_id', 'class_name',
            'booking_date', 'status', 'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']
    
    def validate(self, data):
        # Check if class is already full
        class_schedule = data.get('class_schedule')
        booking_date = data.get('booking_date')
        
        if class_schedule:
            existing_bookings = Booking.objects.filter(
                class_schedule=class_schedule,
                booking_date=booking_date,
                status='confirmed'
            ).count()
            
            if existing_bookings >= class_schedule.gym_class.max_capacity:
                raise serializers.ValidationError("This class is already full.")
        
        return data
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class MembershipSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    is_active = serializers.ReadOnlyField()
    plan_name = serializers.CharField(source='get_plan_type_display', read_only=True)
    
    class Meta:
        model = Membership
        fields = [
            'id', 'user', 'plan_type', 'plan_name', 'status', 'start_date',
            'end_date', 'monthly_fee', 'auto_renew', 'is_active'
        ]
        read_only_fields = ['user']


class WorkoutLogSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = WorkoutLog
        fields = [
            'id', 'user', 'exercise_name', 'sets', 'reps', 'weight_kg',
            'duration_minutes', 'calories_burned', 'notes', 'workout_date', 'created_at'
        ]
        read_only_fields = ['user', 'created_at']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
