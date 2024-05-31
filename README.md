# MAILCHAT API

The documentation for the MAILCHAT API.

## Requirements:
Home Assignment – Full Stack Developer
1. Your assignment will be to develop a mail inbox application.
2. It is preferable that you use React or Angular 2+, but you may use any other Javascript
framework.
3. You may style the app as you wish.
4. Use a predefined user. Any other users will not show the messages.
5. The top bar of the app should indicate how many unread messages are there and name
of the user.
6. The app will consist of 3 pages.
7. Define the APIs separate document/YAML/Swagger/postman, that are going to be used in
app.
8. Data should be come from DB with API layer (Nodejs, PHP…)


## Implementation

\*\*Please note
1. To run this project you will need MYSQL & REDIS installed on your machine.

## Documentation

The documentation for all endpoints implemented for the MAILCHAT API can be found here [https://documenter.getpostman.com/view/10671823/2sA3QwapCw](hhttps://documenter.getpostman.com/view/10671823/2sA3QwapCw).

## Technologies

MAILCHAT API is built using:

- NodeJS (TypeScript) v20.10.0
- MYSQL (Sequelise ORM)
- Express Web Framework
- NPM
- Redis

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



### Messages

#### Get All Messages

- **URL:** `http://localhost:7001/messages/`
- **Method:** `GET`
- **Description:** Retrieves all messages.
- **Authorization Required:** Yes


#### Get User Messages

- **URL:** `http://localhost:7001/messages/:userid`
- **Method:** `GET`
- **Description:** Retrieves Messages for a specific user.
- **Authorization Required:** No



## Deployment

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

#### BaseUrl
http://localhost:7001
