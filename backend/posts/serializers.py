from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField(read_only=True)
    display_profile = serializers.ImageField(source='author.user_profile.display_profile')

    class Meta:
        model = Post
        fields = ['id', 'author', 'image', 'caption', 'created_at', 'display_profile']
