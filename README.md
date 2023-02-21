# BreakfastBookClub

Breakfast Book Club is a social media site for book lovers. 
Users can join books clubs,
make post about theories, opinion and reviews, within the book club,
friend other users,
and recommend books.

The project directory is subdivided into frontend and backend folders. 
The frontend is broken into page components and resusable components such as people lists and book lists.
These subdirectories are further subdivided into their respective features.

Operational Use Cases:
- Make post about a book
- View all posts on home page
- Search for book clubs to join (Every book is it's own book club)
- View posts made by user in user's profile 


## Start up web app (First time users)
### 0. Install Prerequisites
You should have installed:
- Java JDK version required: 10 or above
- Node and NPM
- MySQL server hosted at address `SQL_SERVER_ADDRESS`

### 1. Start up frontend

Go to frontend folder
```
cd frontend
```

Install npm packages
```
npm install 
```
Start frontend
```
npm start
```

### 2. Start up backend

Go to backend folder
```
cd backend/BCAPIServer
```

Build backend
```
./gradlew build
```

Clean backend build
```
./gradlew clean
```

Download Firebase service account JSON file
```
wget https://gist.githubusercontent.com/DrDab/32035488537b844794375ff4b9884ff5/raw/74001b8aa5f0c225dee943ab7c963e52421e3183/bc-adminsdk-svcacct.json
```

Run backend server
```
./run-dev-server --mysql_addr <SQL_SERVER_ADDRESS> --svc_acct <FIREBASE_SERVICE_ACCT_JSON>
```
_Command with current server address and firebase json_
```
./run-dev-server --mysql_addr 34.145.15.228 --svc_acct bc-adminsdk-svcacct.json
```


### 3. Log in
For the best experience log in with: 
<blockquote>
Email: akha1229@gmail.com

Password: 123456
</blockquote>

<blockquote>
Email: duvictor514@gmail.com

Password: F0xg0fl00f
</blockquote>


## Run web app (Returning Users)
Run frontend
```
cd frontend
npm start
```
Run backend
```
cd backend/BCAPIServer
./run-dev-server --mysql_addr 34.145.15.228 --svc_acct bc-adminsdk-svcacct.json --mysql_username=bcapiserver --mysql_password=bcapiserver
```
Access frontend
Open the frontend server address (`localhost:3000` by default if hosting on local computer) in your preferred browser.

## Run tests

Run frontend Jest tests
```
cd frontend
npm test
```

Run backend JUnit tests
```
cd backend/BCAPIServer
./gradlew test
```

## SSH into remote server
```
ssh [username]@34.145.15.228
```

## Report a bug
Create an issue at `https://github.com/DrDab/BreakfastBookClub/issues`, create an issue, and describe the bug's behavior and any relevant code to the bug.

