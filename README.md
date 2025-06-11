# DevSocial API

A social media platform for developers built with .NET and Angular.

## Prerequisites

- [.NET 8.0 SDK](https://dotnet.microsoft.com/download)
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Setup

1. Clone the repository
2. Start the PostgreSQL database:
   ```bash
   docker-compose up -d
   ```
3. Navigate to the API project:
   ```bash
   cd DevSocial.API
   ```
4. Run database migrations:
   ```bash
   dotnet ef migrations add InitialCreate
   dotnet ef database update
   ```
5. Run the API:
   ```bash
   dotnet run
   ```

The API will be available at `https://localhost:5001`

## API Endpoints

- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login with email and password
- GET /api/auth/me - Get current user info

## Database

The PostgreSQL database runs in Docker with the following credentials:
- Host: localhost
- Port: 5432
- Database: devsocial
- Username: postgres
- Password: postgres

To stop the database:
```bash
docker-compose down
``` 



linguist pt ai
host pt aplicatii cu containerizare