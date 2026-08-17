"""
Optimised selectors — all N+1 queries eliminated via annotate()+Exists() subqueries.
A page of 12 posts now executes ~4 total queries instead of 12*N.
"""
import re
import datetime
from django.contrib.auth import get_user_model
from django.db.models import Count, Q, Exists, OuterRef, Subquery, IntegerField
from django.utils import timezone

from .models import Post, Tag, Notification, Follow, Like, Bookmark, Share, Comment

User = get_user_model()


def _annotate_posts_for_user(qs, user=None):
    """
    Annotate a Post queryset with per-user boolean flags:
      - is_liked       — current user liked this post
      - is_bookmarked  — current user bookmarked this post

    These replace SerializerMethodField DB hits, collapsing N queries into 0
    (the annotations are part of the original SQL WHERE clause via subquery).
    """
    if user and user.is_authenticated:
        qs = qs.annotate(
            is_liked=Exists(
                Like.objects.filter(post=OuterRef('pk'), user=user)
            ),
            is_bookmarked=Exists(
                Bookmark.objects.filter(post=OuterRef('pk'), user=user)
            ),
        )
    else:
        from django.db.models import Value
        from django.db.models.functions import Cast
        from django.db.models import BooleanField
        qs = qs.annotate(
            is_liked=Value(False, output_field=BooleanField()),
            is_bookmarked=Value(False, output_field=BooleanField()),
        )
    return qs


def get_posts(search=None, tag=None, feed_filter=None, user=None):
    """
    Return an annotated Post queryset.

    Optimisations applied:
    - select_related('author')      → avoids per-post author SELECT
    - prefetch_related('tags')      → 1 query for all tags (M2M)
    - is_liked / is_bookmarked      → Exists() subqueries (0 extra queries)
    - denormalised counters used    → no COUNT(*) per post
    """
    qs = (
        Post.objects
        .select_related('author')
        .prefetch_related('tags')
        .only(
            'id', 'title', 'content', 'image', 'created_at', 'updated_at',
            'likes_count', 'comments_count', 'shares_count', 'bookmarks_count',
            'author__id', 'author__username', 'author__display_name',
            'author__avatar', 'author__role', 'author__bio',
        )
    )

    qs = _annotate_posts_for_user(qs, user)

    if search:
        qs = qs.filter(Q(title__icontains=search) | Q(content__icontains=search))

    if tag:
        qs = qs.filter(tags__slug=tag)

    if feed_filter == 'trending':
        qs = qs.order_by('-likes_count', '-comments_count', '-created_at')
    elif feed_filter == 'following' and user and user.is_authenticated:
        following_ids = (
            Follow.objects
            .filter(follower=user)
            .values_list('following_id', flat=True)
        )
        qs = qs.filter(author_id__in=following_ids).order_by('-created_at')
    elif feed_filter == 'bookmarked' and user and user.is_authenticated:
        bookmarked_ids = (
            Bookmark.objects
            .filter(user=user)
            .values_list('post_id', flat=True)
        )
        qs = qs.filter(id__in=bookmarked_ids).order_by('-created_at')
    else:
        qs = qs.order_by('-created_at')

    return qs


def get_post_comments(post):
    """Top-level comments with replies and author prefetched."""
    return (
        post.comments
        .filter(parent__isnull=True)
        .select_related('author')
        .prefetch_related('replies__author')
        .only(
            'id', 'content', 'likes_count', 'created_at', 'updated_at',
            'parent_id', 'post_id',
            'author__id', 'author__username', 'author__display_name',
            'author__avatar', 'author__role',
        )
    )


def get_trending_tags():
    return Tag.objects.order_by('-post_count')[:10]


def get_trending_posts():
    week_ago = timezone.now() - datetime.timedelta(days=7)
    return (
        Post.objects
        .filter(created_at__gte=week_ago)
        .select_related('author')
        .prefetch_related('tags')
        .order_by('-likes_count', '-comments_count', '-shares_count')
    )


def get_suggested_users(user):
    """
    Users the current user does not yet follow, ordered by follower count.
    followers_count, following_count, posts_count are annotated — 0 extra queries.
    """
    following_ids = (
        Follow.objects
        .filter(follower=user)
        .values_list('following_id', flat=True)
    )
    return (
        User.objects
        .exclude(pk=user.pk)
        .exclude(pk__in=following_ids)
        .annotate(
            followers_count=Count('followers', distinct=True),
            following_count=Count('following', distinct=True),
            posts_count=Count('posts', distinct=True),
            is_following_annotated=Exists(
                Follow.objects.filter(follower=user, following=OuterRef('pk'))
            ),
        )
        .order_by('-followers_count')[:8]
    )


def get_popular_trainers():
    return (
        User.objects
        .filter(role='trainer')
        .annotate(
            followers_count=Count('followers', distinct=True),
            following_count=Count('following', distinct=True),
            posts_count=Count('posts', distinct=True),
        )
        .order_by('-followers_count')[:6]
    )


def get_notifications(user, unread_only=False):
    qs = (
        Notification.objects
        .filter(user=user)
        .select_related('related_user', 'related_post')
        .only(
            'id', 'type', 'message', 'is_read', 'created_at',
            'related_post_id',
            'related_user__id', 'related_user__username',
            'related_user__display_name', 'related_user__avatar', 'related_user__role',
        )
    )
    if unread_only:
        qs = qs.filter(is_read=False)
    return qs
