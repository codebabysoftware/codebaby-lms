from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    # ==================================================
    # LIST PAGE
    # ==================================================
    list_display = (
        "id",
        "username",
        "email",
        "first_name",
        "last_name",
        "role",
        "student_id",
        "phone",
        "is_verified",
        "is_staff",
        "is_active",
        "date_joined",
    )

    list_filter = (
        "role",
        "gender",
        "is_verified",
        "is_staff",
        "is_superuser",
        "is_active",
        "date_joined",
    )

    search_fields = (
        "username",
        "email",
        "first_name",
        "last_name",
        "student_id",
        "phone",
    )

    ordering = ("-date_joined",)

    readonly_fields = (
        "last_login",
        "date_joined",
        "created_at",
        "updated_at",
    )

    # ==================================================
    # DETAIL PAGE
    # ==================================================
    fieldsets = (
        ("Login Credentials", {
            "fields": (
                "username",
                "password",
            )
        }),

        ("Personal Info", {
            "fields": (
                "first_name",
                "last_name",
                "email",
                "profile_pic",
                "phone",
                "date_of_birth",
                "gender",
            )
        }),

        ("Academic Details", {
            "fields": (
                "student_id",
                "department",
                "course",
                "year",
            )
        }),

        ("Address", {
            "fields": (
                "address",
                "city",
                "state",
                "country",
            )
        }),

        ("Role & Permissions", {
            "fields": (
                "role",
                "is_verified",
                "is_active",
                "is_staff",
                "is_superuser",
                "groups",
                "user_permissions",
            )
        }),

        ("Important Dates", {
            "fields": (
                "last_login",
                "date_joined",
                "created_at",
                "updated_at",
            )
        }),
    )

    # ==================================================
    # CREATE USER PAGE
    # ==================================================
    add_fieldsets = (
        ("Create New User", {
            "classes": ("wide",),
            "fields": (
                "username",
                "email",
                "first_name",
                "last_name",
                "password1",
                "password2",
                "role",
                "student_id",
                "phone",
                "is_verified",
                "is_staff",
                "is_active",
            ),
        }),
    )

    filter_horizontal = (
        "groups",
        "user_permissions",
    )