from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_profile')
    user_name = models.TextField(blank=False)
    display_profile = models.ImageField(upload_to='display_profile/')
    bio = models.TextField(blank=True, default = '')
    total_posts = models.IntegerField(blank=False, default=0)
    followers = models.IntegerField(blank=False, default=0)
    following  = models.IntegerField(blank=False, default=0)

    def __str__(self):
        return f"{self.user_id.user_name} profile."


# class Follow(models.Model):
#     follower = models.ForeignKey(
#         UserProfile,
#         related_name="following",
#         on_delete=models.CASCADE
#     )
#     following = models.ForeignKey(
#         UserProfile,
#         related_name="followers",
#         on_delete=models.CASCADE
#     )
#
#     class Meta:
#         unique_together = ('follower', 'following')
#
#     def __str__(self):
#         return f"{self.user_id.username} profile."
