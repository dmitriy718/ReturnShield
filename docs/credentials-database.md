# How to Set Up Database for ReturnShield

## Overview

ReturnShield uses PostgreSQL as its database. You need to configure:
1. **Database Name** - The name of your database
2. **Database User** - The database username
3. **Database Password** - The database password
4. **Database Host** - Where the database is hosted
5. **Database Port** - The database port (usually 5432)

---

## Option 1: Using Docker (Recommended for Development)

### Step 1: Database is Already Configured!

The `docker-compose.yml` file already includes a PostgreSQL database:

```yaml
db:
  image: postgres:16
  environment:
    POSTGRES_DB: returnshield
    POSTGRES_USER: postgres
    POSTGRES_PASSWORD: postgres
```

### Step 2: Start the Database

1. **Start Docker Compose**
   ```bash
   docker compose up -d db
   ```

2. **Verify it's running**
   ```bash
   docker compose ps
   ```
   - You should see `returnshield_db` running

### Step 3: Run Migrations

1. **Run Django migrations**
   ```bash
   docker compose exec backend python manage.py migrate
   ```
   - This creates all the database tables

### Step 4: Environment Variables

The database is automatically configured in Docker Compose. No manual setup needed!

---

## Option 2: Using Local PostgreSQL

### Step 1: Install PostgreSQL

#### On Ubuntu/Debian:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

#### On macOS (using Homebrew):
```bash
brew install postgresql
brew services start postgresql
```

#### On Windows:
1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Run the installer
3. Follow the installation wizard

### Step 2: Create Database and User

1. **Access PostgreSQL**
   ```bash
   sudo -u postgres psql
   ```
   (On macOS/Windows, you might use `psql` directly)

2. **Create database**
   ```sql
   CREATE DATABASE returnshield;
   ```

3. **Create user**
   ```sql
   CREATE USER returnshield_user WITH PASSWORD 'your_secure_password_here';
   ```

4. **Grant privileges**
   ```sql
   GRANT ALL PRIVILEGES ON DATABASE returnshield TO returnshield_user;
   ```

5. **Exit PostgreSQL**
   ```sql
   \q
   ```

### Step 3: Configure Environment Variables

Create or edit `backend/.env`:

```env
DB_ENGINE=django.db.backends.postgresql
DB_NAME=returnshield
DB_USER=returnshield_user
DB_PASSWORD=your_secure_password_here
DB_HOST=localhost
DB_PORT=5432
```

### Step 4: Run Migrations

```bash
cd backend
python manage.py migrate
```

---

## Option 3: Using Managed PostgreSQL (Production)

### Popular Options:
- **AWS RDS**: https://aws.amazon.com/rds/postgresql/
- **Google Cloud SQL**: https://cloud.google.com/sql/docs/postgres
- **DigitalOcean Managed Databases**: https://www.digitalocean.com/products/managed-databases
- **Heroku Postgres**: https://www.heroku.com/postgres
- **IONOS Database**: If available on your VPS provider

### Step 1: Create Database Instance

1. **Sign up for a managed database service**
2. **Create a PostgreSQL instance**
   - Choose PostgreSQL version 14 or higher
   - Select appropriate size/plan
   - Choose region closest to your app

### Step 2: Get Connection Details

After creating, you'll get:
- **Host**: Something like `db.example.com` or an IP address
- **Port**: Usually `5432`
- **Database Name**: Usually provided or you create it
- **Username**: Provided or you create it
- **Password**: You set this during creation

### Step 3: Configure Environment Variables

For production (on your VPS), edit your `.env` file:

```env
DB_ENGINE=django.db.backends.postgresql
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_secure_password
DB_HOST=your_database_host
DB_PORT=5432
```

### Step 4: Run Migrations

```bash
cd /opt/ReturnShield
docker compose exec backend python manage.py migrate
```

---

## Step 5: Verify Database Connection

### Test Connection

1. **Start your backend**
   ```bash
   cd backend
   python manage.py runserver
   ```

2. **Check for errors**
   - If you see "OperationalError" or connection errors, check your credentials
   - If it starts without errors, the connection is working!

