# Multi-Level category Management API

This is the backend APi for the assignment.  
It includes authentication and multi-level category features.

---

## How to Run the Project (Docker)

first start Docker Desktop is running, then run:

docker compose up --build

This will start:
-- Node.js API on port 4000
-- MongoDB on port 27017

After the containers start, the backend will be available at:

http://localhost:4000

## API Endpoints

### Auth

1.Register  
POST `/api/auth/register`  
Body:
{
"email": "test@gmail.com",
"password": "123456"
}

2.Login
POST `/api/auth/login`  
Response:
{
"token": "jwt_token_here",
}

### Categories (requires Bearer token)

1.Create Category
POST `/api/category`  
Body:
{
"name": "Electronics",
"parent": "optional_parent_id",
}

### Get Category Tree

GET `/api/category`  
Sample Response:
[{
"\_id": "123",
"name": "Electronics",
"children": [{
"\_id": "456",
"name": "Mobiles",
"children": []
}]}]

## Update Category

PUT `/api/category/:id`

**Delete Category**  
DELETE `/api/category/:id`

## Tests

Tests are written using Jest and Supertest.  
Run them with:

npm test

## Notes

- The project is built with Node.js, Express, TypeScript, MongoDB, and JWT.
- Docker support is added as required in the assignment.
