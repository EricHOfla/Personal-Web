from django.contrib import admin
from django.utils.html import format_html
from .models import (
    UserProfile, SocialLink, Service, FunFact,
    Experience, Education, Skill, Project,
    BlogPost, ContactMessage, SidenavItem, Testimonial
)

CLOUD_NAME = 'dfcpda9te'  # Your Cloudinary cloud name

# =========================
# Contact Messages
# =========================
@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'is_read', 'is_replied', 'created_at')
    list_filter = ('is_read', 'is_replied', 'created_at')
    search_fields = ('name', 'email', 'message')
    actions = ['mark_as_read']

    def mark_as_read(self, request, queryset):
        queryset.update(is_read=True)
    mark_as_read.short_description = "Mark selected messages as read"


# =========================
# Testimonials
# =========================
@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ('name', 'company', 'image_preview', 'is_active', 'display_order', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'company', 'message')
    list_editable = ('is_active', 'display_order')
    actions = ['activate_testimonials']

    def activate_testimonials(self, request, queryset):
        queryset.update(is_active=True)
    activate_testimonials.short_description = "Activate selected testimonials"

    def image_preview(self, obj):
        if obj.image:
            url = obj.image.url
            if not url.startswith('http'):
                path = url.replace('/media/', '')
                url = f'https://res.cloudinary.com/{CLOUD_NAME}/image/upload/{path}'
            return format_html('<img src="{}" style="width:50px;height:50px;border-radius:50%;object-fit:cover;" />', url)
        return "(No Image)"
    image_preview.short_description = "Image"
    image_preview.allow_tags = True


# =========================
# User Profile
# =========================
@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'profile_image_preview')
    search_fields = ('full_name', 'email')

    def profile_image_preview(self, obj):
        if obj.profile_image:
            url = obj.profile_image.url
            if not url.startswith('http'):
                path = url.replace('/media/', '')
                url = f'https://res.cloudinary.com/{CLOUD_NAME}/image/upload/{path}'
            return format_html('<img src="{}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;" />', url)
        return "(No Image)"
    profile_image_preview.short_description = "Profile Image"


# =========================
# Projects
# =========================
@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'image_preview', 'created_at')
    search_fields = ('title', 'description')

    def image_preview(self, obj):
        if obj.image_url:
            url = obj.image_url.url
            if not url.startswith('http'):
                path = url.replace('/media/', '')
                url = f'https://res.cloudinary.com/{CLOUD_NAME}/image/upload/{path}'
            return format_html('<img src="{}" style="width:60px;height:60px;object-fit:cover;" />', url)
        return "(No Image)"
    image_preview.short_description = "Image"


# =========================
# Blog Posts
# =========================
@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'featured_image_preview', 'is_published', 'published_date', 'views_count')
    list_filter = ('is_published', 'category', 'published_date')
    search_fields = ('title', 'excerpt', 'content')
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ('is_published', 'category')

    def featured_image_preview(self, obj):
        if obj.featured_image:
            url = obj.featured_image.url
            if not url.startswith('http'):
                path = url.replace('/media/', '')
                url = f'https://res.cloudinary.com/{CLOUD_NAME}/image/upload/{path}'
            return format_html('<img src="{}" style="width:60px;height:60px;object-fit:cover;" />', url)
        return "(No Image)"
    featured_image_preview.short_description = "Featured Image"


# =========================
# Other models
# =========================
admin.site.register(SocialLink)
admin.site.register(Service)
admin.site.register(FunFact)
admin.site.register(Experience)
admin.site.register(Education)
admin.site.register(Skill)
admin.site.register(SidenavItem)
