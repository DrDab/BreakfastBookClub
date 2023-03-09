## Developer Documentation

### How to obtain the source code

#### Clone down repository
```
git clone https://github.com/DrDab/BreakfastBookClub.git
```

### How to build the software

#### 1. Set up database

On a MySQL server of your choice with address `MYSQL_ADDR`, create a schema called `breakfast_book_club` and run `database/Create_Tables.sql` in the `breakfast_book_club` schema to initialize the necessary database tables. Finally, create an account on the MySQL server with the username `MYSQL_USERNAME` and `MYSQL_PASSWORD` and grant the account write access to the `breakfast_book_club` schema. 

#### 2. Set up backend

Go to the backend folder
```
cd breakfastbookclub/backend/BCAPIServer
```

Verify Java JDK version 11 or above is installed. If not, go to https://www.oracle.com/java/technologies/downloads/

```
javac -version
```

Install Gradle and run the appropriate Gradle version required by Breakfast Book Club
```
./gradlew
```

Build backend
```
./gradlew build
```

Clean backend build
```
./gradlew clean
```

Download the file sent by team and copy file into BCAPIServer folder
```
bc-adminsdk-svcacct.json
```

Run backend
```
./run-dev-server --mysql_addr <MYSQL_ADDR> --svc_acct bc-adminsdk-svcacct.json --mysql_username <MYSQL_USERNAME> --mysql_password <MYSQL_PASSWORD>
```

#### 3. Set up frontend

In a seperate terminal, go to the frontend folder
```
cd breakfastbookclub/frontend
```
Then, change the `url` variable in the functions `handleGetFetch` and `handlePostFetch` of `webapp/components/Utils.js` to the address of the backend server.

Install npm packages
```
npm install 
```
Run frontend
```
npm start
```


### How to run the software

Run backend
```
cd breakfastbookclub/backend/BCAPIServer
./run-dev-server --mysql_addr <MYSQL_ADDR> --mysql_username <MYSQL_USERNAME> --mysql_password <MYSQL_PASSWORD> --svc_acct bc-adminsdk-svcacct.json 
```

In a seperate terminal, run frontend
```
cd breakfastbookclub/frontend
npm start
```

The backend must be running in order for frontend to log in or display data.

### Layout and Structure
API
- backend/BCAPIServer/: 
    - src/main/java:
        - BCServerMain.java: Instantiates Spark server instance w/ CORS filters and routes in main method.
        - utils/: Contains utility classes for processing data and applying HTTP filters to server responses.
        - routes/: Contains code for handling HTTP requests from Breakfast Book Club frontend clients.
            - accauth - Routes for user authentication
            - bookclubs - Routes for book club functionalities including making and liking post
            - bookmgmt - Routes for accessing books including searching for and getting books
            - profile - Route for getting user profiles 
        - daos/: Contains DAOs (data-access objects) that communicate with the backend database including Books, Users, Posts, and UserResult.
        - types/: Contains classes for storing book and book post information
    - src/test/java/: Contains tests for BCGsonUtils, OpenLibraryAPI, and SQLTokenStore (will include DAOs in the future)


Database

- Create_Tables.sql - Contains the MySQL database schema configuration for the breakfast_book_club schema, specifically the relevant user and book data that is collected from user interaction with the frontend.


Frontend
- frontend/src/webapp/:
    - Components/: Reusable components such as lists, profile banners, and skeletons.
    - Layouts/: Layouts for logged in and logged out users.
    - Pages/: Main pages (Home, Book Club, User Profile, Search Results, Sign Up, Log In). Each page uses components from the components folder.
- frontend/src/tests/:
    - Pages/: Tests for main pages (Home, Book Club, User Profile, Search Results, Sign Up, Log In).


### How to test the software

Run backend JUnit tests
```
cd breakfastbookclub/backend/BCAPIServer
./gradlew test
```

Run frontend Jest tests
```
cd breakfastbookclub/frontend
npm test
```

### How to add new tests

Backend tests:
All backend tests go into backend/BCAPIServer/src/test/java.
Tests are separated based on the file being tested. Test files must follow the naming convention `Test<filename>.java`. For example, there is a file TestBCGsonUtils.java that tests the functionality in BCGsonUtils.java.

Frontend tests:
All frontend tests go into frontend/src/tests.
Tests are separated based on the file being tested. Test files must follow the naming convention `<filename>.test.js`. For example, there is a file BookClub.test.js that contains tests for BookClub.js.


### How to build a release of the software

Run backend and frontend tests locally before pushing code to a remote branch by following the instructions in the section [How to test the software](#How-to-test-the-software).

Currently no version number needs to be updated in the backend or frontend

Build a release of the backend. The release JAR file can be found in backend/BCAPIServer/build/libs.
```
 ./gradlew shadowJar
```

Build a release of the frontend. This will build and deploy the frontend to https://drdab.github.io/BreakfastBookClub/

```
cd breakfastbookclub/frontend
npm run deploy
```