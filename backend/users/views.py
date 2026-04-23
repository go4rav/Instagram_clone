import pdb

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.generics import RetrieveAPIView
from rest_framework import status
from .serializers import UserSerializer, LoginSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class SignupView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save() # saves in database i guess
            return Response(serializer.data, status=status.HTTP_201_CREATED) # returns user details in response.
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK) #
            # returns jwt token in response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GetUsernameView(APIView):

    def get(self, request):
        username = request.user.username
        # serializer = UserProfileSerializer(profile)
        return Response({'username': username})

# class UserProfileView(RetrieveAPIView):
#     authentication_classes = [JWTAuthentication]
#     permission_classes = [IsAuthenticated]
#     serializer_class = UserSerializer
#
#     def get_object(self):
#         return self.request.user
