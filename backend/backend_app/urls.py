from django.urls import path # type: ignore
from django.conf import settings # type: ignore
from django.conf.urls.static import static # type: ignore
from .views import *
from .resume_generator import generate_resume_pdf

urlpatterns = [
    path('', api_root, name='api-root'),
    
    # Dynamic Resume PDF Download
    path('generate-resume/', generate_resume_pdf, name='generate-resume-pdf'),

    # Profile
    path('profile/', user_profile_list, name='user-profile'),
    path('profile/<int:pk>/', user_profile_detail),

    # Social Links
    path('social-links/', social_link_list),
    path('social-links/<int:pk>/', social_link_detail),

    # Services
    path('services/', service_list),
    path('services/<int:pk>/', service_detail),

    # Fun Facts
    path('fun-facts/', fun_fact_list),
    path('fun-facts/<int:pk>/', fun_fact_detail),

    # Experiences
    path('experiences/', experience_list),
    path('experiences/<int:pk>/', experience_detail),

    # Education
    path('education/', education_list),
    path('education/<int:pk>/', education_detail),

    # Skills
    path('skills/', skill_list),
    path('skills/<int:pk>/', skill_detail),

    # Projects
    path('projects/', project_list),
    path('projects/<int:pk>/', project_detail),

    # Blog Posts
    path('blog-posts/', blog_post_list),
    path('blog-posts/<slug:slug>/', blog_post_detail),
    path('blog-posts/<slug:slug>/view/', blog_post_track_view),

    # Contact Messages
    path('contact/', contact_list),
    path('contact/<int:pk>/', contact_detail),

    # Sidenav Items
    path('sidenav-items/', sidenav_item_list),
    path('sidenav-items/<int:pk>/', sidenav_item_detail),
    
    # Testimonials
    path('testimonials/', testimonial_list),
    path('testimonials/<int:pk>/', testimonial_detail),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
