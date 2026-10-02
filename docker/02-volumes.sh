# Volumenes Administrados
docker volume ls
docker volume create <nombre>
docker container run ^                                                                                                            ─╯
> -e MYSQL_ROOT_PASSWORD=Secret123 ^
> -v mysqldb:/var/lib/mysql ^
> -dp 3307:3306 ^
> mysql
# Volumenes Bind
# Buckets S3