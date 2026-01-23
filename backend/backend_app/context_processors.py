from .models import ContactMessage, Testimonial

def admin_notifications(request):
    """
    Context processor to provide unread message count and inactive testimonial count
    to the Django admin templates.
    """
    if request.path.startswith('/admin/'):
        unread_messages = ContactMessage.objects.filter(is_read=False).count()
        inactive_testimonials = Testimonial.objects.filter(is_active=False).count()
        return {
            'unread_messages_count': unread_messages,
            'inactive_testimonials_count': inactive_testimonials,
            'total_notifications_count': unread_messages + inactive_testimonials
        }
    return {}
