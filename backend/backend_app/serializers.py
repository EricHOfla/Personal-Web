from rest_framework import serializers
from .models import (
    UserProfile, SocialLink, Service, FunFact,
    Experience, Education, Skill, Project,
    BlogPost, ContactMessage, SidenavItem, Testimonial
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
        if obj.profile_image:
            return obj.profile_image.url
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
        if obj.image_url:
            return obj.image_url.url
        return None


# =========================
# 9. Blog Posts
# =========================
class BlogPostSerializer(serializers.ModelSerializer):
    featured_image = serializers.SerializerMethodField()
    user = UserProfileSerializer(read_only=True)
    reading_time = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = "__all__"

    def get_featured_image(self, obj):
        if obj.featured_image:
            return obj.featured_image.url
        return None

    def get_reading_time(self, obj):
        # Rough estimate: 200 words per minute
        word_count = len(obj.content.split())
        reading_time = max(1, round(word_count / 200))
        return reading_time


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


# =========================
# 12. Testimonials
# =========================
class TestimonialSerializer(serializers.ModelSerializer):
    image_display = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Testimonial
        fields = ["id", "user", "name", "role", "company", "message", "image", "image_display", "display_order", "is_active", "created_at"]
        extra_kwargs = {
            "user": {"required": False},
        }

    def get_image_display(self, obj):
        if obj.image:
            return obj.image.url
        return None

    def create(self, validated_data):
        # Automatically assign the first UserProfile if not provided
        if "user" not in validated_data:
            profile = UserProfile.objects.first()
            if profile:
                validated_data["user"] = profile
        return super().create(validated_data)
