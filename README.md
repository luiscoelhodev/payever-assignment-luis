# PAYEVER | BACK-END TASK

This project was developed after a challenge proposed Payever for the position of Back-end Engineer. It is a task to create a simple REST application from scratch, using Nest.js, Typescript, MongoDB, RabbitMQ and communicating with an external API (<https://reqres.in/>) .

## Content

[1. Getting Started](#getting-started)  
&emsp;[1.1 Requirements](#requirements)  
[2. Download and Installation](#download-and-installation)  
&emsp;[2.1 Option 1: Running the project in Production mode](#option-1-running-the-project-in-productionstaging-mode)  
&emsp;[2.2 Option 2: Running the project in Development mode](#option-2-running-the-project-in-development-mode)  
[3. API Resources](#api-resources)  
&emsp;[3.1 Endpoints](#endpoints)  
[4. Technologies](#technologies)  
[5. License](#license)  

## Getting Started

The following instructions will help you get a copy of this project up and running on your local machine. You will be able to test it as Production/Staging or Development mode.

Below you will also find relevant information about the API resources available (its endpoints) as well as the main technologies used to build it.

### Requirements

You need to have Docker (for ```docker-compose```) installed on your machine in order to run this project. If you don't have it or don't want to make use of the *dockerized* environment of this project, you will need to install the following technologies and run them locally:

- <https://nodejs.org/en/download/> - Node.js
- <https://www.mongodb.com/try/download/community> - MongoDB
- <https://www.rabbitmq.com/download.html> - RabbitMQ
- <https://www.docker.com/products/docker-desktop/> - Docker

PS.: For MongoDB, you can use its Atlas service so you don't have to install it on your machine. You can access it on <https://www.mongodb.com/atlas/database>.

## Download and Installation

Make sure you have Git installed on your machine so you can clone this project by running the following command:

``` bash
git clone https://github.com/luiscoelhodev/ng-backend-assignment.git
```

Alternatively, if you are reading this README after downloading the .zip file, you already have all the necessary files in the root folder so you can move along.

Use the *Option 1* if you want to use the production-ready version of this project with a single docker-compose command. Otherwise, use the *Option 2* if you want to test its development version.  

### Option 1: Running the project in Production mode

In the root of the project, you will find a '.env.example' file which needs to be modified before running the project, because it contains sensitive information which are crucial values used in the application. The necessary instructions can be found in the file itself.

After that, open up the root folder in a terminal window and run the following command:

``` bash
docker-compose up -d
```

This command will build the API docker image, run its service along with a MongoDB and RabbitMQ services in a docker-compose as three containers sharing a common default network.

Within its own container, the API service then starts up the server, running on port 3000.

At this point, you should be able to send HTTP requests to <http://localhost:3000>. There is a GET endpoint at '/' which serves the string 'Hello World'. All the other resources can be found in another section below.

### Option 2: Running the project in development mode

With this option you may or not make use of Docker. To keep using the dependencies in the containers, stop the application container (only the 'app' one) and connect to the other services by modifying the .env.example file as instructed in the file. You can also connect to the dependencies locally on your machine if you want to (MongoDB and RabbitMQ), but you will also have to modify their variable accordingly.

1. Open the *'.env.example'* file and follow the instructions in it.

2. After setting up your environment variables, run ``` npm install ``` to install all dependencies.

3. ```npm run start:dev``` will start up the application using a nest.js script, running on port 3000. From this point on, you can starting sending request or running tests.

## API Resources

You can use an http client to send requests to this application, such as *Insomnia*, *Postman* or even the *Thunder Client* extension in VS Code.

### Endpoints

1. POST /api/users  
This route stores a user entry in the database. After its creation, it sends an email to 'user.email' with a welcome message and also a RabbitMQ event.
2. GET /api/user/{userId}  
This route retrieves data from an external API and returns a user in JSON representation with dummy information.
3. GET /api/user/{userId}/avatar  
This route retrieves an image from the 'user.data' which is a URL at first. After the first request, it stores the image in the File System and generates a hash which is used to name the .jpg file and also the 'user.avatar' value. On following requests, the image is retrieved from the File System.
4. DELETE /api/user/{userId}/avatar  
This route removes the image file from the File System storage and also the 'user.avatar' entry in the database.

## Technologies  

Main technologies in this project:

- [Node.js](https://nodejs.org/en/) - *A JavaScript runtime built on Chrome's V8 JavaScript engine.*
- [Nest.js](https://nestjs.com/) - *A progressive Node.js framework to build highly scalable and testable applications.*
- [Docker](https://www.docker.com/) - *A service products that use OS-level virtualization to deliver software in packages called containers.*
- [MongoDB](https://www.mongodb.com/) - *A document-oriented database program.*
- [Typescript](https://www.typescriptlang.org/) - *A strongly typed programming language that builds on JavaScript.*
- [RabbitMQ](https://www.rabbitmq.com/) - *An open-source message-broker software.*

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE) file for details.
