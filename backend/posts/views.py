from rest_framework import generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Post
from .serializers import PostSerializer
from user_profile.models import Follow

# List all posts & Create new post
class PostListCreateView(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]  # For image uploads

    def get_queryset(self):
        following_users = Follow.objects.filter(followers=self.request.user).values_list("following", flat=True)
        return Post.objects.filter(author__in=following_users).order_by("?")  # Allow only owners to delete


    def perform_create(self, serializer):
        serializer.save(author=self.request.user)  # Set author automatically
        # serializer.save()




# Delete a post

# You don’t need to manually write pk because:
# DRF calls:
# get_object() internally:
# Calls your get_queryset()
# Retrieves the object where pk matches the URL value
# So effectively DRF runs:
#allows by limiting the query set to only users posts, a user can only delete their own posts.
# Post.objects.filter(author=request.user).get(pk=pk_from_url)
class PostDeleteView(generics.DestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Post.objects.filter(author=self.request.user)  # Allow only owners to delete
