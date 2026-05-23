from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import GetUserProfileInfo, UpdateUserProfileInfo, AddFollower, \
    DeleteFollower, IsFollowingView, FollowersListView, FollowingListView

urlpatterns = [
    path('update/', UpdateUserProfileInfo.as_view(), name='profile-update'),
    path('view/<str:username>/', GetUserProfileInfo.as_view(), name='userprofile-view'),
    path('follow/<str:username>/', AddFollower().as_view(), name='addfollower-view'),
    path('unfollow/<str:username>/', DeleteFollower().as_view(), name='deletefollower-view'),
    path('isfollowing/<str:username>/', IsFollowingView().as_view(), name='isfollowing-view'),
    path('followers/<str:username>/', FollowersListView().as_view(), name='followers-list-view'),
    path('following/<str:username>/', FollowingListView().as_view(), name='following-list-view'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
