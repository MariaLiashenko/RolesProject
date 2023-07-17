# RolesProject
### Contribution Guidelines
The project involved building a user management system with three roles: administrator, boss, and user. To organize the users, a hierarchical tree structure was implemented, where each user is represented as a node in the tree. Upon starting the project, the initial tree structure is created and saved in a file named "tree.json". This file serves as a persistent storage for the user tree, allowing the system to retain the hierarchy even after server restarts or shutdowns.
### How to start
- npm install 
- npm start 
- To get started, you will need an MongoDB for your application. It is necessary to create a .env file where you can specify the username and password for the database user.
### Routes
###### Create new User
Method: POST \
URL: `http://localhost:8000/auth/register` \
BODY: {"username": "Nasar","role": "user", "email": "Nasar@gmail.com", "password": "12345", "parentId":"64b3b715e2e2cc62051d948b"}   
If it is administrator parentId should be null
Must be: unique email

###### Login  User
Method: POST \
URL: `http://localhost:8000/auth/login` \
BODY: {	
	"email": "seva@gmail.com",
	"password": "12345"
} 


######  View list
Method: GET \
URL: `http://localhost:8000/auth/list`  \
Must be: add a token in the header with the key x-access-token


######  Change boss
Method: POST \
URL: `http://localhost:8000/auth/changeBoss`  \
BODY: 
	{	
	"userId": "64b3bab43502ae5b91b9a4d1",
	"newBossId": "64b3bb4d3502ae5b91b9a4d7"
}
Must be: add a boss token in the header with the key x-access-token
