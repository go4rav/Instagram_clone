from django.urls import path
from .views import SignupView, LoginView, GetUsernameView, GetUserSummaryView

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('getusername/',GetUsernameView.as_view(), name='get-username'),
    path('get_user_summary/',GetUserSummaryView.as_view(), name='get-user-summary')
    # path('profile/', UserProfileView.as_view(), name='profile'),  # New GET endpoint
]
