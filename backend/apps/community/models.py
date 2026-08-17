from django.db import models
from django.conf import settings
from django.utils.text import slugify
from apps.core.validators import validate_image_file


class Tag(models.Model):
    """Hashtag model — e.g. #strength, #hiit, #nutrition"""
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=50, unique=True, blank=True)
    post_count = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'tags'
        ordering = ['-post_count']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f'#{self.name}'


class Post(models.Model):
    """Community post with rich social features"""
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='posts'
    )
    title = models.CharField(max_length=255, blank=True)
    content = models.TextField()
    image = models.ImageField(
        upload_to='posts/', 
        blank=True, 
        null=True,
        validators=[validate_image_file]
    )
    tags = models.ManyToManyField(Tag, blank=True, related_name='posts')

    # Denormalised counters for fast queries (no COUNT(*) every request)
    likes_count = models.PositiveIntegerField(default=0)
    comments_count = models.PositiveIntegerField(default=0)
    shares_count = models.PositiveIntegerField(default=0)
    bookmarks_count = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'posts'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['-likes_count']),
        ]

    def __str__(self):
        return f"Post by {self.author.username} — {self.created_at:%Y-%m-%d}"


class Comment(models.Model):
    """Comment with optional parent for nested replies"""
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='replies'
    )
    content = models.TextField()
    likes_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'comments'
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['post', 'parent']),
        ]

    def __str__(self):
        return f"Comment by {self.author.username} on post {self.post_id}"

    @property
    def is_reply(self):
        return self.parent_id is not None


class Like(models.Model):
    """Polymorphic-ish like — either on a Post or on a Comment"""
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name='likes',
        null=True,
        blank=True
    )
    comment = models.ForeignKey(
        Comment,
        on_delete=models.CASCADE,
        related_name='likes',
        null=True,
        blank=True
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='likes'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'likes'
        unique_together = [
            ['post', 'user'],
            ['comment', 'user'],
        ]
        indexes = [
            models.Index(fields=['post', 'user']),
        ]

    def __str__(self):
        target = f'post {self.post_id}' if self.post_id else f'comment {self.comment_id}'
        return f"{self.user.username} → {target}"


class Bookmark(models.Model):
    """Saved posts per user"""
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='bookmarks')
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='bookmarks'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'bookmarks'
        unique_together = ['post', 'user']
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'post']),
        ]

    def __str__(self):
        return f"{self.user.username} bookmarked post {self.post_id}"


class Share(models.Model):
    """Post shares tracker"""
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='shares')
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='shares'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'shares'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} shared post {self.post_id}"


class Follow(models.Model):
    """Follow / unfollow between users"""
    follower = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='following'
    )
    following = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='followers'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'follows'
        unique_together = ['follower', 'following']
        indexes = [
            models.Index(fields=['following']),
        ]

    def __str__(self):
        return f"{self.follower.username} → {self.following.username}"


class Mention(models.Model):
    """@mention tracking in posts or comments"""
    mentioned_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='mentions'
    )
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='mentions'
    )
    comment = models.ForeignKey(
        Comment,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='mentions'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'mentions'

    def __str__(self):
        return f"@{self.mentioned_user.username}"


class Notification(models.Model):
    """Rich activity notification for all social events"""
    TYPE_CHOICES = (
        ('like', 'Like'),
        ('comment', 'Comment'),
        ('reply', 'Reply'),
        ('follow', 'Follow'),
        ('mention', 'Mention'),
        ('bookmark', 'Bookmark'),
        ('share', 'Share'),
        ('system', 'System'),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    message = models.CharField(max_length=255)
    is_read = models.BooleanField(default=False, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    related_post = models.ForeignKey(
        Post,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='notifications'
    )
    related_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='triggered_notifications'
    )

    class Meta:
        db_table = 'notifications'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'is_read']),
        ]

    def __str__(self):
        return f"[{self.type}] → {self.user.username}: {self.message}"
