from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import FileResponse
from rest_framework.exceptions import PermissionDenied

from accounts.views import IsAdminRole
from .models import Course, Module, Lesson, LessonAccess, Enrollment
from .serializers import (
    CourseSerializer, 
    ModuleSerializer, 
    LessonSerializer, 
    LessonAccessSerializer,
    StudentCourseSerializer,
    EnrollmentSerializer
)

class CourseAnalyticsView(APIView):
    permission_classes = [IsAdminRole]

    def get(self, request):
        total_courses = Course.objects.count()
        total_modules = Module.objects.count()
        total_lessons = Lesson.objects.count()
        total_enrollments = Enrollment.objects.count()
        
        return Response({
            "total_courses": total_courses,
            "total_modules": total_modules,
            "total_lessons": total_lessons,
            "total_enrollments": total_enrollments
        })

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminRole()]
        return [permissions.IsAuthenticated()]

class ModuleViewSet(viewsets.ModelViewSet):
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminRole()]
        return [permissions.IsAuthenticated()]

class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    parser_classes = (MultiPartParser, FormParser)

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminRole()]
        return [permissions.IsAuthenticated()]

    def check_access(self, request, lesson):
        if getattr(request.user, 'role', None) == 'ADMIN':
            return True
        return LessonAccess.objects.filter(student=request.user, lesson=lesson).exists()

    @action(detail=True, methods=['get'])
    def download_video(self, request, pk=None):
        lesson = self.get_object()
        if not self.check_access(request, lesson):
            raise PermissionDenied("You do not have access to this lesson's video.")
        if lesson.video_file:
            return FileResponse(lesson.video_file.open('rb'), content_type='video/mp4')
        return Response({'detail': 'No video found.'}, status=404)

    @action(detail=True, methods=['get'])
    def download_notes(self, request, pk=None):
        lesson = self.get_object()
        if not self.check_access(request, lesson):
            raise PermissionDenied("You do not have access to this lesson's notes.")
        if lesson.notes_file:
            return FileResponse(lesson.notes_file.open('rb'), content_type='application/pdf')
        return Response({'detail': 'No notes found.'}, status=404)

class LessonAccessViewSet(viewsets.ModelViewSet):
    queryset = LessonAccess.objects.all()
    serializer_class = LessonAccessSerializer
    permission_classes = [IsAdminRole]

    @action(detail=False, methods=['post'])
    def bulk_create(self, request):
        students = request.data.get('students', [])
        lessons = request.data.get('lessons', [])
        
        created_count = 0
        for s_id in students:
            for l_id in lessons:
                obj, created = LessonAccess.objects.get_or_create(student_id=s_id, lesson_id=l_id)
                if created:
                    created_count += 1
        return Response({"detail": f"{created_count} access records generated."}, status=status.HTTP_201_CREATED)

class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
    permission_classes = [IsAdminRole]

    @action(detail=False, methods=['post'])
    def bulk_create(self, request):
        students = request.data.get('students', [])
        courses = request.data.get('courses', [])

        created_count = 0
        for s_id in students:
            for c_id in courses:
                obj, created = Enrollment.objects.get_or_create(student_id=s_id, course_id=c_id)
                if created:
                    created_count += 1
        return Response({"detail": f"{created_count} enrollments generated."}, status=status.HTTP_201_CREATED)

class StudentCourseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Course.objects.all()
    serializer_class = StudentCourseSerializer
    permission_classes = [permissions.IsAuthenticated]
