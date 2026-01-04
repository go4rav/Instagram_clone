from rest_framework import generics, permissions
from rest_framework import status
from rest_framework.views import APIView
from .models import UserProfile
from .serializers import UserProfileSerializer
from rest_framework.response import Response

class GetUserProfileInfo(APIView):

    def get(self, request, username):
        try:
            profile = UserProfile.objects.get(user_name=username)
        except UserProfile.DoesNotExist:
            return Response({"error": "User profile not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)
