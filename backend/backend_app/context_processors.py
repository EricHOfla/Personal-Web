from .models import ContactMessage, Testimonial, UserProfile

def admin_notifications(request):
    if request.path.startswith('/admin/') and request.user.is_authenticated:
        # Count unread and inactive
        unread_messages_count = ContactMessage.objects.filter(is_read=False).only('id').count()
        inactive_testimonials_count = Testimonial.objects.filter(is_active=False).only('id').count()

        # Add previews (limit to 3 each for performance)
        unread_messages_preview = []
        for msg in ContactMessage.objects.filter(is_read=False)[:3]:
            profile = UserProfile.objects.filter(email=msg.email).first()
            if profile and profile.profile_image:
                url = profile.profile_image.url
                if not url.startswith('http'):
                    url = f'https://res.cloudinary.com/{settings.CLOUDINARY_CLOUD_NAME}/image/upload/{url.replace("/media/", "")}'
                unread_messages_preview.append({'name': msg.name, 'profile_image_url': url})

        inactive_testimonials_preview = []
        for t in Testimonial.objects.filter(is_active=False)[:3]:
            if t.image:
                url = t.image.url
                if not url.startswith('http'):
                    url = f'https://res.cloudinary.com/{settings.CLOUDINARY_CLOUD_NAME}/image/upload/{url.replace("/media/", "")}'
                inactive_testimonials_preview.append({'name': t.name, 'image_url': url})

        return {
            'unread_messages_count': unread_messages_count,
            'inactive_testimonials_count': inactive_testimonials_count,
            'unread_messages_preview': unread_messages_preview,
            'inactive_testimonials_preview': inactive_testimonials_preview,
        }
    return {}
