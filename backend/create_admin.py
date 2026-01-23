import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_project.settings')
django.setup()

from django.contrib.auth import get_user_model

def create_admin():
    User = get_user_model()
    
    # Using hardcoded defaults as requested
    username = "ofla__"
    email = "ericofla1@gmail.com"
    password = "mama@Ofla1"

    if not User.objects.filter(username=username).exists():
        print(f"Creating superuser: {username}...")
        User.objects.create_superuser(username=username, email=email, password=password)
        print("Superuser created successfully!")
    else:
        # Check if we should update the password for the existing user
        print(f"Superuser '{username}' already exists. Skipping creation.")

if __name__ == "__main__":
    create_admin()
