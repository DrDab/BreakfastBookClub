# BreakfastBookClub

## User Documentation

### Description:

Breakfast Book Club is a social networking website for literature enthusiasts. Users can customize their profiles, join book clubs for the books they enjoy to receive user-generated content that other users post to these book clubs, make friends with other users on Breakfast Book Club, and make posts to book clubs for the books they enjoy. A user would want to use it to share theories, reviews and ideas about their favorite books and books that they are reading with their friends who are also reading those books.



### How to install the software

#### 1. Clone down repository
```
git clone https://github.com/DrDab/BreakfastBookClub.git
```

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
./run-dev-server --mysql_addr 34.145.15.228 --svc_acct bc-adminsdk-svcacct.json
```

#### 3. Set up frontend

In a seperate terminal, go to the frontend folder
```
cd breakfastbookclub/frontend
```
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
./run-dev-server --mysql_addr 34.145.15.228 --svc_acct bc-adminsdk-svcacct.json
```

In a seperate terminal, run frontend
```
cd breakfastbookclub/frontend
npm start
```

The backend must be running before the frontend.

### How to use the software

Once the backend and frontend are up and running, from http://localhost:3000/, log in with either account: 

<blockquote>
Email: akha1229@gmail.com

Password: 123456
</blockquote>

<blockquote>
Email: duvictor514@gmail.com

Password: F0xg0fl00f
</blockquote>

#### Functionalities complete: 

- Log in using one of the logins provided 
- Log out by clicking the profile icon in the upper right corner
- Make post about a book by clicking "Write a post" from the home page, current user's profile page or book club profile page
- View all posts from home page
- Search for book clubs to join from the search input in the app bar (Every book is it's own book club)
- View posts made by user in user's profile


#### Functionalities in progress (Currently hard coded with temporary data): 

Sign up page:
- Creating an account

From Home page:
- View trending readers

From Book club profile page:
- View posts made in a specific book club
- Join a book club by clicking "Join the club"
- Recommend book to a friend by clicking "Recommend"
- Save a book by clicking "Save"

From User profile page:
- Add friend by clicking "Add friend" 
- View friends of user by clicking "### Friends"
- View book clubs that the user has joined
- View books that the user has saved


### How to report a bug
Go to the issues tab within the breakfast book club repository. Click “New issue” and “Get started” on the bug report. Fill out the bug report template. Click “Submit new issue". As of right now, we have no known bugs.





## Developer Documentation
### [How to obtain the source code and How to build the software](#How-to-install-the-software)

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

Currently no version number needs to be updated in the backend.

Build a release of the software
```
 ./gradlew shadowJar
```
The release JAR file can be found in backend/BCAPIServer/build/libs
 


