#!/bin/bash
# Should be run as root and only on Ubuntu 22
echo "Welcome to the CinemataCMS installation!"

if [ "$(id -u)" -ne 0 ]; then
  echo "Please run as root"
  exit 1
fi

while true; do
    read -p "
This script will attempt to perform a system update, install required dependencies, 
configure PostgreSQL, NGINX, Redis, and other utilities.
It is expected to run on a new system **with no running instances of these services**.
Make sure you check the script before proceeding. Enter yes or no: " yn
    case $yn in
        [Yy]* ) echo "Proceeding with installation..."; break;;
        [Nn]* ) echo "Installation aborted. Have a great day!"; exit;;
        * ) echo "Please answer yes or no.";;
    esac
done

# Check OS version
osVersion=$(lsb_release -d)
if [[ $osVersion != *"Ubuntu 22"* ]]; then
    echo "This script is tested only on Ubuntu 22"
    exit 1
fi

echo "Performing system update and installing dependencies..."
apt-get update && apt-get -y upgrade && apt-get install -y \
    python3-venv python3-dev python3-virtualenv python3-pip virtualenv \
    redis-server postgresql nginx git gcc vim unzip ffmpeg imagemagick \
    telnet htop certbot make build-essential libssl-dev zlib1g-dev \
    libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm \
    libncurses5-dev libncursesw5-dev xz-utils tk-dev libffi-dev \
    liblzma-dev python3-openssl python3-certbot cmake libpq-dev \
    python3-certbot-nginx

# Install ffmpeg
echo "Downloading and installing ffmpeg..."
wget -q https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz
mkdir -p tmp
tar -xf ffmpeg-release-amd64-static.tar.xz --strip-components 1 -C tmp
cp -v tmp/{ffmpeg,ffprobe,qt-faststart} /usr/local/bin
rm -rf tmp ffmpeg-release-amd64-static.tar.xz
echo "FFmpeg installed to /usr/local/bin"

# Ask for user inputs
read -p "Enter portal URL (or press enter for localhost): " FRONTEND_HOST
read -p "Enter portal name (or press enter for 'CinemataCMS'): " PORTAL_NAME

PORTAL_NAME=${PORTAL_NAME:-CinemataCMS}
FRONTEND_HOST=${FRONTEND_HOST:-localhost}

# Configure PostgreSQL database
echo "Configuring PostgreSQL database..."
systemctl start postgresql

su - postgres -c "psql -tc \"SELECT 1 FROM pg_roles WHERE rolname='cinematacms'\" | grep -q 1 || psql -c \"CREATE USER cinematacms WITH ENCRYPTED PASSWORD 'cinematacms'\""
su - postgres -c "psql -tc \"SELECT 1 FROM pg_database WHERE datname='cinematacms'\" | grep -q 1 || psql -c \"CREATE DATABASE cinematacms OWNER cinematacms\""
su - postgres -c "psql -c \"GRANT ALL PRIVILEGES ON DATABASE cinematacms TO cinematacms\""

echo "PostgreSQL database setup completed!"

# Setup Python virtual environment
echo "Creating Python virtual environment..."
mkdir -p /home/cinemata
cd /home/cinemata
virtualenv venv --python=python3
source venv/bin/activate
git clone https://github.com/EngageMedia-Tech/cinematacms.git
cd cinematacms
pip install -r requirements.txt

# Generate Django SECRET_KEY
SECRET_KEY=$(python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')

# Remove http/https prefixes from FRONTEND_HOST
FRONTEND_HOST=$(echo "$FRONTEND_HOST" | sed -r 's|https?://||g')

# Configure Django settings
cat <<EOL > cms/local_settings.py
FRONTEND_HOST='http://$FRONTEND_HOST'
PORTAL_NAME='$PORTAL_NAME'
SSL_FRONTEND_HOST = FRONTEND_HOST.replace("http", "https")
SECRET_KEY='$SECRET_KEY'
LOCAL_INSTALL = True
EOL

mkdir -p logs pids
python manage.py makemigrations files users actions
python manage.py migrate
python manage.py loaddata fixtures/encoding_profiles.json
python manage.py loaddata fixtures/categories.json
python manage.py collectstatic --noinput

# Create superuser
ADMIN_PASS=$(python -c "import secrets; print(''.join(secrets.choice('abcdefghijklmnopqrstuvwxyz0123456789') for i in range(10)))")
echo "from users.models import User; User.objects.create_superuser('admin', 'admin@example.com', '$ADMIN_PASS')" | python manage.py shell

echo "from django.contrib.sites.models import Site; Site.objects.update(name='$FRONTEND_HOST', domain='$FRONTEND_HOST')" | python manage.py shell

chown -R www-data. /home/cinemata/

# Configure Celery services
for service in celery_long celery_short celery_beat celery_whisper cinematacms; do
    if [ -f "deploy/${service}.service" ]; then
        cp deploy/${service}.service /etc/systemd/system/
        systemctl enable ${service}.service
        systemctl start ${service}.service
    else
        echo "Warning: Service file deploy/${service}.service not found!"
    fi
done

# Configure NGINX
mkdir -p /etc/letsencrypt/live/$FRONTEND_HOST
mkdir -p /etc/nginx/sites-enabled /etc/nginx/sites-available /etc/nginx/dhparams/
rm -rf /etc/nginx/conf.d/default.conf /etc/nginx/sites-enabled/default

if [ -f "deploy/cinemata" ]; then
    cp deploy/cinemata /etc/nginx/sites-available/cinemata
    ln -s /etc/nginx/sites-available/cinemata /etc/nginx/sites-enabled/cinemata
    cp deploy/nginx.conf /etc/nginx/
else
    echo "Warning: NGINX configuration file deploy/cinemata not found!"
fi

# SSL Certificate setup
if [ "$FRONTEND_HOST" != "localhost" ]; then
    echo "Attempting to obtain SSL certificate for $FRONTEND_HOST..."
    certbot --nginx -n --agree-tos --register-unsafely-without-email -d "$FRONTEND_HOST" || echo "Certbot failed. Using self-signed certificate."
    systemctl restart nginx
else
    echo "Skipping SSL setup for localhost..."
fi

# Generate DH parameters
if [ "$FRONTEND_HOST" != "localhost" ]; then
    openssl dhparam -out /etc/nginx/dhparams/dhparams.pem 4096
    systemctl restart nginx
else
    echo "Skipping DH parameter generation for localhost..."
fi

# Install Bento4 utility for HLS
cd /home/cinemata/cinematacms
wget http://zebulon.bok.net/Bento4/binaries/Bento4-SDK-1-6-0-632.x86_64-unknown-linux.zip
unzip Bento4-SDK-1-6-0-632.x86_64-unknown-linux.zip
mkdir -p media_files/hls

# Set correct permissions
chown -R www-data. /home/cinemata/

echo "CinemataCMS installation completed!"
echo "Open your browser and go to: http://$FRONTEND_HOST"
echo "Login with user: admin and password: $ADMIN_PASS"
