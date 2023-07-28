# Leaderboard App
## Intern Project

Make a .env file and mention in it the following:
- ATLAS_URI = <URL of your mongodb database>
- TOKEN_KEY = <any random string>
- SECRET_PHRASE = 5b40171489659251097e7790fc2f1892e2183a72546fe1df283d07865db9149c

This SECRET_PHRASE is for the Admin ( or service account) to make backend requests through postman. The Admin needs to enter the decoded version of the above SECRET_PHRASE. The Admin will have to enter {"ADMIN_STRING" : "ADMIN123"} in the body of the postman request he will make. 

You can use any other ADMIN_STRING too by just entering the crypted version of it into the SECRET_PHRASE in the .env file.

To run the application:
- Open termnial. Go to frontend directory, type command "npm install" to download all the packages/dependencies (node modules). After installing the node modules, run "npm start" to launch the frontend part which is made using React.js
- Open another terminal. Go to backend directory, type command "npm install" to download the backend dependencies (node modules). After installing the node modules, run "npm run start" to launch the backend part of the server made using Node.js
- Load the data from the json files I have uploaded alongside the project to mongo database through mongodb compass.


Make sure that the all the cookies and tokens of the browser are removed before running the app. 
Delete any cookies or site data for **localhost:3000**

Now, when the app runs, it will direct to a landing page. You can create a new user yourself or login as an admin with credentials: "user@admin.com" and password: "admin@123". 

Tech stack used:
- Mongodb
- Express.js
- React.js
- Node.js
- ChakraUI (components library)