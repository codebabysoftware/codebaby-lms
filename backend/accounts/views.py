from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from .serializers import UserSerializer, StudentCreateSerializer
from courses.models import Enrollment, LessonAccess

User = get_user_model()

class IsAdminRole(permissions.BasePermission):
    """
    Allows access only to admin users.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'ADMIN')

class CreateStudentView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = StudentCreateSerializer
    permission_classes = [IsAdminRole]

class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class StudentListView(generics.ListAPIView):
    queryset = User.objects.filter(role='STUDENT').order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [IsAdminRole]

class StudentDeleteView(generics.DestroyAPIView):
    queryset = User.objects.filter(role='STUDENT')
    permission_classes = [IsAdminRole]

class StudentAnalyticsView(APIView):
    permission_classes = [IsAdminRole]

    def get(self, request):
        students = User.objects.filter(role='STUDENT')
        total_students = students.count()
        
        # 7 days active definition mapping against last_login
        week_ago = timezone.now() - timedelta(days=7)
        active_students = students.filter(last_login__gte=week_ago).count()
        
        total_enrollments = Enrollment.objects.count()
        total_lesson_unlocks = LessonAccess.objects.count()

        return Response({
            "total_students": total_students,
            "active_students": active_students,
            "total_enrollments": total_enrollments,
            "total_lesson_unlocks": total_lesson_unlocks
        })

class StudentProfileAnalyticsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        total_enrollments = Enrollment.objects.filter(student=request.user).count()
        total_lesson_unlocks = LessonAccess.objects.filter(student=request.user).count()

        return Response({
            "total_enrollments": total_enrollments,
            "total_lesson_unlocks": total_lesson_unlocks
        })
