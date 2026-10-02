# Guía: levantar Pet Radar API con Docker Compose

Esta guía explica cómo levantar la API, sus migraciones y los servicios que necesita (PostGIS y Redis) usando la imagen publicada en Docker Hub (`juanfr97/pet-radar-api`) y el archivo `compose.yaml` de este repositorio.

## 1. Arquitectura

El `compose.yaml` define cuatro servicios:

| Servicio     | Imagen                          | Contenedor           | Puerto | Función                                                        |
|--------------|---------------------------------|----------------------|--------|----------------------------------------------------------------|
| `postgres`   | `postgis/postgis:16-master`     | `511-petradar-db`    | 5432   | Base de datos PostgreSQL 16 con la extensión PostGIS           |
| `redis`      | `redis`                         | `511-petradar-redis` | 6379   | Caché / almacenamiento en memoria                              |
| `migrations` | `juanfr97/pet-radar-api:latest` | `PetRadarMigrator`   | —      | Ejecuta `npm run migration:run` (TypeORM) y termina            |
| `api`        | `juanfr97/pet-radar-api:latest` | `PetRadarApi`        | 3000   | API NestJS (`node dist/main.js`)                               |

Orden de arranque:

```
postgres (healthy) ──► migrations (crea tablas) ──► api
redis ─────────────────────────────────────────────► (la api se conecta por REDIS_HOST)
```

- **PostGIS es obligatorio**: la tabla `LOST_PET` usa una columna `geometry(Point,4326)`. Con un PostgreSQL normal la migración falla. La imagen `postgis/postgis` habilita la extensión automáticamente en la base indicada en `POSTGRES_DB`.
- **Redis es obligatorio**: la API valida `REDIS_HOST` y `REDIS_PORT` al iniciar y se conecta con `ioredis`.
- Las migraciones y la API usan **la misma imagen**; el servicio `migrations` solo cambia el comando de arranque.

## 2. Requisitos

- Docker Desktop (o Docker Engine + plugin Compose v2). Verifica con:

```bash
docker --version
docker compose version
```

- Acceso a internet para descargar las imágenes de Docker Hub.
- Puertos libres en tu máquina: `3000`, `5432` y `6379`.

## 3. La imagen en Docker Hub

La imagen se construye y publica automáticamente con GitHub Actions (`.github/workflows/build-push.yml`) en cada push a `main`, con dos tags:

- `juanfr97/pet-radar-api:latest`
- `juanfr97/pet-radar-api:<sha-del-commit>`

Para que el workflow funcione, el repositorio de GitHub debe tener los secretos `DOCKER_USER` y `DOCKER_PASSWORD` (de preferencia un *Access Token* de Docker Hub).

Si prefieres publicarla manualmente desde tu máquina:

```bash
docker login
docker build -t juanfr97/pet-radar-api:latest .
docker push juanfr97/pet-radar-api:latest
```

Para descargar la última versión antes de levantar:

```bash
docker compose pull
```

## 4. Variables de entorno (`.env`)

Docker Compose lee automáticamente el archivo `.env` que está junto a `compose.yaml` y sustituye las variables `${...}`. Crea el archivo `.env` en la raíz del proyecto:

```env
MAILER_SERVICE=gmail
MAILER_USER=tu_correo@gmail.com
MAILER_TOKEN=tu_app_password

MAPBOX_TOKEN=tu_token_de_mapbox

DB_NAME=petradardb
DB_HOST=postgres
DB_USER=postgres
DB_PASSWORD=una_contraseña_segura
DB_PORT=5432

REDIS_HOST=redis
REDIS_PORT=6379
```

Puntos importantes:

- `DB_HOST=postgres` y `REDIS_HOST=redis` deben ser **el nombre del servicio** en el compose, no `localhost`. Dentro de la red de Docker, `localhost` apunta al propio contenedor de la API.
- `DB_PORT` y `REDIS_PORT` son los puertos **internos** de los contenedores (5432 y 6379), no los publicados en tu máquina.
- `DB_USER` debe ser `postgres`, porque el compose no define `POSTGRES_USER` y la imagen usa ese usuario por defecto.
- `DB_NAME` debe ser `petradardb`, porque el `healthcheck` de `postgres` revisa esa base por nombre. Si cambias el nombre, actualiza también el `healthcheck`.
- Todas las variables son **requeridas**: si falta alguna, la API y las migraciones fallan al iniciar (`env-var` lanza un error).
- El `.env` está en `.dockerignore` y `.gitignore`, así que no se sube a la imagen ni al repositorio. Nunca lo publiques.

