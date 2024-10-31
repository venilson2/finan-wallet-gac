# Finan GAC API Documentation

## Authentication

### Login
- **Endpoint:** `POST /auth/login`
- **Description:** Authenticate a user by email and password to receive a JWT token.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  - **Status Code:** 200 OK
  - **Body:**
  ```json
  {
    "token": "JWT_TOKEN_HERE",
    "user": {
      "id": 1,
      "name": "User Name",
      "email": "user@example.com",
      "account": {
        "id": 123,
        "balance": 0
      }
    },
    "expires_in": 3600
  }
  ```
- **Errors:**
  - **404 Not Found:** User not found
  - **401 Unauthorized:** Invalid credentials

## User

### Create User
- **Endpoint:** `POST /users`
- **Description:** Create a new user and an associated account.
- **Request Body:**
  ```json
  {
    "email": "maria@email.com.br",
    "name": "Maria",
    "password": "securePassword123"
  }
  ```
- **Response:**
  - **Status Code:** 201 Created
  - **Body:**
  ```json
  {
    "id": 1,
    "name": "Maria",
    "email": "maria@email.com.br",
    "account": {
      "id": 123,
      "balance": 0,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    },
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z",
    "deleted_at": null
  }
  ```
- **Errors:**
  - **409 Conflict:** A user already exists with the provided email.
    - **Response Body:**
    ```json
    {
      "statusCode": 409,
      "message": "A user already exists with this email."
    }
    ```

## Accounts

### Add Credit
- **Endpoint:** `PATCH /accounts/add-credit`
- **Description:** Adds credit to the authenticated user's account.
- **Authorization:** Requires a valid Bearer token.
- **Request Body:**
  ```json
  {
    "amount": 100.00
  }
  ```
- **Response:**
  - **Status Code:** 200 OK
  - **Body:**
  ```json
  {
    "id": "account_id",
    "balance": 100.00,
    "user_id": "user_id",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
  ```
- **Errors:**
  - **400 Bad Request:** The credit amount must be greater than zero.
    - **Response Body:**
    ```json
    {
      "statusCode": 400,
      "message": "Credit amount must be greater than zero"
    }
    ```
  - **404 Not Found:** The account for the user does not exist.
    - **Response Body:**
    ```json
    {
      "statusCode": 404,
      "message": "Account not found"
    }
    ```

## Transfers

### Create Transfer
- **Endpoint:** `POST /transfers`
- **Description:** Initiates a transfer from the authenticated user's account to another account.
- **Authorization:** Requires a valid Bearer token.
- **Request Body:**
  ```json
  {
    "receiver_account_id": "receiver_account_id",
    "amount": 100.00
  }
  ```
- **Response:**
  - **Status Code:** 200 OK
  - **Body:**
  ```json
  {
    "message": "Transfer completed successfully"
  }
  ```
- **Errors:**
  - **404 Not Found:** Destination account not found.
  - **400 Bad Request:** Insufficient funds in source account.
  - **400 Bad Request:** Transfer amount must be greater than zero.
  - **500 Internal Server Error:** An unexpected error occurred.

### Reverse Transfer
- **Endpoint:** `POST /transfers/:id/reverse`
- **Description:** Reverses a previously completed transfer.
- **Authorization:** Requires a valid Bearer token.
- **Parameters:**
  - **id:** The ID of the transfer to be reversed.
- **Response:**
  - **Status Code:** 200 OK
  - **Body:**
  ```json
  {
    "message": "Transfer reversed successfully"
  }
  ```
- **Errors:**
  - **400 Bad Request:** The transfer has already been reversed.
  - **404 Not Found:** The specified transfer does not exist.


## Digram Class

