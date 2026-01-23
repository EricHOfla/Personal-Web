from django.contrib import admin
from .models import *

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'is_read', 'is_replied', 'created_at')
    list_filter = ('is_read', 'is_replied', 'created_at')
    search_fields = ('name', 'email', 'message')
    actions = ['mark_as_read']

    def mark_as_read(self, request, queryset):
        queryset.update(is_read=True)
    mark_as_read.short_description = "Mark selected messages as read"

@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ('name', 'company', 'is_active', 'display_order', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'company', 'message')
    list_editable = ('is_active', 'display_order')
    actions = ['activate_testimonials']

    def activate_testimonials(self, request, queryset):
        queryset.update(is_active=True)
    activate_testimonials.short_description = "Activate selected testimonials"

# Other models
admin.site.register(UserProfile)
admin.site.register(SocialLink)
admin.site.register(Service)
admin.site.register(FunFact)
admin.site.register(Experience)
admin.site.register(Education)
admin.site.register(Skill)
admin.site.register(Project)
admin.site.register(BlogPost)
admin.site.register(SidenavItem)
