from datetime import timedelta

from django.contrib.auth import get_user_model
from django.db.models import Q
from django.utils import timezone

from rest_framework import generics, permissions, status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import (
    UserSerializer,
    StudentCreateSerializer,
    StudentUpdateSerializer,
)

from courses.models import Enrollment, LessonAccess

User = get_user_model()


# ======================================================
# PERMISSIONS
# ======================================================

class IsAdminRole(permissions.BasePermission):
    """
    Access only for custom ADMIN role users.
    """

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == "ADMIN"
        )


# ======================================================
# AUTH USER
# ======================================================

class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(
            request.user,
            context={"request": request}
        )
        return Response(serializer.data)


# ======================================================
# ADMIN - STUDENT CRUD
# ======================================================

class CreateStudentView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = StudentCreateSerializer
    permission_classes = [IsAdminRole]
    parser_classes = [MultiPartParser, FormParser, JSONParser]


class StudentListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAdminRole]

    def get_queryset(self):
        queryset = User.objects.filter(
            role="STUDENT"
        ).order_by("-date_joined")

        search = self.request.query_params.get("search")

        if search:
            queryset = queryset.filter(
                Q(username__icontains=search) |
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search) |
                Q(student_id__icontains=search) |
                Q(email__icontains=search)
            )

        return queryset

    def get_serializer_context(self):
        return {"request": self.request}


class StudentDetailView(generics.RetrieveAPIView):
    queryset = User.objects.filter(role="STUDENT")
    serializer_class = UserSerializer
    permission_classes = [IsAdminRole]

    def get_serializer_context(self):
        return {"request": self.request}


class StudentUpdateView(generics.UpdateAPIView):
    queryset = User.objects.filter(role="STUDENT")
    serializer_class = StudentUpdateSerializer
    permission_classes = [IsAdminRole]
    parser_classes = [MultiPartParser, FormParser, JSONParser]


class StudentDeleteView(generics.DestroyAPIView):
    queryset = User.objects.filter(role="STUDENT")
    permission_classes = [IsAdminRole]


# ======================================================
# ADMIN ANALYTICS
# ======================================================

class StudentAnalyticsView(APIView):
    permission_classes = [IsAdminRole]

    def get(self, request):
        students = User.objects.filter(role="STUDENT")
        total_students = students.count()

        week_ago = timezone.now() - timedelta(days=7)

        active_students = students.filter(
            last_login__gte=week_ago
        ).count()

        verified_students = students.filter(
            is_verified=True
        ).count()

        total_enrollments = Enrollment.objects.count()
        total_lesson_unlocks = LessonAccess.objects.count()

        return Response({
            "total_students": total_students,
            "active_students_last_7_days": active_students,
            "verified_students": verified_students,
            "inactive_students": total_students - active_students,
            "total_enrollments": total_enrollments,
            "total_lesson_unlocks": total_lesson_unlocks,
        })


# ======================================================
# STUDENT SELF PROFILE
# ======================================================

class StudentProfileAnalyticsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        total_enrollments = Enrollment.objects.filter(
            student=request.user
        ).count()

        total_lesson_unlocks = LessonAccess.objects.filter(
            student=request.user
        ).count()

        return Response({
            "student": request.user.username,
            "total_enrollments": total_enrollments,
            "total_lesson_unlocks": total_lesson_unlocks,
        })


class UpdateMyProfileView(generics.UpdateAPIView):
    serializer_class = StudentUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_object(self):
        return self.request.user


# ======================================================
# OPTIONAL - TOGGLE VERIFY STATUS
# ======================================================

class ToggleStudentVerifyView(APIView):
    permission_classes = [IsAdminRole]

    def patch(self, request, pk):
        try:
            student = User.objects.get(pk=pk, role="STUDENT")
        except User.DoesNotExist:
            return Response(
                {"error": "Student not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        student.is_verified = not student.is_verified
        student.save()

        return Response({
            "message": "Verification updated",
            "is_verified": student.is_verified
        })