## 5. Levantar todo

Desde la raíz del proyecto (donde está `compose.yaml`):

```bash
docker compose up -d
```

Lo que ocurre:

1. Se crean los volúmenes `postgres_data_db` y `redis_data_db` (solo la primera vez).
2. Arrancan `postgres` y `redis`.
3. Compose espera a que `postgres` pase el `healthcheck` (`pg_isready`).
4. Arranca `migrations`, que compila y ejecuta las migraciones pendientes de `dist/db/migrations`, y luego termina.
5. Arranca `api` en el puerto `3000`.

## 6. Verificar

Estado de los contenedores:

```bash
docker compose ps -a
```

`migrations` debe aparecer como `Exited (0)`; `api`, `postgres` y `redis` como `Up`.

Logs de las migraciones:

```bash
docker compose logs migrations
```

Debes ver mensajes como `Migration CreateLostPets1787352255718 has been executed successfully.` En ejecuciones posteriores verás `No migrations are pending`.

Logs de la API:

```bash
docker compose logs -f api
```

Probar que responde:

```bash
curl http://localhost:3000
```

Revisar las tablas creadas en la base:

```bash
docker compose exec postgres psql -U postgres -d petradardb -c "\dt"
```

Debes ver `LOST_PET`, la tabla de correos pendientes, la de usuarios y la tabla `migrations` de TypeORM.

Probar Redis:

```bash
docker compose exec redis redis-cli ping
```

Debe responder `PONG`.

## 7. Operaciones comunes

Ejecutar las migraciones de nuevo (por ejemplo, después de publicar una imagen con migraciones nuevas):

```bash
docker compose pull
docker compose run --rm migrations
docker compose up -d api
```

Revertir la última migración:

```bash
docker compose run --rm migrations npm run migration:revert
```

Actualizar a la última imagen de Docker Hub:

```bash
docker compose pull
docker compose up -d
```

Usar una versión específica (tag por commit): cambia `latest` por el SHA en `compose.yaml` en los servicios `api` y `migrations`, por ejemplo `juanfr97/pet-radar-api:d6a5ab7...`.

Detener los servicios (conserva los datos):

```bash
docker compose down
```

Detener y **borrar los datos** de PostGIS y Redis:

```bash
docker compose down -v
```

## 8. Consideraciones y problemas frecuentes

- **La API arranca antes de que terminen las migraciones.** En el compose actual, `api` depende de `migrations` sin condición, así que Compose solo espera a que el contenedor de migraciones *inicie*, no a que *termine*. Para que la API espere a que las migraciones terminen con éxito, usa:

  ```yaml
  depends_on:
    migrations:
      condition: service_completed_successfully
    redis:
      condition: service_started
  ```

  Esto además asegura que `redis` esté arriba antes que la API.

- **`ECONNREFUSED` al conectar a la base o a Redis.** Revisa que `DB_HOST=postgres` y `REDIS_HOST=redis` en el `.env`, y que los contenedores estén en `Up`.

- **`type "geometry" does not exist`.** La base no tiene PostGIS. Asegúrate de usar la imagen `postgis/postgis` y no `postgres`. Si el volumen se creó antes con otra imagen, bórralo con `docker compose down -v` y vuelve a levantar.

- **El healthcheck de `postgres` nunca pasa.** Normalmente es porque `DB_NAME` no es `petradardb`; el `healthcheck` usa ese nombre fijo.

- **Cambié `DB_PASSWORD` y ya no conecta.** `POSTGRES_PASSWORD` solo se aplica la primera vez que se inicializa el volumen. Cambia la contraseña dentro de la base o borra el volumen con `docker compose down -v`.

- **Puerto ocupado (`port is already allocated`).** Otro proceso usa 3000, 5432 o 6379 (por ejemplo, un PostgreSQL o Redis local). Detenlo o cambia el puerto de la izquierda en `ports`, por ejemplo `5433:5432`.

## 9. Resumen rápido

Con el `.env` creado (sección 4):

```bash
docker compose pull
docker compose up -d
docker compose logs migrations
curl http://localhost:3000
```
