from rest_framework import serializers
from .models import UserProfile
from posts.serializers import PostSerializer

class UserProfileSerializer(serializers.ModelSerializer):\
    # why "author" name in Posts model does not matter? you could give any name.
    # Forward relation:
    # Post.author → points to a User.
    #
    # ✔️ Reverse relation (automatically created):
    # User.posts → gives all Post objects where Post.author = User.
    #
    # ✔️ Why does author name not matter?
    # Because reverse relations are based on:
    # the related_name you set (posts),
    # not the FK field name.
    posts = PostSerializer(many=True, read_only=True, source='user_id.posts') # this is important, it says get me the posts from the post serialiser for only users with user_id.

    class Meta:
        model = UserProfile
        fields = ['id', 'user_id', 'user_name', 'display_profile', 'bio', 'total_posts',
                  'followers', 'following', 'posts']

# class FollowSerializer(serializers.ModelSerializer):
#     author = serializers.StringRelatedField(read_only=True)
#
#     class Meta:
#         model = UserProfile
#         fields = ['follower', 'following']
