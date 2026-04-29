from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import (
    CreateStudentView,
    CurrentUserView,
    StudentListView,
    StudentDetailView,
    StudentUpdateView,
    StudentDeleteView,
    StudentAnalyticsView,
    StudentProfileAnalyticsView,
    UpdateMyProfileView,
    ToggleStudentVerifyView,
)

urlpatterns = [
    # ==========================================
    # AUTH
    # ==========================================
    path(
        "auth/login/",
        TokenObtainPairView.as_view(),
        name="token_obtain_pair"
    ),
    path(
        "auth/refresh/",
        TokenRefreshView.as_view(),
        name="token_refresh"
    ),
    path(
        "auth/me/",
        CurrentUserView.as_view(),
        name="current_user"
    ),

    # ==========================================
    # ADMIN - STUDENTS
    # ==========================================
    path(
        "admin/students/create/",
        CreateStudentView.as_view(),
        name="create_student"
    ),
    path(
        "admin/students/",
        StudentListView.as_view(),
        name="list_students"
    ),
    path(
        "admin/students/<int:pk>/",
        StudentDetailView.as_view(),
        name="student_detail"
    ),
    path(
        "admin/students/<int:pk>/update/",
        StudentUpdateView.as_view(),
        name="update_student"
    ),
    path(
        "admin/students/<int:pk>/delete/",
        StudentDeleteView.as_view(),
        name="delete_student"
    ),
    path(
        "admin/students/<int:pk>/verify/",
        ToggleStudentVerifyView.as_view(),
        name="verify_student"
    ),

    # ==========================================
    # ANALYTICS
    # ==========================================
    path(
        "admin/analytics/",
        StudentAnalyticsView.as_view(),
        name="student_analytics"
    ),
    path(
        "student/analytics/",
        StudentProfileAnalyticsView.as_view(),
        name="student_profile_analytics"
    ),

    # ==========================================
    # STUDENT PROFILE
    # ==========================================
    path(
        "student/profile/update/",
        UpdateMyProfileView.as_view(),
        name="update_my_profile"
    ),
]