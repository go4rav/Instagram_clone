from rest_framework import serializers
from .models import Post

class PostListSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField(read_only=True)
    display_profile = serializers.ImageField(source='author.user_profile.display_profile')
    class Meta:
        model = Post
        fields = ['id', 'author', 'image', 'caption', 'created_at', 'display_profile']


class PostCreateSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField(read_only=True)
    class Meta:
        model = Post
        fields = ['id', 'author', 'image', 'caption', 'created_at']