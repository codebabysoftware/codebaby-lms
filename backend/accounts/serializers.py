from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    profile_pic_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",

            "first_name",
            "last_name",
            "full_name",

            "role",

            "profile_pic",
            "profile_pic_url",

            "phone",
            "date_of_birth",
            "gender",

            "student_id",
            "department",
            "course",
            "year",

            "address",
            "city",
            "state",
            "country",

            "is_verified",
            "is_active",

            "created_at",
            "updated_at",
        )

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()

    def get_profile_pic_url(self, obj):
        request = self.context.get("request")

        if obj.profile_pic:
            if request:
                return request.build_absolute_uri(obj.profile_pic.url)
            return obj.profile_pic.url

        return None


class StudentCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "password",

            "first_name",
            "last_name",

            "profile_pic",
            "phone",
            "date_of_birth",
            "gender",

            "student_id",
            "department",
            "course",
            "year",

            "address",
            "city",
            "state",
            "country",
        )

    def create(self, validated_data):
        password = validated_data.pop("password")

        user = User.objects.create_user(
            username=validated_data.get("username"),
            email=validated_data.get("email", ""),
            password=password,
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
            role="STUDENT",
        )

        # Extra fields
        user.profile_pic = validated_data.get("profile_pic", None)
        user.phone = validated_data.get("phone", None)
        user.date_of_birth = validated_data.get("date_of_birth", None)
        user.gender = validated_data.get("gender", None)

        user.student_id = validated_data.get("student_id", None)
        user.department = validated_data.get("department", None)
        user.course = validated_data.get("course", None)
        user.year = validated_data.get("year", None)

        user.address = validated_data.get("address", None)
        user.city = validated_data.get("city", None)
        user.state = validated_data.get("state", None)
        user.country = validated_data.get("country", "India")

        user.save()
        return user


class StudentUpdateSerializer(serializers.ModelSerializer):
    profile_pic_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        exclude = (
            "password",
            "groups",
            "user_permissions",
            "is_superuser",
            "last_login",
            "date_joined",
        )

    def get_profile_pic_url(self, obj):
        request = self.context.get("request")
        if obj.profile_pic:
            if request:
                return request.build_absolute_uri(obj.profile_pic.url)
            return obj.profile_pic.url
        return None