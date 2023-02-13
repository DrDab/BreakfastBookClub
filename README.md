# BreakfastBookClub

Breakfast Book Club is a social media site for book lovers. 
Users can join books clubs,
make post about theories, opinion and reviews, within the book club,
friend other users,
and recommend books.

The project directory is subdivided into frontend and backend folders. 
The frontend is broken into page components and resusable components such as people lists and book lists.
These subdirectories are further subdivided into their respective features.


## Set up

### Run frontend
```
cd frontend
npm start
```

### Run frontend JEST tests
```
cd frontend
npm test
```

### SSH into remote server
```
ssh [username]@34.145.15.228
```

### Build backend
```
cd backend/BCAPIServer
./gradlew build
```

### Clean backend
```
./gradlew clean
```
###

### Run backend JUnit tests
```
cd backend/BCAPIServer
./gradlew test
```

### Run backend server
```
cd backend/BCAPIServer
./run-dev-server --mysql_addr <SQL_SERVER_ADDRESS> --svc_acct <FIREBASE_SERVICE_ACCT_JSON>
```

