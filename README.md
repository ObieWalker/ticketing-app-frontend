This is a ticket resolution application built with ReactJS using the Next.js framework to capitalize on server side rendering and client side rendering where appropriate. This is particularly beneficial in cases where you want parts of the site pre-rendered and improves Search Engine Optimization.


View the live app here https://ticketing-app-frontend.vercel.app/

## Getting Started

Note, this assumes you have the backend in Ruby on rails running. If you do not, this can be found [here](https://github.com/ObieWalker/ticketing_system.git)

Instructions for running the server can be found on that repository README.md

To get the frontend started, run the development server:

- Git clone the repo running this command

```git clone https://github.com/ObieWalker/ticketing-app-frontend.git```

- Create a .env file in the root folder and add these values

```
BACKEND_SERVER_URL=http://localhost:3001/
API_SERVER=http://localhost:3000/
HTTPS=false
ENV=development
```

- cd into the root folder and run

```bash
yarn install
```
to install the dependencies.

- run the command below to start the application

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

- Navigate to the register page and sign up with an email, username and password.

- Create new requests.

- Logout and login with an agent user seeded from the backend server and view requests, assign an agent and update the status of the request and generate a CSV of the monthly closed requests.

- Logout and login with an admin user seeded from the backend server and modify the role of users, delete users.