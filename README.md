Download:<br>
git clone https://github.com/igorkryvoruchko/fortune.git
<hr>
Download dependencies:<br>
cd register<br>
composer install
<hr>
Run:<br>
cd docker<br>
docker-compose up -d
<hr>
Update db schema:<br>
docker-compose exec php sh<br>
bin/console doctrine:schema:update --force
<hr>
View: localhost<br>
phpMyAdmin: localhost:8080<br>
Username: igor<br>
Password: igor