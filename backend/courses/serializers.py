from rest_framework import serializers
from .models import Course, Module, Lesson, LessonAccess, Enrollment

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = '__all__'

class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = Module
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(many=True, read_only=True)
    enrollment_count = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = '__all__'

    def get_enrollment_count(self, obj):
        return obj.enrolled_students.count()

class LessonAccessSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonAccess
        fields = '__all__'

class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = '__all__'

class StudentLessonSerializer(serializers.ModelSerializer):
    is_unlocked = serializers.SerializerMethodField()
    video_url = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = ('id', 'title', 'day_number', 'created_at', 'is_unlocked', 'video_url', 'notes_url')

    def get_is_unlocked(self, obj):
        user = self.context['request'].user
        if getattr(user, 'role', None) == 'ADMIN':
            return True
        return LessonAccess.objects.filter(student=user, lesson=obj).exists()

    def get_video_url(self, obj):
        from django.conf import settings
        if obj.bunny_video_id and settings.BUNNY_STREAM_LIBRARY_ID:
            return f"https://iframe.mediadelivery.net/embed/{settings.BUNNY_STREAM_LIBRARY_ID}/{obj.bunny_video_id}?autoplay=true"
        return None

class StudentModuleSerializer(serializers.ModelSerializer):
    lessons = StudentLessonSerializer(many=True, read_only=True)

    class Meta:
        model = Module
        fields = ('id', 'title', 'order', 'lessons')

class StudentCourseSerializer(serializers.ModelSerializer):
    modules = StudentModuleSerializer(many=True, read_only=True)
    is_unlocked_overall = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ('id', 'title', 'description', 'thumbnail', 'thumbnail_base64', 'created_at', 'modules', 'is_unlocked_overall')

    def get_is_unlocked_overall(self, obj):
        user = self.context['request'].user
        if getattr(user, 'role', None) == 'ADMIN':
            return True
        return Enrollment.objects.filter(student=user, course=obj).exists()
