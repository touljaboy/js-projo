# js-projo
Sample description (we dont have a name yet)
## Figma link - The Whole Team
[here](https://www.figma.com/design/o9R40oH8H8XGoBdjUeI7Fi/Komunikator-sample-name-project?node-id=0-1&p=f&t=nlronAcqX1bIMXgW-0)
## DB Plan - Ernest
Added db plan under the db folder. There, you can also see a drawio file, which you can load to [draw.io](https://app.diagrams.net/)

**Notes**
- Added a new entity: Conversation. It is meant for more convenient and faster load of conversations between two users
- Edited the fields on current entities to use best practice, like collecting metadata and having atomic fields
- Passwords should be encrypted and not stored as plain text according to best practices.

**Todos (besides stuff on project website on github)**
- update DB plan!!! Group entity should have a name field d-_-b
- Write endpoints for CRUD operations for the following stuff: Messages, users, groups, conversations
- Ideally, if time allows, we should have some indexes to optimize message lookups, but first create db right
- **DOCUMENT ALL ENDPOINTS!!!**

## How to run?
After you pull the git project on your machine, navigate to the backend folder and enter:
```
npm install
```
and you will install all of the dependencies which make the server work (like express).

You can then run:
```
npm run dev
```
and the server is ready! (ctrl+c to stop it).
Since we've got nodemon, updates to code update the website!

Enter in your browser and see for yourself!
```
localhost:3000/v1/health
```
## Endpoints
All endpoints should follow this naming convention: /v1/<endpoint>
### GET /v1/health
checks the server health, returns a string "Saul Goodman 8|"
## 'Other stuff' section
### Project initialization in node.js + express (backend) - Ernest (but I recommend whole team try for yourself in a separate project!)
**Steps followed (on ubuntu, but you may use WSL I guess):**
1. ```sudo apt update```
2. Install nodejs and npm ```sudo apt install nodejs npm -y``` Notes for the team: NPM is node package manager, so you can have many versions of node on a single machine with separate packages installed and just activate them and manage EASILY. 
3. Verify install ```node -v && npm -v```

4. ```mkdir backend && cd backend```
5. Initialize npm project ```npm init -y```
6. Install express ```npm install express```
7. Install nodemon (smth like a liveserver) ```npm install --save-dev nodemon```