# Uber Backend API

This repository contains the backend for the Uber-like application.
It is built with Node.js, Express, MongoDB, and Mongoose.

## Project structure

- `app.js` - configures Express, middleware, and routes
- `server.js` - starts the HTTP server
- `routes/user.routes.js` - defines user-related API routes
- `controllers/user.controller.js` - handles request validation and registration logic
- `services/user.service.js` - handles user creation and business logic
- `models/user.model.js` - defines the Mongoose user schema and related methods
- `db/db.js` - connects to MongoDB

## Setup

1. Install dependencies:

```bash
cd Backend
npm install
```

2. Create a `.env` file in `Backend` with the following variables:

```env
PORT=3000
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
```

3. Start the server:

```bash
node server.js
```

The API will run at `http://localhost:3000` by default.

## User API Flow

### 1. Route definition

The API exposes the user registration endpoint in `routes/user.routes.js`:

- `POST /users/register`

This route applies request validation rules using `express-validator`.

### 2. Request validation

The controller validates incoming requests before processing them.
The expected request body is:

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john@example.com",
  "password": "password123"
}
```

Validation rules:

- `email` must be a valid email address
- `fullname.firstname` must be at least 3 characters
- `password` must be at least 6 characters

If validation fails, the API responds with HTTP `400` and a JSON body containing the errors.

### 3. Controller logic

In `controllers/user.controller.js`:

- `validationResult(req)` checks the validation result
- `fullname`, `email`, and `password` are extracted from `req.body`
- the password is hashed using `userModel.hashPassword(password)`
- `createUser(...)` is called to persist the user
- a JWT token is generated using `user.generateAuthToken()`
- the response is returned with the created user and token

### 4. Service logic

In `services/user.service.js`:

- `createUser` verifies fields are present
- the service calls `userModel.create(...)` to save the new user
- the created user document is returned

### 5. Model definition

In `models/user.model.js`, the user schema includes:

- `fullname.firstname` (required, min length 3)
- `fullname.lastname` (min length 3)
- `email` (required, unique, min length 5)
- `password` (required, `select: false`)
- `socketId`


## Endpoints

### POST /users/register

Register a new user.

Request body:

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john@example.com",
  "password": "password123"
}
```

Successful response:

- Status: `200 OK`
- Body:

```json
{
  "token": "<jwt-token>",
  "user": {
    "_id": "<user-id>",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com",
    "socketId": null,
    "__v": 0
  }
}
```

