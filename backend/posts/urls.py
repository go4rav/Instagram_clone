from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import PostListCreateView, PostDeleteView

urlpatterns = [
    path('', PostListCreateView.as_view(), name='post-list-create'),
    path('<int:pk>/', PostDeleteView.as_view(), name='post-delete'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
