from django.contrib import admin
from .models import Course, Module, Lesson, LessonAccess, Enrollment

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at')
    search_fields = ('title',)

@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'order', 'created_at')
    list_filter = ('course',)
    search_fields = ('title',)
    ordering = ('course', 'order')

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'module', 'day_number', 'created_at')
    list_filter = ('module__course', 'module')
    search_fields = ('title',)
    ordering = ('module', 'day_number')

@admin.register(LessonAccess)
class LessonAccessAdmin(admin.ModelAdmin):
    list_display = ('student', 'lesson', 'granted_at')
    list_filter = ('lesson__module__course', 'lesson__module', 'student')
    search_fields = ('student__username', 'lesson__title')

@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('student', 'course', 'enrolled_at')
    list_filter = ('course', 'student')
    search_fields = ('student__username', 'course__title')
