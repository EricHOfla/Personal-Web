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
    cloud_name = getattr(settings, 'CLOUDINARY_CLOUD_NAME', None)
    if cloud_name and file_field.name:
        public_id = file_field.name
        
        # Clean up leading slashes
        if public_id.startswith('/'):
            public_id = public_id.lstrip('/')
            
        # Do not force 'media/' prefix. Trust the stored name.
        # If the file was uploaded to 'profiles/name.jpg', public_id is 'profiles/name.jpg'.
        # If it was uploaded to 'media/profiles/name.jpg', public_id is 'media/profiles/name.jpg'.

        # Construct the full Cloudinary URL
        return f"https://res.cloudinary.com/{cloud_name}/image/upload/v1/{public_id}"

    # Fallback: return the url as-is
    return url


# =========================
# 1. User Profile
# =========================
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = "__all__"

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['profile_image'] = get_cloudinary_url(instance.profile_image)
        representation['cv_file'] = get_cloudinary_url(instance.cv_file)
        return representation


class SimpleUserProfileSerializer(serializers.ModelSerializer):
    """
    Minimal profile info for blog authors or other lightweight displays.
    """
    class Meta:
        model = UserProfile
        fields = ["id", "full_name", "first_name", "last_name", "title", "profile_image"]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['profile_image'] = get_cloudinary_url(instance.profile_image)
        return representation


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
    class Meta:
        model = Project
        fields = "__all__"

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['image_url'] = get_cloudinary_url(instance.image_url)
        return representation


# =========================
# 9. Blog Posts
# =========================
class BlogPostSerializer(serializers.ModelSerializer):
    user = SimpleUserProfileSerializer(read_only=True)
    reading_time = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = "__all__"

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['featured_image'] = get_cloudinary_url(instance.featured_image)
        return representation

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
