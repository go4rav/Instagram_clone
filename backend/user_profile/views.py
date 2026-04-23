from rest_framework import generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from rest_framework.views import APIView
from .models import UserProfile , User, Follow
from .serializers import UserProfileSerializer, FollowSerializer
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

class GetUserProfileInfo(APIView):

    def get(self, request, username):
        try:
            # first get the user object associated with this username
            user = User.objects.get(username=username)
            # now filter the profile based on this user.
            profile = UserProfile.objects.get(user_id=user)
        except UserProfile.DoesNotExist:
            return Response({"error": "User profile not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)


class UpdateUserProfileInfo(APIView):

    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    def post(self, request):
        try:
            print(request)
            user_profile = UserProfile.objects.filter(user_id=request.user).update(
                user_name = request.data.get('user_name'),
                bio = request.data.get('bio'),
                display_profile = request.data.get('display_profile')
               )

        except UserProfile.DoesNotExist:
            return Response({"error": "Error occured while updating profile"}, status=status.HTTP_404_NOT_FOUND)

        # print(user_profile)
        profile = UserProfile.objects.get(user_id=request.user)
        serializer = UserProfileSerializer(profile)

        return Response(serializer.data,status=status.HTTP_201_CREATED)


class AddFollower(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, user_id):
        try:

            target_user = get_object_or_404(User, id=user_id)
            # handles the case if the record already exists, then does nothing
            Follow.objects.get_or_create(followers = request.user, following = target_user)

        except Follow.DoesNotExist:
            return Response({"error": "Error occured while updating followers list"}, status=status.HTTP_404_NOT_FOUND)

        following = Follow.objects.filter(followers=request.user)
        # by writing many=True, you say that following is not a single object, it is a list of objects, hence
        # by writing this, FollowSerializer would now serialize one-by-one.
        serializer = FollowSerializer(following, many=True)

        return Response(serializer.data,status=status.HTTP_201_CREATED)


class DeleteFollower(APIView):
    permission_classes = [permissions.IsAuthenticated]
    # parser_classes = [MultiPartParser, FormParser]

    def post(self, request, user_id):
        try:
            target_user = get_object_or_404(User, id=user_id)
            Follow.objects.filter(followers = request.user, following = target_user).delete()
        except Follow.DoesNotExist:
            return Response({"error": "Error occured while updating followers list"}, status=status.HTTP_404_NOT_FOUND)

        following = Follow.objects.filter(followers=request.user)
        serializer = FollowSerializer(following, many=True)
        return Response(serializer.data,status=status.HTTP_201_CREATED)
