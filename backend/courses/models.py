from django.db import models
from django.conf import settings

class Course(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Module(models.Model):
    course = models.ForeignKey(Course, related_name='modules', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'created_at']

    def __str__(self):
        return f"{self.course.title} - {self.title}"

class Lesson(models.Model):
    module = models.ForeignKey(Module, related_name='lessons', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    day_number = models.PositiveIntegerField(default=1)
    bunny_video_id = models.CharField(max_length=255, blank=True, null=True)
    notes_file = models.FileField(upload_to='lessons/notes/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['day_number', 'created_at']

    def __str__(self):
        return f"{self.module.title} - Day {self.day_number}: {self.title}"

class LessonAccess(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='lesson_access', on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, related_name='access_granted', on_delete=models.CASCADE)
    granted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'lesson')

    def __str__(self):
        return f"{self.student.username} granted access to {self.lesson.title}"

class Enrollment(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='course_enrollments', on_delete=models.CASCADE)
    course = models.ForeignKey(Course, related_name='enrolled_students', on_delete=models.CASCADE)
    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'course')

    def __str__(self):
        return f"{self.student.username} enrolled in {self.course.title}"
