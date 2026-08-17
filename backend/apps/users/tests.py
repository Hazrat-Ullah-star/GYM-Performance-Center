import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user(db):
    return User.objects.create_user(
        email='test@example.com',
        username='testuser',
        password='testpass123',
        display_name='Test User'
    )


@pytest.mark.django_db
class TestUserRegistration:
    def test_register_user(self, api_client):
        """Test user registration"""
        data = {
            'email': 'newuser@example.com',
            'username': 'newuser',
            'password': 'newpass123',
            'password_confirm': 'newpass123'
        }
        response = api_client.post('/api/auth/register/', data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert 'user' in response.data
        assert 'tokens' in response.data
        assert response.data['user']['email'] == data['email']
    
    def test_register_password_mismatch(self, api_client):
        """Test registration with mismatched passwords"""
        data = {
            'email': 'newuser@example.com',
            'username': 'newuser',
            'password': 'newpass123',
            'password_confirm': 'differentpass'
        }
        response = api_client.post('/api/auth/register/', data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestAuthentication:
    def test_login(self, api_client, user):
        """Test user login"""
        data = {
            'email': 'test@example.com',
            'password': 'testpass123'
        }
        response = api_client.post('/api/auth/token/', data)
        
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data
        assert 'refresh' in response.data
    
    def test_get_current_user(self, api_client, user):
        """Test getting current user profile"""
        api_client.force_authenticate(user=user)
        response = api_client.get('/api/users/me/')
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['email'] == user.email


@pytest.mark.django_db
class TestPosts:
    def test_create_post(self, api_client, user):
        """Test creating a post"""
        api_client.force_authenticate(user=user)
        data = {
            'title': 'Test Post',
            'content': 'This is a test post'
        }
        response = api_client.post('/api/community/posts/', data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['title'] == data['title']
        assert response.data['author']['id'] == user.id
    
    def test_list_posts(self, api_client):
        """Test listing posts"""
        response = api_client.get('/api/community/posts/')
        
        assert response.status_code == status.HTTP_200_OK
        assert 'results' in response.data
