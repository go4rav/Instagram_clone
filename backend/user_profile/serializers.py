from rest_framework import serializers
from .models import Follow, UserProfile
from posts.serializers import PostSerializer

class FollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Follow
        fields = ['followers', 'following']

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
    # this is important, it says get me the posts from the post serialiser for only users with user_id.
    posts = PostSerializer(many=True, read_only=True, source='user_id.posts')
    following = FollowSerializer(many=True, read_only=True, source='user_id.follower')
    followers = FollowSerializer(many=True, read_only=True, source='user_id.following')
    total_posts = serializers.SerializerMethodField()
    count_followers = serializers.SerializerMethodField()
    count_following = serializers.SerializerMethodField()
    class Meta:
        model = UserProfile
        fields = ['id', 'user_id', 'user_name', 'display_profile', 'bio', 'total_posts',
                  'count_followers', 'count_following', 'posts', 'followers', 'following']

    # this is exactly how Django ORM “reverse relationships” work
    # Because of related_name in your Post model
    def get_total_posts(self, obj):
        return obj.user_id.posts.count()

    def get_count_followers(self, obj):
        return obj.user_id.followers.count()

    def get_count_following(self, obj):
        return obj.user_id.following.count()


# class AddProfileSerializer(serializers.ModelSerializer):\
#
#
#     class Meta:
#         model = UserProfile
#         fields = ['id', 'user_id', 'user_name', 'display_profile', 'bio', 'total_posts',
#                   'followers', 'following', 'posts']


# def create(self, data):


