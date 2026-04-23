from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import GetUserProfileInfo, UpdateUserProfileInfo, AddFollower, DeleteFollower

urlpatterns = [
    path('update/', UpdateUserProfileInfo.as_view(), name='profile-update'),
    path('view/<str:username>/', GetUserProfileInfo.as_view(), name='profile-view'),
    path('follow/<int:user_id>/', AddFollower().as_view(), name='profile-view'),
    path('unfollow/<int:user_id>/', DeleteFollower().as_view(), name='profile-view')
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
