from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import GetUserProfileInfo

urlpatterns = [
    path('<str:username>/', GetUserProfileInfo.as_view(), name='profile-view')
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
