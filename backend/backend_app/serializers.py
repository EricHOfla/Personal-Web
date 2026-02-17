from rest_framework import serializers
from django.conf import settings
from .models import (
    UserProfile, SocialLink, Service, FunFact,
    Experience, Education, Skill, Project,
    BlogPost, ContactMessage, SidenavItem, Testimonial
)


def get_cloudinary_url(file_field):
    """
    Build the full Cloudinary URL for a file field.
    When using django-cloudinary-storage, .url may return a relative path
    like '/media/projects/filename' instead of the full Cloudinary URL.
    This helper ensures we always return the full URL.
    """
    if not file_field:
        return None

    try:
        url = file_field.url
    except Exception:
        return None

    # If it's already a full URL (Cloudinary or external), return as-is
    if url and (url.startswith('http://') or url.startswith('https://')):
        return url

    # Build the Cloudinary URL from the stored name/path
    # The file_field.name contains the Cloudinary public_id (e.g., "media/projects/filename")
    cloud_name = getattr(settings, 'CLOUDINARY_CLOUD_NAME', None)
    if cloud_name and file_field.name:
        # Remove leading slashes and /media/ prefix from the name
        public_id = file_field.name
        if public_id.startswith('/'):
            public_id = public_id.lstrip('/')
        # Construct the full Cloudinary URL  
        # Cloudinary auto-detects format, so we use image/upload for images
        cloudinary_url = f"https://res.cloudinary.com/{cloud_name}/image/upload/v1/{public_id}"
        return cloudinary_url

    # Fallback: return the url as-is
    return url


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
        return get_cloudinary_url(obj.profile_image)

    def get_cv_file(self, obj):
        return get_cloudinary_url(obj.cv_file)


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
        return get_cloudinary_url(obj.image_url)


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
        return get_cloudinary_url(obj.featured_image)

    def get_reading_time(self, obj):
        word_count = len(obj.content.split())
        return max(1, round(word_count / 200))


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
        fields = [
            "id", "user", "name", "role", "company",
            "message", "image", "image_display",
            "display_order", "is_active", "created_at"
        ]
        extra_kwargs = {
            "user": {"required": False},
        }

    def get_image_display(self, obj):
        return get_cloudinary_url(obj.image)

    def create(self, validated_data):
        if "user" not in validated_data:
            profile = UserProfile.objects.first()
            if profile:
                validated_data["user"] = profile
        return super().create(validated_data)
