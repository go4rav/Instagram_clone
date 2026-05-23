from rest_framework import serializers
from .models import Follow, UserProfile
from posts.serializers import PostSerializer

class FollowersSerializer(serializers.ModelSerializer):

    id = serializers.CharField(
        source="followers.id"
    )
    username = serializers.CharField(
        source="followers.username"
    )
    class Meta:
        model = Follow
        fields = ['id', 'username']

class FollowingSerializer(serializers.ModelSerializer):

    id = serializers.CharField(
        source="following.id"
    )
    username = serializers.CharField(
        source="following.username"
    )
    class Meta:
        model = Follow
        fields = ['id', 'username']

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
    posts = PostSerializer(many=True, read_only=True, source='user_id.posts'
                           )
    # this gives the data of all followers where user id matches with following
    # (it does join automatically with following because related name for following is followers), check models.py
    # followers = FollowSerializer(many=True, read_only=True, source='user_id.followers')
    # this gives the data of all following where user id matches with followers
    # (it does join automatically with followers because related name for followers is following), check models.py
    # following = FollowSerializer(many=True, read_only=True, source='user_id.following')
    total_posts = serializers.SerializerMethodField()
    count_followers = serializers.SerializerMethodField()
    count_following = serializers.SerializerMethodField()
    is_owner = serializers.SerializerMethodField()
    class Meta:
        model = UserProfile
        fields = ['id', 'user_id', 'user_name', 'display_profile', 'bio', 'total_posts',
                  'count_followers', 'count_following', 'posts','is_owner']

    # this is exactly how Django ORM “reverse relationships” work
    # Because of related_name in your Post model
    def get_total_posts(self, obj):
        return obj.user_id.posts.count()

    def get_count_followers(self, obj):
        return obj.user_id.followers.count()

    def get_count_following(self, obj):
        return obj.user_id.following.count()

    def get_is_owner(self, obj):
        request = self.context.get("request")
        user = self.context.get("user")
        if request and user:
            return request.user.id == user.id
        return False


# class AddProfileSerializer(serializers.ModelSerializer):\
#
#
#     class Meta:
#         model = UserProfile
#         fields = ['id', 'user_id', 'user_name', 'display_profile', 'bio', 'total_posts',
#                   'followers', 'following', 'posts']


# def create(self, data):


