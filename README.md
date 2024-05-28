# Products and Users Backend Service

This backend service manages products and users in a microservices architecture, utilizing MongoDB for storage. The service is built with Node.js and Express, and it provides RESTful APIs for creating, reading, updating, and deleting products and users.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
  - [Products](#products)
    - [Create Product](#create-product)
    - [Get All Products](#get-all-products)
    - [Get Product by ID](#get-product-by-id)
    - [Update Product](#update-product)
    - [Delete Product](#delete-product)
  - [Users](#users)
    - [Create User](#create-user)
    - [Get All Users](#get-all-users)
    - [Get User by ID](#get-user-by-id)
    - [Update User](#update-user)
    - [Delete User](#delete-user)
- [Technologies](#technologies)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

## Related Projects

- [Order Service](https://github.com/batuncer/Ecommerce-order-service)
- [Frontend Service](https://github.com/batuncer/Ecommercial-Frontend)

## Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/yourusername/products-users-backend.git
   cd products-users-backend
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add the following variables:

   ```plaintext
   MONGODB_URI=mongodb://localhost:27017/yourdbname
   PORT=3000
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Start the service:**

   ```sh
   npm start
   ```

## Usage

After starting the service, it will be available at `http://localhost:3000`. Use a tool like Postman to interact with the API endpoints.

## API Endpoints

### Products

#### Create Product

- **URL:** `/product/new`
- **Method:** `POST`
- **Request Body:**

  ```json
  {
    "name": "Product1",
    "description": "A sample product",
    "price": 29.99,
    "stock": 10,
    "category": "Category1",
    "images": [
      {
        "url": "images.com"
      }
    ]
  }
  ```

- **Response:**

  ```json
  {
    "id": "60c72b2f9b1d4b3d5c4a627a",
    "name": "Product1",
    "description": "A sample product",
    "price": 29.99,
    "category": "Category1",
    "createdAt": "2024-05-21T14:09:55.418Z",
    "updatedAt": "2024-05-21T14:09:55.418Z"
  }
  ```

#### Get All Products

- **URL:** `/products`
- **Method:** `GET`
- **Response:**

  ```json
  [
    {
      "id": "60c72b2f9b1d4b3d5c4a627a",
      "name": "Product1",
      "description": "A sample product",
      "price": 29.99,
      "category": "Category1",
      "createdAt": "2024-05-21T14:09:55.418Z",
      "updatedAt": "2024-05-21T14:09:55.418Z"
    }
  ]
  ```

#### Get Product by ID

- **URL:** `/products/:productId`
- **Method:** `GET`
- **Response:**

  ```json
  {
    "id": "60c72b2f9b1d4b3d5c4a627a",
    "name": "Product1",
    "description": "A sample product",
    "price": 29.99,
    "category": "Category1",
    "createdAt": "2024-05-21T14:09:55.418Z",
    "updatedAt": "2024-05-21T14:09:55.418Z"
  }
  ```

#### Update Product

- **URL:** `/products/:productId`
- **Method:** `PUT`
- **Request Body:**

  ```json
  {
    "name": "Updated Product",
    "description": "Updated description",
    "price": 39.99,
    "category": "Updated Category"
  }
  ```

- **Response:**

  ```json
  {
    "id": "60c72b2f9b1d4b3d5c4a627a",
    "name": "Updated Product",
    "description": "Updated description",
    "price": 39.99,
    "category": "Updated Category",
    "createdAt": "2024-05-21T14:09:55.418Z",
    "updatedAt": "2024-05-21T14:09:55.418Z"
  }
  ```

#### Delete Product

- **URL:** `/products/:productId`
- **Method:** `DELETE`
- **Response:**

  ```json
  {
    "message": "Product deleted successfully"
  }
  ```

### Users

#### Create User

- **URL:** `/users`
- **Method:** `POST`
- **Request Body:**

  ```json
  {
    "username": "John Doe",
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```

- **Response:**

  ```json
  {
    "id": "60c72b2f9b1d4b3d5c4a627b",
    "username": "John Doe",
    "email": "john.doe@example.com",
    "createdAt": "2024-05-21T14:09:55.418Z",
    "updatedAt": "2024-05-21T14:09:55.418Z"
  }
  ```

#### Get All Users

- **URL:** `/users`
- **Method:** `GET`
- **Response:**

  ```json
  [
    {
      "id": "60c72b2f9b1d4b3d5c4a627b",
      "username": "John Doe",
      "email": "john.doe@example.com",
      "createdAt": "2024-05-21T14:09:55.418Z",
      "updatedAt": "2024-05-21T14:09:55.418Z"
    }
  ]
  ```

#### Get User by ID

- **URL:** `/users/:userId`
- **Method:** `GET`
- **Response:**

  ```json
  {
    "id": "60c72b2f9b1d4b3d5c4a627b",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "createdAt": "2024-05-21T14:09:55.418Z",
    "updatedAt": "2024-05-21T14:09:55.418Z"
  }
  ```

#### Update User

- **URL:** `/users/:userId`
- **Method:** `PUT`
- **Request Body:**

  ```json
  {
    "name": "Updated User",
    "email": "updated.email@example.com",
    "password": "newpassword123"
  }
  ```

- **Response:**

  ```json
  {
    "id": "60c72b2f9b1d4b3d5c4a627b",
    "name": "Updated User",
    "email": "updated.email@example.com",
    "createdAt": "2024-05-21T14:09:55.418Z",
    "updatedAt": "2024-05-21T14:09:55.418Z"
  }
  ```

#### Delete User

- **URL:** `/users/:userId`
- **Method:** `DELETE`
- **Response:**

  ```json
  {
    "message": "User deleted successfully"
  }
  ```

## Technologies

- **Node.js**: JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express**: Fast, unopinionated, minimalist web framework for Node.js.
- **MongoDB**: NoSQL database for storing product and user data.
- **Mongoose**: Elegant MongoDB object modeling for Node.js.
- **JWT (JSON Web Tokens)**: For authentication and authorization.
- **Cloudinary**: Cloud-based image and video management services.

## Security

This service uses JWT (JSON Web Tokens) for authentication and authorization. Ensure you have a valid token to access the protected endpoints.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch:

   ```sh
   git checkout -b feature-branch
   ```

3. Make your changes.
4. Commit your changes:

   ```sh
   git commit -m 'Add some feature'
   ```

5. Push to the branch:

   ```sh
   git push origin feature-branch
   ```

6. Open a pull request.

Please ensure your code adheres to the project's coding standards and includes appropriate tests.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Future Improvements

### Testing

- [ ] Add unit tests to increase the reliability of the API.
- [ ] Create integration tests to validate API behavior in different scenarios.

### General Improvements

- [ ] Utilize linter and formatter tools for code cleanliness.
- [ ] Regularly update dependencies and stay informed about security vulnerabilities.
