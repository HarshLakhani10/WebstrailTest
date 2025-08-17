# Contact Management API

A simple **ASP.NET Core MVC API** with **PostgreSQL (ADO.NET)** backend to manage User details (create, update, fetch).  
Currently, all endpoints are inside the **HomeController** for simplicity.

---

## Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [PostgreSQL](https://www.postgresql.org/download/) installed & running
- A PostgreSQL database created (e.g., `userdb`)

---

## Database Setup

Run the following SQL in PostgreSQL:
Add Npgsql package by running `dotnet add package Npgsql`

```sql
CREATE TABLE contact_details (
    id SERIAL PRIMARY KEY,
    fname VARCHAR(50) NOT NULL,
    lname VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    address TEXT,
    state VARCHAR(50),
    district VARCHAR(50),
    city VARCHAR(50),
    zip VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

Update the PostgreSQL connection string in **`appsettings.json`**:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=contactdb;Username=youruser;Password=yourpassword"
  }
}
```

## Run the Project

1. Open the solution in **Visual Studio** or run in terminal:
   ```
   dotnet run
   ```
2. API will be available at:
   ```
   http://localhost:5067/api/home
   ```

---

## API Endpoints (inside HomeController)

- **POST** `/api/home/submit` → Add new User
- **PUT** `/api/home/update` → Update existing User by id
- **GET** `/api/home/all` → Get all Users

---

## Frontend (Example)

In your HTML/JS project, call API like:

```js
fetch("http://localhost:5067/api/home/all")
  .then((res) => res.json())
  .then((data) => console.log(data));
```

## Deployment (Docker + Render)

This project can be containerized with **Docker**. A sample Dockerfile is included.

### 1. Build Docker image

```bash
cd "form with grid"
docker build -t form-with-grid .
```

### 2. Run Docker container

```bash
docker run -d -p 8080:80 --name form-with-grid form-with-grid
```

API will be accessible at `http://localhost:8080`.

### 3. Deploy to Render (or similar services)

- Push your code to GitHub.
- Create a new **Web Service** on [Render](https://render.com).
- Connect your GitHub repo.
- Select **Docker** as the environment.
- Render will automatically build and deploy your container.
