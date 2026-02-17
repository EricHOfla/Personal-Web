from django.db import models
from django.utils.text import slugify


# =========================
# 1. User / Profile Model
# =========================
class UserProfile(models.Model):
    full_name = models.CharField(max_length=100)
    first_name = models.CharField(max_length=50, blank=True)
    last_name = models.CharField(max_length=50, blank=True)
    title = models.CharField(max_length=100, blank=True)
    bio = models.TextField(blank=True)
    profile_image = models.ImageField(upload_to="profiles/", blank=True, null=True)
    cv_file = models.FileField(upload_to="cv/", blank=True, null=True)
    qualification = models.CharField(max_length=100, blank=True)
    residence = models.CharField(max_length=100, blank=True)
    address = models.CharField(max_length=255, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(max_length=100)
    freelance_status = models.CharField(max_length=50, default="Available")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.full_name


# =========================
# 2. Social Links
# =========================
class SocialLink(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="social_links")
    platform = models.CharField(max_length=50)
    url = models.URLField()
    icon = models.CharField(max_length=50, blank=True)
    display_order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True, db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


# =========================
# 3. Services
# =========================
class Service(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="services")
    title = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=50, blank=True)
    display_order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True, db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


# =========================
# 4. Fun Facts
# =========================
class FunFact(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="fun_facts")
    description = models.CharField(max_length=100)
    value = models.IntegerField(blank=True, null=True)
    icon = models.CharField(max_length=50, blank=True)
    display_order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True, db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


# =========================
# 5. Experience
# =========================
class Experience(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="experiences")
    job_title = models.CharField(max_length=150)
    company = models.CharField(max_length=150)
    location = models.CharField(max_length=100, blank=True)
    time_period = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    display_order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True, db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


# =========================
# 6. Education
# =========================
class Education(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="education")
    degree = models.CharField(max_length=150)
    institution = models.CharField(max_length=150)
    location = models.CharField(max_length=100, blank=True)
    time_period = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    display_order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True, db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


# =========================
# 7. Skills
# =========================
class Skill(models.Model):
    CATEGORY_CHOICES = (
        ("Design", "Design"),
        ("Languages", "Languages"),
        ("Coding", "Coding"),
        ("Knowledge", "Knowledge"),
    )

    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="skills")
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    skill_name = models.CharField(max_length=100)
    proficiency_level = models.IntegerField(blank=True, null=True)
    description = models.TextField(blank=True)
    display_order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True, db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


# =========================
# 8. Projects
# =========================
class Project(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="projects")
    title = models.CharField(max_length=150)
    category = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)
    image_url = models.ImageField(upload_to="projects/", blank=True, null=True)
    project_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    technologies = models.JSONField(blank=True, null=True)
    display_order = models.IntegerField(default=0)
    is_featured = models.BooleanField(default=False, db_index=True)
    is_active = models.BooleanField(default=True, db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


# =========================
# 9. Blog Posts
# =========================
class BlogPost(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="blog_posts")
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=100, blank=True, db_index=True)
    excerpt = models.TextField(blank=True)
    content = models.TextField()
    featured_image = models.ImageField(upload_to="blogs/", blank=True, null=True)
    published_date = models.DateField()
    slug = models.SlugField(unique=True, blank=True)
    views_count = models.IntegerField(default=0)
    is_published = models.BooleanField(default=True, db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)


# =========================
# 10. Contact Messages
# =========================
class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    is_replied = models.BooleanField(default=False)
    ip_address = models.CharField(max_length=50, blank=True)
    user_agent = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    


# =========================
# 11. Sidenav Items
# =========================
class SidenavItem(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="sidenav_items")
    category = models.CharField(max_length=50)
    item_text = models.CharField(max_length=200)
    item_url = models.CharField(max_length=255, blank=True)
    display_order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True, db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


# =========================
# 12. Testimonials
# =========================
class Testimonial(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="testimonials")
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=100, blank=True)
    company = models.CharField(max_length=100, blank=True)
    message = models.TextField()
    image = models.ImageField(upload_to="testimonials/", blank=True, null=True)
    display_order = models.IntegerField(default=0, db_index=True)
    is_active = models.BooleanField(default=True, db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.company}"
