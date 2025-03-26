#!/bin/bash
# Should be run as root and only on Ubuntu 22

echo "Welcome to the CinemataCMS installation!"

if [ "$(id -u)" -ne 0 ]; then
    echo "Please run as root"
    exit 1
fi

while true; do
    read -p "
This script will update the system, install dependencies, and configure PostgreSQL, NGINX, Redis, and other utilities.
It should be run on a new system with no running instances of these services.
Check the script before proceeding. Enter yes or no: " yn
    case $yn in
        [Yy]*) echo "OK!"; break;;
        [Nn]*) echo "Installation aborted."; exit;;
        *) echo "Please answer yes or no.";;
    esac
done

osVersion=$(lsb_release -d)
if [[ $osVersion != *"Ubuntu 22"* ]]; then
    echo "This script is tested for Ubuntu 22 only. Exiting."
    exit 1
fi

echo "Updating system and installing dependencies..."
apt-get update && apt-get -y upgrade
apt-get install -y python3-venv python3-dev python3-virtualenv python3-pip virtualenv redis-server \
    postgresql nginx git gcc vim unzip ffmpeg imagemagick telnet htop certbot make build-essential \
    libssl-dev zlib1g-dev libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm libncurses5-dev \
    libncursesw5-dev xz-utils tk-dev libffi-dev liblzma-dev python3-openssl python3-certbot cmake \
    libpq-dev python3-certbot-nginx

echo "Downloading and installing ffmpeg..."
wget -q https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz
mkdir -p tmp
tar -xf ffmpeg-release-amd64-static.tar.xz --strip-components 1 -C tmp
cp -v tmp/{ffmpeg,ffprobe,qt-faststart} /usr/local/bin
rm -rf tmp ffmpeg-release-amd64-static.tar.xz
echo "ffmpeg installed to /usr/local/bin"

read -p "Enter portal URL (default: localhost): " FRONTEND_HOST
read -p "Enter portal name (default: CinemataCMS): " PORTAL_NAME

PORTAL_NAME=${PORTAL_NAME:-CinemataCMS}
FRONTEND_HOST=${FRONTEND_HOST:-localhost}

# Remove http(s) prefix
FRONTEND_HOST=$(echo "$FRONTEND_HOST" | sed -r 's|https?://||g')

echo "Creating PostgreSQL database and user..."
su -c "psql -tc \"SELECT 1 FROM pg_database WHERE datname = 'cinematacms'\" | grep -q 1 || psql -c \"CREATE DATABASE cinematacms\"" postgres
su -c "psql -tc \"SELECT 1 FROM pg_roles WHERE rolname = 'cinematacms'\" | grep -q 1 || psql -c \"CREATE USER cinematacms WITH ENCRYPTED PASSWORD 'cinematacms'\"" postgres
su -c "psql -c \"GRANT ALL PRIVILEGES ON DATABASE cinematacms TO cinematacms\"" postgres

echo "Setting up Python virtual environment..."
cd /home/cinemata
virtualenv . --python=python3
source /home/cinemata/bin/activate
cd cinematacms
pip install -r requirements.txt

echo "Setting up secret key..."
SECRET_KEY=$(python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')

echo "Configuring Django settings..."
echo "FRONTEND_HOST='http://$FRONTEND_HOST'" >> cms/local_settings.py
echo "PORTAL_NAME='$PORTAL_NAME'" >> cms/local_settings.py
echo "SSL_FRONTEND_HOST = FRONTEND_HOST.replace('http', 'https')" >> cms/local_settings.py
echo "SECRET_KEY='$SECRET_KEY'" >> cms/local_settings.py
echo "LOCAL_INSTALL = True" >> cms/local_settings.py

mkdir -p logs pids
python manage.py makemigrations files users actions
python manage.py migrate
python manage.py loaddata fixtures/encoding_profiles.json
python manage.py loaddata fixtures/categories.json
python manage.py collectstatic --noinput

ADMIN_PASS=$(python -c "import secrets; print(''.join(secrets.choice('abcdefghijklmnopqrstuvwxyz0123456789') for i in range(10)))")
echo "from users.models import User; User.objects.create_superuser('admin', 'admin@example.com', '$ADMIN_PASS')" | python manage.py shell

python manage.py shell <<EOF
from django.contrib.sites.models import Site
Site.objects.update_or_create(id=1, defaults={'name': "$FRONTEND_HOST", 'domain': "$FRONTEND_HOST"})
EOF

chown -R www-data. /home/cinemata/

systemctl enable --now celery_long.service celery_short.service celery_beat.service cinematacms.service celery_whisper.service

mkdir -p /etc/letsencrypt/live/$FRONTEND_HOST /etc/nginx/sites-enabled /etc/nginx/sites-available /etc/nginx/dhparams
rm -rf /etc/nginx/conf.d/default.conf /etc/nginx/sites-enabled/default
cp deploy/cinemata_fullchain.pem /etc/letsencrypt/live/$FRONTEND_HOST/fullchain.pem
cp deploy/cinemata_privkey.pem /etc/letsencrypt/live/$FRONTEND_HOST/privkey.pem
cp deploy/dhparams.pem /etc/nginx/dhparams/dhparams.pem
cp deploy/cinemata /etc/nginx/sites-available/cinemata
ln -s /etc/nginx/sites-available/cinemata /etc/nginx/sites-enabled/cinemata
cp deploy/uwsgi_params /etc/nginx/sites-enabled/uwsgi_params
cp deploy/nginx.conf /etc/nginx/

systemctl restart nginx

if [ "$FRONTEND_HOST" != "localhost" ]; then
    echo "Attempting to obtain SSL certificate for $FRONTEND_HOST"
    certbot --nginx -n --agree-tos --register-unsafely-without-email -d $FRONTEND_HOST
    certbot --nginx -n --agree-tos --register-unsafely-without-email -d $FRONTEND_HOST
    systemctl restart nginx
else
    echo "Skipping SSL certificate setup for localhost."
fi

if [ "$FRONTEND_HOST" != "localhost" ]; then
    openssl dhparam -out /etc/nginx/dhparams/dhparams.pem 4096
    systemctl restart nginx
else
    echo "Skipping DH params generation for localhost."
fi

echo "Setting up Bento4 for HLS support..."
cd /home/cinemata/cinematacms
wget http://zebulon.bok.net/Bento4/binaries/Bento4-SDK-1-6-0-632.x86_64-unknown-linux.zip
unzip Bento4-SDK-1-6-0-632.x86_64-unknown-linux.zip
mkdir -p /home/cinemata/cinematacms/media_files/hls

chown -R www-data. /home/cinemata/

echo "Installation complete. Access CinemataCMS at http://$FRONTEND_HOST with admin/admin@example.com and password: $ADMIN_PASS"
