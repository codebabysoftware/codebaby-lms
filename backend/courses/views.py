import requests
from django.conf import settings
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

def upload_video_to_bunny(file_obj, title):
    library_id = settings.BUNNY_STREAM_LIBRARY_ID
    api_key = settings.BUNNY_STREAM_API_KEY
    if not library_id or not api_key:
        return None

    base_url = f"https://video.bunnycdn.com/library/{library_id}/videos"
    headers = {
        "AccessKey": api_key,
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
    
    # 1. Create the video object
    create_response = requests.post(
        base_url,
        json={"title": title},
        headers=headers
    )
    if not create_response.ok:
        return None
        
    video_id = create_response.json().get("guid")
    
    # 2. Upload the video binary
    if video_id:
        upload_url = f"{base_url}/{video_id}"
        upload_response = requests.put(
            upload_url,
            data=file_obj.read(),
            headers={"AccessKey": api_key, "Content-Type": "application/octet-stream"}
        )
        if upload_response.ok:
            return video_id
    return None

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

    def perform_create(self, serializer):
        video_file = self.request.FILES.get('video_file')
        bunny_video_id = None
        if video_file:
            bunny_video_id = upload_video_to_bunny(video_file, serializer.validated_data.get('title', 'Untitled'))
        serializer.save(bunny_video_id=bunny_video_id)

    def perform_update(self, serializer):
        video_file = self.request.FILES.get('video_file')
        bunny_video_id = serializer.instance.bunny_video_id
        if video_file:
            bunny_video_id = upload_video_to_bunny(video_file, serializer.validated_data.get('title', serializer.instance.title))
        serializer.save(bunny_video_id=bunny_video_id)

    def check_access(self, request, lesson):
        if getattr(request.user, 'role', None) == 'ADMIN':
            return True
        return LessonAccess.objects.filter(student=request.user, lesson=lesson).exists()

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
