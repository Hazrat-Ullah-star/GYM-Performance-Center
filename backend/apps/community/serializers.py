from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Post, Comment, Like, Bookmark, Share, Follow, Tag, Notification
from apps.core.utils import sanitize_html

User = get_user_model()


# ---------------------------------------------------------------------------
# User / Profile serializers
# ---------------------------------------------------------------------------

class AuthorSerializer(serializers.ModelSerializer):
    """Minimal author representation used inside other serializers"""
    followers_count = serializers.IntegerField(read_only=True, required=False)
    is_following = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'display_name', 'avatar', 'role',
                  'bio', 'followers_count', 'is_following']

    def get_is_following(self, obj):
        # Prefer the annotated value if it exists (from get_suggested_users)
        if hasattr(obj, 'is_following_annotated'):
            return obj.is_following_annotated
            
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Follow.objects.filter(
                follower=request.user, following=obj
            ).exists()
        return False


class UserProfileSerializer(serializers.ModelSerializer):
    """Full user profile with social stats"""
    followers_count = serializers.IntegerField(read_only=True, required=False)
    following_count = serializers.IntegerField(read_only=True, required=False)
    posts_count = serializers.IntegerField(read_only=True, required=False)
    is_following = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'display_name', 'avatar', 'bio', 'role',
            'joined_at', 'followers_count', 'following_count', 'posts_count',
            'is_following',
        ]

    def get_is_following(self, obj):
        if hasattr(obj, 'is_following_annotated'):
            return obj.is_following_annotated
            
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Follow.objects.filter(
                follower=request.user, following=obj
            ).exists()
        return False


# ---------------------------------------------------------------------------
# Tag
# ---------------------------------------------------------------------------

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug', 'post_count']


# ---------------------------------------------------------------------------
# Comments / Replies
# ---------------------------------------------------------------------------

class ReplySerializer(serializers.ModelSerializer):
    """Flat reply — no deeper nesting"""
    author = AuthorSerializer(read_only=True)
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'author', 'content', 'likes_count', 'is_liked', 'created_at']
        read_only_fields = ['id', 'author', 'likes_count', 'created_at']

    def validate_content(self, value):
        return sanitize_html(value)

    def get_is_liked(self, obj):
        if hasattr(obj, 'is_liked_annotated'):
            return obj.is_liked_annotated
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Like.objects.filter(comment=obj, user=request.user).exists()
        return False


class CommentSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)
    replies = ReplySerializer(many=True, read_only=True)
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            'id', 'author', 'content', 'parent', 'likes_count',
            'is_liked', 'replies', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'author', 'likes_count', 'created_at', 'updated_at']

    def validate_content(self, value):
        return sanitize_html(value)

    def get_is_liked(self, obj):
        if hasattr(obj, 'is_liked_annotated'):
            return obj.is_liked_annotated
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Like.objects.filter(comment=obj, user=request.user).exists()
        return False


# ---------------------------------------------------------------------------
# Post
# ---------------------------------------------------------------------------

class PostSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    tag_names = serializers.ListField(
        child=serializers.CharField(max_length=50),
        write_only=True,
        required=False,
    )
    is_liked = serializers.SerializerMethodField()
    is_bookmarked = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id', 'author', 'title', 'content', 'image', 'tags', 'tag_names',
            'likes_count', 'comments_count', 'shares_count', 'bookmarks_count',
            'is_liked', 'is_bookmarked', 'created_at', 'updated_at',
        ]
        read_only_fields = [
            'id', 'author', 'likes_count', 'comments_count',
            'shares_count', 'bookmarks_count', 'created_at', 'updated_at',
        ]

    def validate_content(self, value):
        return sanitize_html(value)

    def get_is_liked(self, obj):
        if hasattr(obj, 'is_liked'):
            return obj.is_liked
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Like.objects.filter(post=obj, user=request.user).exists()
        return False

    def get_is_bookmarked(self, obj):
        if hasattr(obj, 'is_bookmarked'):
            return obj.is_bookmarked
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Bookmark.objects.filter(post=obj, user=request.user).exists()
        return False

    def create(self, validated_data):
        tag_names = validated_data.pop('tag_names', [])
        post = super().create(validated_data)
        self._set_tags(post, tag_names)
        return post

    def update(self, instance, validated_data):
        tag_names = validated_data.pop('tag_names', None)
        post = super().update(instance, validated_data)
        if tag_names is not None:
            self._set_tags(post, tag_names)
        return post

    def _set_tags(self, post, tag_names):
        tags = []
        for name in tag_names:
            name = name.strip().lstrip('#').lower()
            if name:
                tag, _ = Tag.objects.get_or_create(name=name)
                tags.append(tag)
        post.tags.set(tags)
        # Update post_count on affected tags
        for tag in tags:
            tag.post_count = tag.posts.count()
            tag.save(update_fields=['post_count'])


# ---------------------------------------------------------------------------
# Notification
# ---------------------------------------------------------------------------

class NotificationSerializer(serializers.ModelSerializer):
    related_user = AuthorSerializer(read_only=True)

    class Meta:
        model = Notification
        fields = [
            'id', 'type', 'message', 'is_read', 'created_at',
            'related_post', 'related_user',
        ]
        read_only_fields = ['id', 'created_at']
