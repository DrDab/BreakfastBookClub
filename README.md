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

### Clean backend build
```
./gradlew clean
```
###

### Run backend JUnit tests
```
cd backend/BCAPIServer
./gradlew test
```

### Download Firebase service account JSON file
```
cd backend/BCAPIServer
wget https://gist.githubusercontent.com/DrDab/32035488537b844794375ff4b9884ff5/raw/74001b8aa5f0c225dee943ab7c963e52421e3183/bc-adminsdk-svcacct.json
```

### Run backend server
```
cd backend/BCAPIServer
./run-dev-server --mysql_addr <SQL_SERVER_ADDRESS> --svc_acct <FIREBASE_SERVICE_ACCT_JSON>
```

SQL_SERVER_ADDRESS is 34.145.15.228 for now.
FIREBASE_SERVICE_ACCT_JSON is bc-adminsdk-svcacct.json