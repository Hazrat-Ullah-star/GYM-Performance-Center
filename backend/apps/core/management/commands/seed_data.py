from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.community.models import Post, Comment, Like
from faker import Faker
import random

User = get_user_model()
fake = Faker()


class Command(BaseCommand):
    help = 'Seed database with demo data'

    def add_arguments(self, parser):
        parser.add_argument(
            '--users',
            type=int,
            default=10,
            help='Number of users to create'
        )
        parser.add_argument(
            '--posts',
            type=int,
            default=20,
            help='Number of posts to create'
        )

    def handle(self, *args, **options):
        self.stdout.write('Seeding database...')

        # Create admin user
        if not User.objects.filter(email='admin@gym.com').exists():
            admin = User.objects.create_superuser(
                email='admin@gym.com',
                username='admin',
                password='admin123',
                display_name='Admin User',
                role='admin'
            )
            self.stdout.write(self.style.SUCCESS(f'Created admin user: admin@gym.com / admin123'))

        # Create demo users
        users = []
        for i in range(options['users']):
            username = fake.user_name()
            email = f'user{i}@gym.com'
            
            if not User.objects.filter(email=email).exists():
                user = User.objects.create_user(
                    email=email,
                    username=username,
                    password='password123',
                    display_name=fake.name(),
                    bio=fake.text(max_nb_chars=200),
                    role=random.choice(['member', 'trainer'])
                )
                users.append(user)
                self.stdout.write(f'Created user: {email}')

        if not users:
            users = list(User.objects.filter(email__startswith='user'))

        # Create posts
        for i in range(options['posts']):
            author = random.choice(users)
            post = Post.objects.create(
                author=author,
                title=fake.sentence(nb_words=6),
                content=fake.paragraph(nb_sentences=5),
            )
            
            # Add random likes
            likers = random.sample(users, k=random.randint(0, min(5, len(users))))
            for liker in likers:
                Like.objects.get_or_create(post=post, user=liker)
            
            # Add random comments
            num_comments = random.randint(0, 3)
            for _ in range(num_comments):
                commenter = random.choice(users)
                Comment.objects.create(
                    post=post,
                    author=commenter,
                    content=fake.sentence(nb_words=10)
                )
            
            self.stdout.write(f'Created post: {post.title}')

        self.stdout.write(self.style.SUCCESS('Database seeded successfully!'))
        self.stdout.write(self.style.WARNING('\nDemo Accounts:'))
        self.stdout.write('  Admin: admin@gym.com / admin123')
        self.stdout.write('  User: user0@gym.com / password123')
