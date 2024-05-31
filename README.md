# iRechargeTakeHomeTest API

The documentation for the iRechargeTakeHomeTest API.

## Requirements:

#### QUESTION TWO: API Development:

You are to develop a small containerized service with an HTTP API using a framework of
your choice. The system allows end users to purchase CABLE TV by allowing them to view a
list of available providers and their packages. The intended API can be interfaced via HTTP
and should provide the following endpoints:
● /auth
● GET /users
● GET /providers
● GET /providers/{slug}/packages
Packages are provided as JSON files in the attached zip and need to be imported into the
service once. The API should offer some basic authentication to authenticate a specific
user at the ‘/auth’ endpoint. After a user is authenticated, the user should see user data
at the `/users` endpoint, the providers at /providers (returns slug: unique provider
identifier + name), and the /providers/{slug}/packages return the packages of a
provider.

## Implementation

\*\*Please note

1. To run this project you will need Docker installed on your machine.
2. The API does not include any form of payment processing or actual
   purchase functionality. It only provides information about what products are available and how
   to access it.


## Documentation

The documentation for all endpoints implemented for the iRechargeTakeHomeTest API can be found here [https://documenter.getpostman.com/view/10671823/2sA3JM6gEW](https://documenter.getpostman.com/view/10671823/2sA3JM6gEW).

## Technologies

iRechargeTakeHomeTest API is built using:

- NodeJS (TypeScript) v20.10.0
- POSTGRESSQL (Sequelise ORM)
- Express Web Framework
- NPM
- Redis
- Docker

## Endpoints

### Welcome Message

- **URL:** `http://localhost:7001/`
- **Method:** `GET`
- **Description:** Retrieves a welcome message.


### Health Check

- **URL:** `http://localhost:7001/health`
- **Method:** `GET`
- **Description:** Checks the health of the service.


### Auth Endpoint

- **Path**: `http://localhost:7001/auth`
- **Method**: `POST`
- **Description**: This endpoint is used for user authentication, allowing users to log in.
- **Handler**: UsersController.Login

### Create User Endpoint

- **Path**: `http://localhost:7001/users/`
- **Method**: `POST`
- **Description**: Create a new user account.
- **Handler**: UsersController.createUser


### Get All Users Endpoint

- **Path**: `http://localhost:7001/users/`
- **Method**: `GET`
- **Description**: Retrieves a list of all users.
- **Handler**: Authorization, UsersController.getAllUsers

### Get Single User Endpoint

- **Path**: `http://localhost:7001/users/:id`
- **Method**: `GET`
- **Description**: Retrieves information about a specific user.
- **Handler**: UsersController.getSingleUser



### Providers

#### Get All Providers

- **URL:** `http://localhost:7001/providers/`
- **Method:** `GET`
- **Description:** Retrieves all providers.
- **Authorization Required:** Yes


#### Get Provider Packages

- **URL:** `http://localhost:7001/providers/:slug/packages`
- **Method:** `GET`
- **Description:** Retrieves packages for a specific provider.
- **Authorization Required:** No



## Deployment

### Docker Deployment

#### Prerequisites

- Docker installed on your machine.

- Clone the repository to your local machine.

```bash
docker-compose up --build
```

#### BaseUrl
http://localhost:7001


### Local Machine  Deployment

#### Prerequisites
Make sure you have NodeJS and npm installed
Make sure Postgres and Redis are installed and are working perfectly
Install dependencies using npm install
Set environment variables (you can use .env-example file to edit to your local machine configuration)

#### Build

To execute the build,  run the following command in your terminal or command prompt:

- `npm run build`


#### Tests

To execute the test suite, run the following command in your terminal or command prompt:

- `npm run test`

#### Run

To execute the start, run the following command in your terminal or command prompt:

- `npm run start`
