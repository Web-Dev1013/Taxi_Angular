echo "Starting Update"
unzip www.zip
rm www.zip
cd /var/www/html
zip -q -9 -r ~/backup.zip www/*
rm -rf ./www
mv ~/www .
chown -R www-data:www-data www/
# rm www.zip
