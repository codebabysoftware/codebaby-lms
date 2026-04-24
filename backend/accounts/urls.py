from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import CreateStudentView, CurrentUserView, StudentListView, StudentDeleteView, StudentAnalyticsView, StudentProfileAnalyticsView

urlpatterns = [
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', CurrentUserView.as_view(), name='current_user'),
    path('admin/students/create/', CreateStudentView.as_view(), name='create_student'),
    path('admin/students/', StudentListView.as_view(), name='list_students'),
    path('admin/students/<int:pk>/delete/', StudentDeleteView.as_view(), name='delete_student'),
    path('admin/analytics/', StudentAnalyticsView.as_view(), name='student_analytics'),
    path('student/analytics/', StudentProfileAnalyticsView.as_view(), name='student_profile_analytics'),
]
