from django.core.management.base import BaseCommand
from apps.gym.models import Trainer, GymClass, ClassSchedule, Membership
from apps.users.models import User
from datetime import date, timedelta
import random


class Command(BaseCommand):
    help = 'Seed gym data (trainers, classes, schedules)'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding gym data...')

        # Create trainers
        trainer_data = [
            {
                'email': 'ahmed.trainer@gym.com',
                'username': 'ahmed_trainer',
                'display_name': 'Ahmed Hassan',
                'specialties': 'Strength Training, Bodybuilding',
                'certifications': 'ACE CPT, NASM PES',
                'years_experience': 8,
                'bio': 'Former competitive bodybuilder with 8+ years of training experience. Specialized in muscle building and strength conditioning.',
                'hourly_rate': 7500.00,
                'rating': 4.8
            },
            {
                'email': 'fatima.trainer@gym.com',
                'username': 'fatima_trainer',
                'display_name': 'Fatima Khan',
                'specialties': 'Yoga, Flexibility, Mindfulness',
                'certifications': 'RYT-500, YTT',
                'years_experience': 6,
                'bio': 'Certified yoga instructor specializing in vinyasa and restorative practices. Bringing mindfulness to every session.',
                'hourly_rate': 6000.00,
                'rating': 4.9
            },
            {
                'email': 'ali.trainer@gym.com',
                'username': 'ali_trainer',
                'display_name': 'Ali Raza',
                'specialties': 'HIIT, Cardio, Weight Loss',
                'certifications': 'NASM CPT, AFAA GFI',
                'years_experience': 5,
                'bio': 'High-energy trainer focused on results and sustainable fitness. Expert in high-intensity training and fat loss.',
                'hourly_rate': 6500.00,
                'rating': 4.7
            },
        ]

        trainers = []
        for data in trainer_data:
            user, created = User.objects.get_or_create(
                email=data['email'],
                defaults={
                    'username': data['username'],
                    'display_name': data['display_name'],
                    'role': 'trainer'
                }
            )
            if created:
                user.set_password('password123')
                user.save()

            trainer, _ = Trainer.objects.get_or_create(
                user=user,
                defaults={
                    'specialties': data['specialties'],
                    'certifications': data['certifications'],
                    'years_experience': data['years_experience'],
                    'bio': data['bio'],
                    'hourly_rate': data['hourly_rate'],
                    'rating': data['rating'],
                    'is_available': True,
                    'total_clients': random.randint(15, 50)
                }
            )
            trainers.append(trainer)
            self.stdout.write(f'Created trainer: {trainer.user.display_name}')

        # Create classes
        class_data = [
            {'name': 'Power Strength', 'type': 'strength', 'difficulty': 'intermediate', 'duration': 60, 'capacity': 15},
            {'name': 'Morning Yoga Flow', 'type': 'yoga', 'difficulty': 'beginner', 'duration': 60, 'capacity': 20},
            {'name': 'HIIT Blast', 'type': 'hiit', 'difficulty': 'advanced', 'duration': 45, 'capacity': 12},
            {'name': 'Spin Cycle', 'type': 'spin', 'difficulty': 'intermediate', 'duration': 45, 'capacity': 18},
            {'name': 'Boxing Basics', 'type': 'boxing', 'difficulty': 'beginner', 'duration': 60, 'capacity': 12},
            {'name': 'CrossFit WOD', 'type': 'crossfit', 'difficulty': 'advanced', 'duration': 60, 'capacity': 15},
            {'name': 'Pilates Core', 'type': 'pilates', 'difficulty': 'intermediate', 'duration': 50, 'capacity': 16},
            {'name': 'Cardio Blast', 'type': 'cardio', 'difficulty': 'beginner', 'duration': 45, 'capacity': 20},
        ]

        classes = []
        for data in class_data:
            gym_class, _ = GymClass.objects.get_or_create(
                name=data['name'],
                defaults={
                    'description': f"A {data['difficulty']} level {data['type']} class designed to push your limits.",
                    'class_type': data['type'],
                    'difficulty': data['difficulty'],
                    'trainer': random.choice(trainers),
                    'duration_minutes': data['duration'],
                    'max_capacity': data['capacity'],
                    'is_active': True
                }
            )
            classes.append(gym_class)
            self.stdout.write(f'Created class: {gym_class.name}')

        # Create schedules
        schedule_data = [
            (classes[0], 0, '06:00', '07:00', 'A1'),  # Power Strength - Monday 6am
            (classes[1], 0, '07:30', '08:30', 'B2'),  # Morning Yoga - Monday 7:30am
            (classes[2], 0, '17:30', '18:15', 'A1'),  # HIIT - Monday 5:30pm
            (classes[3], 1, '06:30', '07:15', 'C1'),  # Spin - Tuesday 6:30am
            (classes[4], 1, '18:00', '19:00', 'A2'),  # Boxing - Tuesday 6pm
            (classes[0], 2, '06:00', '07:00', 'A1'),  # Power Strength - Wednesday 6am
            (classes[1], 2, '07:30', '08:30', 'B2'),  # Morning Yoga - Wednesday 7:30am
            (classes[5], 2, '18:00', '19:00', 'A1'),  # CrossFit - Wednesday 6pm
            (classes[3], 3, '06:30', '07:15', 'C1'),  # Spin - Thursday 6:30am
            (classes[6], 3, '17:00', '17:50', 'B1'),  # Pilates - Thursday 5pm
            (classes[0], 4, '06:00', '07:00', 'A1'),  # Power Strength - Friday 6am
            (classes[2], 4, '17:30', '18:15', 'A1'),  # HIIT - Friday 5:30pm
            (classes[7], 5, '08:00', '08:45', 'A1'),  # Cardio - Saturday 8am
            (classes[1], 5, '09:00', '10:00', 'B2'),  # Yoga - Saturday 9am
            (classes[5], 5, '10:30', '11:30', 'A1'),  # CrossFit - Saturday 10:30am
        ]

        for gym_class, day, start, end, room in schedule_data:
            ClassSchedule.objects.get_or_create(
                gym_class=gym_class,
                day_of_week=day,
                start_time=start,
                defaults={
                    'end_time': end,
                    'room': room,
                    'is_active': True
                }
            )

        self.stdout.write('Created class schedules')

        # Create memberships for existing users
        regular_users = User.objects.filter(role='member')[:5]
        plans = ['basic', 'standard', 'premium', 'vip']
        monthly_fees = {'basic': 2999.00, 'standard': 4999.00, 'premium': 7999.00, 'vip': 12999.00}

        for user in regular_users:
            if not hasattr(user, 'membership'):
                plan = random.choice(plans)
                start = date.today() - timedelta(days=random.randint(30, 365))
                end = start + timedelta(days=365)

                Membership.objects.create(
                    user=user,
                    plan_type=plan,
                    status='active',
                    start_date=start,
                    end_date=end,
                    monthly_fee=monthly_fees[plan],
                    auto_renew=True
                )
                self.stdout.write(f'Created membership for {user.username}')

        self.stdout.write(self.style.SUCCESS('Gym data seeded successfully!'))
