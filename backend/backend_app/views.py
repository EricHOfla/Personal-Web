from rest_framework.decorators import api_view # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator
from functools import wraps
from .models import *
from .serializers import *

# Custom decorator to cache only GET requests
def cache_get_requests(timeout):
    """Cache only GET requests, skip caching for POST/PUT/DELETE"""
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            if request.method == 'GET':
                # Apply caching for GET requests
                cached_view = cache_page(timeout)(view_func)
                return cached_view(request, *args, **kwargs)
            else:
                # Skip caching for non-GET requests
                return view_func(request, *args, **kwargs)
        return wrapper
    return decorator

# ===== API Root =====
@api_view(['GET'])
def api_root(request):
    base_url = request.build_absolute_uri('/api/')
    return Response({
        "profile": base_url + "profile/",
        "social_links": base_url + "social-links/",
        "services": base_url + "services/",
        "fun_facts": base_url + "fun-facts/",
        "experiences": base_url + "experiences/",
        "education": base_url + "education/",
        "skills": base_url + "skills/",
        "projects": base_url + "projects/",
        "blog_posts": base_url + "blog-posts/",
        "contact": base_url + "contact/",
        "sidenav_items": base_url + "sidenav-items/",
        "testimonials": base_url + "testimonials/",
    })

# ===== Helper Function =====
def get_object(model, pk):
    try:
        return model.objects.get(pk=pk)
    except model.DoesNotExist:
        return None

