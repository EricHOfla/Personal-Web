import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_project.settings')
django.setup()

from django.contrib.auth import get_user_model

def create_admin():
    User = get_user_model()
    
    # Get credentials from environment variables (fallback to defaults if not set)
    username = os.environ.get('DJANGO_SUPERUSER_USERNAME')
    email = os.environ.get('DJANGO_SUPERUSER_EMAIL')
    password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')

    # Only run if environment variables are provided to avoid unwanted users
    if not all([username, email, password]):
        print("Skipping superuser creation: DJANGO_SUPERUSER variables not fully set.")
        return

    if not User.objects.filter(username=username).exists():
        print(f"Creating superuser: {username}...")
        User.objects.create_superuser(username=username, email=email, password=password)
        print("Superuser created successfully!")
    else:
        print(f"Superuser '{username}' already exists. Skipping.")

if __name__ == "__main__":
    create_admin()
