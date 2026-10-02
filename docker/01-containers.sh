# Comando para listar contenedores
docker container ls # <agrega -a para listar todos>
docker container run -p 666:80 docker/getting-started
docker container rm <id o nombre>
docker container rm -f fbbd40
docker container prune
docker container run ubuntu sleep 3600
docker container run -e MYSQL_ROOT_PASSWORD=Secret123  -dp 3307:3306 mysql