# ===== Profile =====
@cache_get_requests(60 * 5)  # Cache GET requests for 5 minutes
@api_view(['GET', 'POST'])
def user_profile_list(request):
    if request.method == 'GET':
        profiles = UserProfile.objects.all()
        serializer = UserProfileSerializer(profiles, many=True, context={'request': request})
        return Response(serializer.data)
    serializer = UserProfileSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def user_profile_detail(request, pk):
    profile = get_object(UserProfile, pk)
    if not profile:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        serializer = UserProfileSerializer(profile, context={'request': request})
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = UserProfileSerializer(profile, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        profile.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# ===== Social Links =====
@cache_get_requests(60 * 5)  # Cache GET requests for 5 minutes
@api_view(['GET', 'POST'])
def social_link_list(request):
    if request.method == 'GET':
        links = SocialLink.objects.filter(is_active=True)
        serializer = SocialLinkSerializer(links, many=True)
        return Response(serializer.data)
    serializer = SocialLinkSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def social_link_detail(request, pk):
    link = get_object(SocialLink, pk)
    if not link:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        serializer = SocialLinkSerializer(link)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = SocialLinkSerializer(link, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        link.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# ===== Services =====
@cache_get_requests(60 * 5)  # Cache GET requests for 5 minutes
@api_view(['GET', 'POST'])
def service_list(request):
    if request.method == 'GET':
        services = Service.objects.filter(is_active=True)
        serializer = ServiceSerializer(services, many=True)
        return Response(serializer.data)
    serializer = ServiceSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def service_detail(request, pk):
    service = get_object(Service, pk)
    if not service:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        serializer = ServiceSerializer(service)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = ServiceSerializer(service, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        service.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# ===== Fun Facts =====
@cache_get_requests(60 * 5)  # Cache GET requests for 5 minutes
@api_view(['GET', 'POST'])
def fun_fact_list(request):
    if request.method == 'GET':
        facts = FunFact.objects.filter(is_active=True)
        serializer = FunFactSerializer(facts, many=True)
        return Response(serializer.data)
    serializer = FunFactSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def fun_fact_detail(request, pk):
    fact = get_object(FunFact, pk)
    if not fact:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        serializer = FunFactSerializer(fact)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = FunFactSerializer(fact, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        fact.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# ===== Experiences =====
@cache_get_requests(60 * 5)  # Cache GET requests for 5 minutes
@api_view(['GET', 'POST'])
def experience_list(request):
    if request.method == 'GET':
        experiences = Experience.objects.filter(is_active=True)
        serializer = ExperienceSerializer(experiences, many=True)
        return Response(serializer.data)
    serializer = ExperienceSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def experience_detail(request, pk):
    exp = get_object(Experience, pk)
    if not exp:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        serializer = ExperienceSerializer(exp)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = ExperienceSerializer(exp, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        exp.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# ===== Education =====
@cache_get_requests(60 * 5)  # Cache GET requests for 5 minutes
@api_view(['GET', 'POST'])
def education_list(request):
    if request.method == 'GET':
        items = Education.objects.filter(is_active=True)
        serializer = EducationSerializer(items, many=True)
        return Response(serializer.data)
    serializer = EducationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def education_detail(request, pk):
    item = get_object(Education, pk)
    if not item:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        serializer = EducationSerializer(item)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = EducationSerializer(item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# ===== Skills =====
@cache_get_requests(60 * 5)  # Cache GET requests for 5 minutes
@api_view(['GET', 'POST'])
def skill_list(request):
    if request.method == 'GET':
        items = Skill.objects.filter(is_active=True)
        serializer = SkillSerializer(items, many=True)
        return Response(serializer.data)
    serializer = SkillSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def skill_detail(request, pk):
    item = get_object(Skill, pk)
    if not item:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        serializer = SkillSerializer(item)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = SkillSerializer(item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# ===== Projects =====
@cache_get_requests(60 * 5)  # Cache GET requests for 5 minutes
@api_view(['GET', 'POST'])
def project_list(request):
    if request.method == 'GET':
        items = Project.objects.filter(is_active=True)
        serializer = ProjectSerializer(items, many=True, context={'request': request})
        return Response(serializer.data)
    serializer = ProjectSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def project_detail(request, pk):
    item = get_object(Project, pk)
    if not item:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        serializer = ProjectSerializer(item, context={'request': request})
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = ProjectSerializer(item, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# ===== Blog Posts =====
@cache_get_requests(60 * 15)  # Cache GET requests for 15 minutes
@api_view(['GET', 'POST'])
def blog_post_list(request):
    if request.method == 'GET':
        # Optimize N+1 query: fetch user profile in the same query
        items = BlogPost.objects.filter(is_published=True).select_related('user')
        serializer = BlogPostSerializer(items, many=True, context={'request': request})
        return Response(serializer.data)
    serializer = BlogPostSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def blog_post_detail(request, slug):
    try:
        # Optimize: fetch user profile along with blog post
        item = BlogPost.objects.select_related('user').get(slug=slug)
    except BlogPost.DoesNotExist:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = BlogPostSerializer(item, context={'request': request})
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = BlogPostSerializer(item, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# ===== Blog Post Track View =====
@api_view(['POST'])
def blog_post_track_view(request, slug):
    try:
        item = BlogPost.objects.get(slug=slug)
    except BlogPost.DoesNotExist:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Increment views count
    item.views_count += 1
    item.save(update_fields=['views_count'])
    
    return Response({'views_count': item.views_count})

# ===== Contact Messages =====
@api_view(['GET', 'POST'])
def contact_list(request):
    if request.method == 'GET':
        items = ContactMessage.objects.all()
        serializer = ContactMessageSerializer(items, many=True)
        return Response(serializer.data)
    serializer = ContactMessageSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def contact_detail(request, pk):
    item = get_object(ContactMessage, pk)
    if not item:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        serializer = ContactMessageSerializer(item)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = ContactMessageSerializer(item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# ===== Sidenav Items =====
@cache_get_requests(60 * 5)  # Cache GET requests for 5 minutes
@api_view(['GET', 'POST'])
def sidenav_item_list(request):
    if request.method == 'GET':
        items = SidenavItem.objects.filter(is_active=True)
        serializer = SidenavItemSerializer(items, many=True)
        return Response(serializer.data)
    serializer = SidenavItemSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def sidenav_item_detail(request, pk):
    item = get_object(SidenavItem, pk)
    if not item:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        serializer = SidenavItemSerializer(item)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = SidenavItemSerializer(item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# ===== Testimonials =====
@cache_get_requests(60 * 15)  # Cache GET requests for 15 minutes
@api_view(['GET', 'POST'])
def testimonial_list(request):
    if request.method == 'GET':
        items = Testimonial.objects.filter(is_active=True).order_by('display_order', '-created_at')
        serializer = TestimonialSerializer(items, many=True, context={'request': request})
        return Response(serializer.data)
    serializer = TestimonialSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def testimonial_detail(request, pk):
    item = get_object(Testimonial, pk)
    if not item:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        serializer = TestimonialSerializer(item, context={'request': request})
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = TestimonialSerializer(item, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# ===== Dashboard Callback for Unfold =====
def dashboard_callback(request, context):
    """
    Callback to customize Unfold dashboard context.
    """
    context.update({
        "sample_statistic": "Statistics", # Example stat
    })
    return context
