from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_profile')
    user_name = models.TextField(blank=False)
    display_profile = models.ImageField(upload_to='display_profile/')
    bio = models.TextField(blank=True, default = '')

    def __str__(self):
        return f"{self.user_id.username} profile."


class Follow(models.Model):
    # related name is following, because when you would write user_id.following, then you would get the list
    # users that the user follows.
    followers = models.ForeignKey(
        User,
        related_name="following",
        on_delete=models.CASCADE
    )

    # this foreign key should only be a User instance and not an integer.
    following = models.ForeignKey(
        User,
        related_name="followers",
        on_delete=models.CASCADE
    )

    class Meta:
        unique_together = ('followers', 'following')

    def __str__(self):
        return f"{self.user_id.username} profile."
