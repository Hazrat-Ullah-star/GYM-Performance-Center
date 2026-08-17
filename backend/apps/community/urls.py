from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import apis

router = DefaultRouter()
router.register(r'posts', apis.PostViewSet, basename='post')
router.register(r'notifications', apis.NotificationViewSet, basename='notification')

urlpatterns = [
    path('', include(router.urls)),

    # Trending
    path('trending/tags/', apis.TrendingTagsView.as_view(), name='trending-tags'),
    path('trending/posts/', apis.TrendingPostsView.as_view(), name='trending-posts'),

    # Users / Social graph
    path('users/suggested/', apis.SuggestedUsersView.as_view(), name='suggested-users'),
    path('users/<int:user_id>/follow/', apis.FollowView.as_view(), name='follow-user'),
    path('users/<int:user_id>/profile/', apis.UserProfileView.as_view(), name='user-profile'),

    # Popular trainers
    path('trainers/popular/', apis.PopularTrainersView.as_view(), name='popular-trainers'),
]