3. **Test with Django shell**
   ```bash
   python manage.py shell
   ```
   ```python
   from django.db import connection
   cursor = connection.cursor()
   cursor.execute("SELECT 1;")
   print("Database connection successful!")
   ```

---

## Step 6: Database Migrations

### What are Migrations?

Migrations are Django's way of applying database schema changes. They create tables, add columns, etc.

### Run Migrations

```bash
# In Docker
docker compose exec backend python manage.py migrate

# Or locally
cd backend
python manage.py migrate
```

### Create New Migrations

If you change models:
```bash
python manage.py makemigrations
python manage.py migrate
```

---

## Step 7: Database Backup

### Create a Backup

```bash
# Using pg_dump
pg_dump -h localhost -U returnshield_user -d returnshield > backup.sql

# Or in Docker
docker compose exec db pg_dump -U postgres returnshield > backup.sql
```

### Restore a Backup

```bash
# Using psql
psql -h localhost -U returnshield_user -d returnshield < backup.sql

# Or in Docker
docker compose exec -T db psql -U postgres returnshield < backup.sql
```

---

## Troubleshooting

### Problem: "Connection refused" error

**Solution**: 
- Check that PostgreSQL is running: `sudo systemctl status postgresql`
- Verify DB_HOST is correct
- Check firewall settings

### Problem: "Authentication failed" error

**Solution**:
- Verify DB_USER and DB_PASSWORD are correct
- Check PostgreSQL user exists: `\du` in psql
- Verify user has access to database

### Problem: "Database does not exist" error

**Solution**:
- Create the database: `CREATE DATABASE returnshield;`
- Verify DB_NAME is correct
- Check user has privileges on database

### Problem: "Permission denied" error

**Solution**:
- Grant privileges: `GRANT ALL PRIVILEGES ON DATABASE returnshield TO user;`
- Make sure user owns the database or has access

### Problem: Docker database not starting

**Solution**:
- Check Docker logs: `docker compose logs db`
- Verify port 5432 is not already in use
- Check disk space: `df -h`

---

## Security Best Practices

1. **Use strong passwords**
   - At least 16 characters
   - Mix of letters, numbers, symbols
   - Don't use common words

2. **Restrict database access**
   - Only allow connections from your app server
   - Use firewall rules
   - Don't expose database to public internet

3. **Regular backups**
   - Set up automated backups
   - Test restore procedures
   - Keep backups in secure location

4. **Use SSL connections** (for production)
   - Enable SSL in PostgreSQL
   - Configure Django to use SSL
   - Add to settings:
     ```python
     'OPTIONS': {
         'sslmode': 'require',
     }
     ```

---

## Additional Resources

- **PostgreSQL Documentation**: https://www.postgresql.org/docs/
- **Django Database Setup**: https://docs.djangoproject.com/en/stable/ref/databases/
- **PostgreSQL Tutorial**: https://www.postgresqltutorial.com/

---

## Quick Reference Checklist

- [ ] PostgreSQL installed (or using Docker)
- [ ] Database created
- [ ] Database user created
- [ ] User granted privileges
- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] Migrations run successfully
- [ ] Backup procedure set up

---

## Current Configuration

### Docker Compose (Default)

```yaml
db:
  image: postgres:16
  environment:
    POSTGRES_DB: ${DB_NAME:-returnshield}
    POSTGRES_USER: ${DB_USER:-postgres}
    POSTGRES_PASSWORD: ${DB_PASSWORD:-postgres}
```

### Django Settings

The database is configured in `backend/core/settings.py`:

```python
if os.getenv("DB_ENGINE"):
    DATABASES = {
        'default': {
            'ENGINE': os.getenv("DB_ENGINE"),
            'NAME': os.getenv("DB_NAME", ''),
            'USER': os.getenv("DB_USER", ''),
            'PASSWORD': os.getenv("DB_PASSWORD", ''),
            'HOST': os.getenv("DB_HOST", ''),
            'PORT': os.getenv("DB_PORT", ''),
        }
    }
```

---

**Last Updated**: 2025-01-XX

