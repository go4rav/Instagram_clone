from rest_framework import generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from rest_framework.views import APIView
from .models import UserProfile , User, Follow, RecentProfileVisit
from .serializers import UserProfileSerializer, FollowersSerializer, FollowingSerializer, RecentVisitsSerializer
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

class GetUserProfileInfo(APIView):

    def get(self, request, username):
        try:
            # first get the user object associated with this username
            user = User.objects.get(username=username)

            # now filter the profile based on this user.
            profile = UserProfile.objects.get(user_id=user)
            visited_user = get_object_or_404(User, username=username)
            if visited_user!=request.user:
                RecentProfileVisit.objects.create(visitor = request.user , visited_user = visited_user )
        except UserProfile.DoesNotExist:
            return Response({"error": "User profile not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = UserProfileSerializer(profile, context = {"request": request, "user": user })
        return Response(serializer.data)


class GetRecentVisitedProfiles(APIView):

    def get(self, request):

        # first get the user object associated with this username
        recent_visits = (
            RecentProfileVisit.objects
            .filter(visitor=request.user)
            .order_by("-visited_at")
        )

        unique_profiles = []
        seen = set()

        for visit in recent_visits:
            if visit.visited_user_id not in seen:
                seen.add(visit.visited_user_id)
                print(seen)
                unique_profiles.append(visit)

            if len(unique_profiles) == 5:
                break
        serializer = RecentVisitsSerializer(unique_profiles,  many=True)
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

    def post(self, request, username):
        try:

            target_user = get_object_or_404(User, username=username)
            # handles the case if the record already exists, then does nothing
            Follow.objects.get_or_create(followers = request.user, following = target_user)

        except Follow.DoesNotExist:
            return Response({"error": "Error occured while updating followers list"}, status=status.HTTP_404_NOT_FOUND)

        following = Follow.objects.filter(followers=request.user)
        # by writing many=True, you say that following is not a single object, it is a list of objects, hence
        # by writing this, FollowSerializer would now serialize one-by-one.
        serializer = FollowersSerializer(following, many=True,  context = {"request": request})

        return Response(serializer.data,status=status.HTTP_201_CREATED)


class IsFollowingView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request, username):
        target_user = get_object_or_404(User, username=username)
        # handles the case if the record already exists, then does nothing
        is_following = Follow.objects.filter(followers = request.user, following = target_user).exists()

        return Response({'is_following' : is_following},status=status.HTTP_200_OK)


class FollowersListView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request, username):
        user = get_object_or_404(User, username=username)
        # handles the case if the record already exists, then does nothing
        followers = Follow.objects.filter(following=user)
        # without many=True, it expects a single object, but its a queryset.
        # here we already have the follow object, so we directly pass it in the FollowSerializer.
        serializer = FollowersSerializer(followers, many=True, context = {"request": request})
        return Response(serializer.data,status=status.HTTP_200_OK)


class FollowingListView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request, username):
        user = get_object_or_404(User, username=username)
        # handles the case if the record already exists, then does nothing
        following = Follow.objects.filter(followers=user)
        # without many=True, it expects a single object, but its a queryset.
        # here we already have the follow object, so we directly pass it in the FollowSerializer.
        serializer = FollowingSerializer(following, many=True,  context = {"request": request})
        return Response(serializer.data,status=status.HTTP_200_OK)

class DeleteFollower(APIView):
    permission_classes = [permissions.IsAuthenticated]
    # parser_classes = [MultiPartParser, FormParser]

    def post(self, request, username):
        try:
            target_user = get_object_or_404(User, username=username)
            Follow.objects.filter(followers = request.user, following = target_user).delete()
        except Follow.DoesNotExist:
            return Response({"error": "Error occured while updating followers list"}, status=status.HTTP_404_NOT_FOUND)

        following = Follow.objects.filter(followers=request.user)
        serializer = FollowersSerializer(following, many=True,  context = {"request": request})
        return Response(serializer.data,status=status.HTTP_201_CREATED)

class RemoveFollower(APIView):
    permission_classes = [permissions.IsAuthenticated]
    # parser_classes = [MultiPartParser, FormParser]

    def post(self, request, username):
        try:
            target_user = get_object_or_404(User, username=username)
            Follow.objects.filter(followers = target_user, following = request.user).delete()
        except Follow.DoesNotExist:
            return Response({"error": "Error occured while updating followers list"}, status=status.HTTP_404_NOT_FOUND)

        following = Follow.objects.filter(followers=request.user)
        serializer = FollowersSerializer(following, many=True,  context = {"request": request})
        return Response(serializer.data,status=status.HTTP_201_CREATED)


class GetRandomFollowingView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request, username):
        user = get_object_or_404(User, username=username)
        # handles the case if the record already exists, then does nothing
        following = Follow.objects.filter(followers=user)
        # without many=True, it expects a single object, but its a queryset.
        # here we already have the follow object, so we directly pass it in the FollowSerializer.
        serializer = FollowingSerializer(following, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

