# Breakfast Book Club Week 4 Status Report
## Team Report
- Last week’s goals: Get backend setup finished - make sure the API is all set where all necessary group members have access to everything they need to work with the API. Start adding established queries into the API and start replacing some of the fake data on the frontend with real stored data.

- Progress / Issues: We set up CI tests for the frontend and the backend API. We also implimented Firebase Authentication for user login and sign up. 

- Goals: Complete API routes for getting posts, and creating user profiles in the database. Film beta release presentation.

## Contributions of Individual Team Members
- Last week’s goals:
  
  Zaynab Khan:
    - Finish login functionality.
    - Try to integrate Google SSO

  Jocelyn Thomson:
    - Finish rest of queries
    - Work with backend server software and put already written queries into this to get queries working with real data

  Andrea Ha:
    - Design login/sign up user flow
    - Integrate at least one Breakfast Book club API (most likely create/get posts)

  Amanda Ha:
    - Create login/sign up page frontend
    - Integrate login/sign up API if complete

  Victor Du:
    - Get login functionality implemented in backend API in accordance with proposed API call.
    - Implement sample routes on backend API for getting book club data.
    - Add basic CI tests for backend code.

  Sanjana Janakiraman
    - Finish remaining SQL statements
    - Integrate SQL statements with backend for adding posts
    - Add testing for new backend functionalities

- Progress / Issues:

  Zaynab Khan:
  - Helped setup Firebase for authentication
  
  Amanda Ha:
  - Create login/sign up page frontend
  - Helped integrate login/sign up through Firebase into frontend
  - Set up basic CI tests for frontend pages

  Sanjana Janakiraman:
  - Setup Firebase and Firestore and integrated them with login/sign up frontend
  - Began backend logic for adding real book posts to home page

  Victor Du:
  - Got login/logout/account creation functionality implemented in backend API in accordance with proposed API call.
  - Setup GitHub actions CI pipeline to run JUnit tests for backend server code.

  Andrea Ha:
  - Designed login/sign up pages and user flow
  - Set up create post component to build data object for create post

- Goals:

  Zaynab Khan:
  - Write Java classes and SQL queries to implement other functionality
  - Connect Firestore to MySQL server with a common user id
  
  Amanda Ha:
  - Integrate user profile and post data from Breakfast book club API into frontend
  - Write tests for home page and user profile page

  Sanjana Janakiraman:
  - Add logout functionality
  - Fix login to change pages only when user has been authenticated
  - Finish backend logic to add real book posts to the home page

  Victor Du:
  - Implement routes on backend API for adding and getting book data.
  - Implement routes on backend API for getting book club posting data.

  Andrea Ha:
  - Write jest tests for book club page and search results page
  - Mock OpenLibrary API call for search results page
