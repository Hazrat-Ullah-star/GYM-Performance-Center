import re
from django.contrib.auth import get_user_model
from .models import Notification, Mention, Like, Post, Bookmark, Share, Comment, Follow

User = get_user_model()

def parse_mentions(content, exclude_user=None):
    handles = set(re.findall(r'@(\w+)', content))
    qs = User.objects.filter(username__in=handles)
    if exclude_user:
        qs = qs.exclude(pk=exclude_user.pk)
    return qs

def create_notification(user, notif_type, message, related_post=None, related_user=None):
    Notification.objects.create(
        user=user,
        type=notif_type,
        message=message,
        related_post=related_post,
        related_user=related_user,
    )

def handle_post_mentions(post, current_user):
    for mentioned_user in parse_mentions(post.content, exclude_user=current_user):
        Mention.objects.create(mentioned_user=mentioned_user, post=post)
        create_notification(
            user=mentioned_user,
            notif_type='mention',
            message=f'@{current_user.username} mentioned you in a post',
            related_post=post,
            related_user=current_user,
        )

def toggle_like_post(post, user):
    like, created = Like.objects.get_or_create(post=post, user=user)
    if not created:
        like.delete()
        Post.objects.filter(pk=post.pk).update(likes_count=post.likes_count - 1)
        return False, post.likes_count - 1

    Post.objects.filter(pk=post.pk).update(likes_count=post.likes_count + 1)
    if post.author != user:
        create_notification(
            user=post.author,
            notif_type='like',
            message=f'{user.display_name} liked your post',
            related_post=post,
            related_user=user,
        )
    return True, post.likes_count + 1

def toggle_bookmark_post(post, user):
    bm, created = Bookmark.objects.get_or_create(post=post, user=user)
    if not created:
        bm.delete()
        Post.objects.filter(pk=post.pk).update(bookmarks_count=post.bookmarks_count - 1)
        return False, post.bookmarks_count - 1

    Post.objects.filter(pk=post.pk).update(bookmarks_count=post.bookmarks_count + 1)
    return True, post.bookmarks_count + 1

def share_post(post, user):
    Share.objects.create(post=post, user=user)
    Post.objects.filter(pk=post.pk).update(shares_count=post.shares_count + 1)
    return post.shares_count + 1

def handle_comment_creation(comment, post, current_user):
    Post.objects.filter(pk=post.pk).update(comments_count=post.comments_count + 1)

    if post.author != current_user:
        create_notification(
            user=post.author,
            notif_type='comment',
            message=f'{current_user.display_name} commented on your post',
            related_post=post,
            related_user=current_user,
        )

    if comment.parent and comment.parent.author != current_user:
        create_notification(
            user=comment.parent.author,
            notif_type='reply',
            message=f'{current_user.display_name} replied to your comment',
            related_post=post,
            related_user=current_user,
        )

    for mentioned_user in parse_mentions(comment.content, exclude_user=current_user):
        Mention.objects.create(mentioned_user=mentioned_user, comment=comment)
        create_notification(
            user=mentioned_user,
            notif_type='mention',
            message=f'@{current_user.username} mentioned you in a comment',
            related_post=post,
            related_user=current_user,
        )

def toggle_like_comment(comment, user):
    like, created = Like.objects.get_or_create(comment=comment, user=user)
    if not created:
        like.delete()
        Comment.objects.filter(pk=comment.pk).update(likes_count=comment.likes_count - 1)
        return False, comment.likes_count - 1

    Comment.objects.filter(pk=comment.pk).update(likes_count=comment.likes_count + 1)
    return True, comment.likes_count + 1

def toggle_follow(target_user, follower):
    follow, created = Follow.objects.get_or_create(follower=follower, following=target_user)
    if not created:
        follow.delete()
        return False

    create_notification(
        user=target_user,
        notif_type='follow',
        message=f'{follower.display_name} started following you',
        related_user=follower,
    )
    return True

def mark_notification_read(notification):
    notification.is_read = True
    notification.save(update_fields=['is_read'])

def mark_all_notifications_read(user):
    Notification.objects.filter(user=user).update(is_read=True)
