from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

admin.site.site_header = "HABUMUGISHA Eric Admin"
admin.site.site_title = "HABUMUGISHA Eric Admin Portal"
admin.site.index_title = "Welcome to HABUMUGISHA Eric Portal"
admin.site.site_url = "https://oflah.vercel.app/"

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('backend_app.urls')),
]

# Serve media files in production (Cloudinary backup)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
if not settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)