from rest_framework import serializers
from .models import (
    UserProfile, SocialLink, Service, FunFact,
    Experience, Education, Skill, Project,
    BlogPost, ContactMessage, SidenavItem
)

# =========================
# 1. User Profile
# =========================
class UserProfileSerializer(serializers.ModelSerializer):
    profile_image = serializers.SerializerMethodField()
    cv_file = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = "__all__"

    def get_profile_image(self, obj):
        request = self.context.get("request")
        if obj.profile_image and request:
            return request.build_absolute_uri(obj.profile_image.url)
        return None

    def get_cv_file(self, obj):
        request = self.context.get("request")
        if obj.cv_file and request:
            return request.build_absolute_uri(obj.cv_file.url)
        return None


# =========================
# 2. Social Links
# =========================
class SocialLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialLink
        fields = "__all__"


# =========================
# 3. Services
# =========================
class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = "__all__"


# =========================
# 4. Fun Facts
# =========================
class FunFactSerializer(serializers.ModelSerializer):
    class Meta:
        model = FunFact
        fields = "__all__"


# =========================
# 5. Experience
# =========================
class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = "__all__"


# =========================
# 6. Education
# =========================
class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = "__all__"


# =========================
# 7. Skills
# =========================
class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = "__all__"


# =========================
# 8. Projects
# =========================
class ProjectSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = "__all__"

    def get_image_url(self, obj):
        request = self.context.get("request")
        if obj.image_url and request:
            return request.build_absolute_uri(obj.image_url.url)
        return None


# =========================
# 9. Blog Posts
# =========================
class BlogPostSerializer(serializers.ModelSerializer):
    featured_image = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = "__all__"

    def get_featured_image(self, obj):
        request = self.context.get("request")
        if obj.featured_image and request:
            return request.build_absolute_uri(obj.featured_image.url)
        return None


# =========================
# 10. Contact Messages
# =========================
class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = "__all__"
        read_only_fields = ["is_read", "is_replied", "created_at"]


# =========================
# 11. Sidenav Items
# =========================
class SidenavItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = SidenavItem
        fields = "__all__"
