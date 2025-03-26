#!/bin/bash
# This script should be run as root and only on Ubuntu 22.04

echo "Welcome to the CinemataCMS installation!"

# Ensure the script is run as root
if [ "$(id -u)" -ne 0 ]; then
    echo "Please run as root"
    exit 1
fi

# Confirm with the user before proceeding
while true; do
    read -p "
This script will perform a system update, install required dependencies, and configure PostgreSQL, NGINX, Redis, and other utilities.
It is intended for a new system with no existing instances of these services. Please review the script before proceeding. Enter yes or no: " yn
    case $yn in
        [Yy]* ) echo "Proceeding with installation..."; break;;
        [Nn]* ) echo "Installation aborted."; exit;;
        * ) echo "Please answer yes or no.";;
    esac
done

# Verify the operating system version
os_version=$(lsb_release -d)
if [[ $os_version != *"Ubuntu 22.04"* ]]; then
    echo "This script is designed for Ubuntu 22.04 only."
    exit 1
fi

# Update system and install dependencies
echo "Updating system and installing dependencies. This may take a few minutes..."
apt-get update && apt-get -y upgrade
apt-get install -y python3-venv python3-dev python3-pip redis-server postgresql nginx git gcc vim unzip ffmpeg imagemagick certbot make build-essential libssl-dev zlib1g-dev libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm libncurses5-dev libncursesw5-dev xz-utils tk-dev libffi-dev liblzma-dev python3-openssl python3-certbot cmake libpq-dev python3-certbot-nginx

# Install ffmpeg
echo "Installing ffmpeg..."
wget -q https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz
mkdir -p /tmp/ffmpeg
tar -xf ffmpeg-release-amd64-static.tar.xz --strip-components 1 -C /tmp/ffmpeg
cp -v /tmp/ffmpeg/{ffmpeg,ffprobe,qt-faststart} /usr/local/bin
rm -rf /tmp/ffmpeg ffmpeg-release-amd64-static.tar.xz
echo "ffmpeg installed to /usr/local/bin"

# Prompt for portal URL and name
read -p "Enter portal URL (e.g., dev.digisec.space) or press enter for localhost: " frontend_host
read -p "Enter portal name or press enter for 'CinemataCMS': " portal_name

# Set default values if none provided
frontend_host=${frontend_host:-localhost}
portal_name=${portal_name:-CinemataCMS}

# Create PostgreSQL database and user
echo "Configuring PostgreSQL database..."
sudo -u postgres psql <<EOF
DO \$\$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'cinematacms') THEN
      CREATE DATABASE cinematacms;
   END IF;
END
\$\$;

DO \$\$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'cinematacms') THEN
      CREATE ROLE cinematacms WITH LOGIN PASSWORD 'cinematacms';
   END IF;
END
\$\$;

GRANT ALL PRIVILEGES ON DATABASE cinematacms TO cinematacms;
EOF

# Create Python virtual environment
echo "Setting up Python virtual environment..."
mkdir -p /home/cinemata
cd /home/cinemata
python3 -m venv venv
source venv/bin/activate

# Clone the CinemataCMS repository
if [ ! -d "cinematacms" ]; then
    git clone https://github.com/EngageMedia-Tech/cinematacms.git
fi
cd cinematacms

# Install Python dependencies
pip install -r requirements.txt

# Download and build whisper.cpp
if [ ! -d "../whisper.cpp" ]; then
    git clone https://github.com/ggerganov/whisper.cpp.git ../whisper.cpp
fi
cd ../whisper.cpp
bash ./models/download-ggml-model.sh large-v3
make
cd ../cinematacms

# Generate Django secret key
secret_key=$(python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')

# Configure local settings
frontend_host_http="http://$frontend_host"
ssl_frontend_host="https://$frontend_host"

cat <<EOL > cms/local_settings.py
FRONTEND_HOST = '$frontend_host_http'
PORTAL_NAME = '$portal_name'
SSL_FRONTEND_HOST = '$ssl_frontend_host'
SECRET_KEY = '$secret_key'
LOCAL_INSTALL = True
EOL

# Create necessary directories
mkdir -p logs pids media_files/hls

# Apply Django migrations and collect static files
python manage.py makemigrations files users actions
python manage.py migrate
python manage.py loaddata fixtures/encoding_profiles.json
python manage.py loaddata fixtures/categories.json
python manage.py collectstatic --noinput

# Create Django superuser
admin_pass=$(python -c "import secrets; print(''.join(secrets.choice('abcdefghijklmnopqrstuvwxyz0123456789') for i in range(10)))")
echo "from users.models import User; User.objects.create_superuser('admin', 'admin@example.com', '$admin_pass')" | python manage.py shell

# Update Django sites framework
echo "from django.contrib.sites.models import Site; Site.objects.update_or_create(id=1, defaults={'domain': '$frontend_host', 'name': '$frontend_host'})" | python manage.py shell

# Set ownership
chown -R www-data:www-data /home/cinemata/

# Configure and start services
for service in celery_long celery_short celery_beat cinematacms celery_whisper; do
    if [ -f "deploy/${service}.service" ]; then
        cp "deploy/${service}.service" /etc/systemd/system/
        systemctl enable $service
        systemctl start $service
    else
        echo "Warning: ${service}.service file missing, skipping."
    fi
done

# Configure NGINX
if [ -f "deploy/cinemata" ]; then
    cp deploy/cinemata /etc/nginx/sites-available/cinemata
    ln -sf /etc/nginx/sites-available/cinemata /etc/nginx/sites-enabled/
else
    echo "Warning: NGINX configuration file 'cinemata' missing, skipping."
fi

# Obtain SSL certificate
if [ "$frontend_host" != "localhost" ]; then
    echo "Attempting to obtain SSL certificate for $frontend_host..."
    certbot --nginx -n --agree-tos --register-unsafely-without-email -d "$frontend_host"

::contentReference[oaicite:2]{index=2}
 
