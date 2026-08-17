from django.contrib.auth import get_user_model
from rest_framework import viewsets, status, permissions, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

from .models import Post, Comment
from .serializers import (
    PostSerializer, CommentSerializer, NotificationSerializer,
    TagSerializer, UserProfileSerializer,
)
from . import selectors, services

User = get_user_model()

from rest_framework.pagination import PageNumberPagination, CursorPagination as DRFCursorPagination

class StandardPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 50

class CursorPagination(DRFCursorPagination):
    page_size = 12
    page_size_query_param = 'page_size'
    
    def get_ordering(self, request, queryset, view):
        filter_param = request.query_params.get('filter')
        if filter_param == 'trending':
            return ('-likes_count', '-comments_count', '-created_at')
        return ('-created_at',)

class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = CursorPagination

    def get_queryset(self):
        search = self.request.query_params.get('search')
        tag = self.request.query_params.get('tag')
        feed_filter = self.request.query_params.get('filter')
        return selectors.get_posts(search=search, tag=tag, feed_filter=feed_filter, user=self.request.user)

    def perform_create(self, serializer):
        post = serializer.save(author=self.request.user)
        services.handle_post_mentions(post, self.request.user)

    def perform_update(self, serializer):
        if serializer.instance.author != self.request.user:
            raise permissions.PermissionDenied("You can only edit your own posts.")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.author != self.request.user:
            raise permissions.PermissionDenied("You can only delete your own posts.")
        instance.delete()

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def like(self, request, pk=None):
        post = self.get_object()
        is_liked, count = services.toggle_like_post(post, request.user)
        return Response({'is_liked': is_liked, 'likes_count': count})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def bookmark(self, request, pk=None):
        post = self.get_object()
        is_bookmarked, count = services.toggle_bookmark_post(post, request.user)
        return Response({'is_bookmarked': is_bookmarked, 'bookmarks_count': count})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def share(self, request, pk=None):
        post = self.get_object()
        count = services.share_post(post, request.user)
        return Response({'shares_count': count})

    @action(detail=True, methods=['get', 'post'], permission_classes=[permissions.IsAuthenticated])
    def comments(self, request, pk=None):
        post = self.get_object()

        if request.method == 'GET':
            qs = selectors.get_post_comments(post)
            serializer = CommentSerializer(qs, many=True, context={'request': request})
            return Response(serializer.data)

        serializer = CommentSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        comment = serializer.save(author=request.user, post=post)
        
        services.handle_comment_creation(comment, post, request.user)
        return Response(CommentSerializer(comment, context={'request': request}).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], url_path='comments/(?P<comment_pk>[^/.]+)/like', permission_classes=[permissions.IsAuthenticated])
    def comment_like(self, request, pk=None, comment_pk=None):
        comment = Comment.objects.get(pk=comment_pk, post_id=pk)
        is_liked, count = services.toggle_like_comment(comment, request.user)
        return Response({'is_liked': is_liked, 'likes_count': count})

class TrendingTagsView(generics.ListAPIView):
    serializer_class = TagSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        return selectors.get_trending_tags()

class TrendingPostsView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardPagination

    def get_queryset(self):
        return selectors.get_trending_posts()

class FollowView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, user_id):
        try:
            target = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        if target == request.user:
            return Response({'detail': 'You cannot follow yourself.'}, status=status.HTTP_400_BAD_REQUEST)

        is_following = services.toggle_follow(target, request.user)
        return Response({'is_following': is_following})

class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = User.objects.all()
    lookup_field = 'pk'
    lookup_url_kwarg = 'user_id'

class SuggestedUsersView(generics.ListAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        return selectors.get_suggested_users(self.request.user)

class PopularTrainersView(generics.ListAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        return selectors.get_popular_trainers()

class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardPagination

    def get_queryset(self):
        unread_only = self.request.query_params.get('unread')
        return selectors.get_notifications(self.request.user, unread_only)

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        n = self.get_object()
        services.mark_notification_read(n)
        return Response({'status': 'marked as read'})

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        services.mark_all_notifications_read(request.user)
        return Response({'status': 'all marked as read'})

    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        count = self.get_queryset().filter(is_read=False).count()
        return Response({'unread_count': count})
