from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CourseViewSet, 
    ModuleViewSet, 
    LessonViewSet, 
    LessonAccessViewSet,
    EnrollmentViewSet,
    StudentCourseViewSet,
    CourseAnalyticsView
)

router = DefaultRouter()
router.register(r'courses', CourseViewSet)
router.register(r'modules', ModuleViewSet)
router.register(r'lessons', LessonViewSet)
router.register(r'lesson-access', LessonAccessViewSet)
router.register(r'enrollments', EnrollmentViewSet)
router.register(r'student-courses', StudentCourseViewSet, basename='student-courses')

urlpatterns = [
    path('courses/analytics/', CourseAnalyticsView.as_view(), name='course_analytics'),
    path('', include(router.urls)),
]
