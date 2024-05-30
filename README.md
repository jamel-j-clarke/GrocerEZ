# GrocerEZ
# Group I: Final Project

## Contributions:
#### Erin - etgrouge
- Proposal: The idea, problem, target users, and its potential solution.
- Milestone1: Backend routes, Landing page frontend js for sign up and login, Helped with other js and html changes.
- Milestone2: Re-implementing the backend routes with database functionality. Restructuring endpoints and debugging database connection.
- Final Project: Debugging backend sql queries and adding necessary paths. Debugging frontend functionality.
#### Bennett - bcflemin
- Proposal: The feature descriptions.
- Milestone1: Helped create Mock Data, Javascript for populating items, recipes, and lists pages with respective mock data, Javascript for View Details button on recipes page, Helped with fronted functionality for adding a new item.
- Milestone2: Frontend JS, debugging backend.
- Final Project: Frontend JS, debugging related backend.
#### Jamel - jjclark4
- Proposal: The wireframes.
- Milestone1: HTML and CSS, Popup javascript.
- Milestone2: HTML+CSS, Frontend JS, minor backend tweaks.
- Final Project: Same as previous milestones, Offline Functionality, and PWA Installability.

## Features
### What is working:
- All HTML and CSS for all pages
- All CRUD operations for items, lists, and recipes
- API routes set up for SQL queries to database
- Authentication on login using JWT, and logout
- Creation of a new user account

### What is not complete:
- Logging out when offline

## Design Changes
- Modification of user account info
- Sharing with other users

## Authentication and Authorization
Our authentication is set up to verify a user using JSON Web Tokens. We created a TokenMiddleware that has functionality for generating a secure token for the user, removing the token, and verifying the user's token on API calls. The token is stored in the user's cookies, that is sent with every request to the API.
- [TokenMiddleware](https://github.ncsu.edu/engr-csc342/csc342-2023Fall-GroupI/blob/main/Milestone2/api/src/routes/middleware/TokenMiddleware.js)
- Log in with user@gmail.com and 'password'

## Page Purposes and Offline Functionality:
### [Landing](https://github.ncsu.edu/engr-csc342/csc342-2023Fall-GroupI/blob/main/FinalProject/frontend/src/frontend/templates/landing.html) 
- Purpose: The landing page provides customer reviews and highlights some of the key features of our application. These are mainly filler information to enhance the page while it's intended purpose is a page for the user to log in or sign up.
- Offline Functionality: The page can be only be viewed.
### [Current List](https://github.ncsu.edu/engr-csc342/csc342-2023Fall-GroupI/blob/main/FinalProject/frontend/src/frontend/templates/currentList.html)
- Purpose: The current list page provides the list of items that the user desires to buy at the grocery store next time they go. On this page, they can check off the items as they shop and clear them from the list once they are purchased. If they wish to save their current list for future user, there is also the ability to save it for later. 
- Offline Functionality: You can view the cached content and navigate to other pages via the menu bar.
### [Recipes](https://github.ncsu.edu/engr-csc342/csc342-2023Fall-GroupI/blob/main/FinalProject/frontend/src/frontend/templates/recipes.html)
- Purpose: The recipes page is filtered by recipe categories so depending on which drop down subcategory the user selects, those recipes will populate the page. The recipe functionality allows user to save their favorite recipes with the necessary ingredients so that when they want to make that recipe, they can add the recipe to their current list and they can buy all of the ingredients at the store. The recipes are separated by category for organizational purposes and for the convenience of the user.  
- Offline Functionality: You can view the cached content and navigate to other pages via the menu bar.
### [Items](https://github.ncsu.edu/engr-csc342/csc342-2023Fall-GroupI/blob/main/FinalProject/frontend/src/frontend/templates/items.html)
- Purpose: The items page stores all of the items that can be added to a list or recipe. This means that the user must first create the item on this page before being able to add it to a list or recipe. This makes sure each application is customer to each user and allows them to set a default quantity for their items based on their shopping habits. From this page, items can be created, edited, or deleted, and added to the current list, a saved list, or a recipe. 
- Offline Functionality: You can view the cached content and navigate to other pages via the menu bar.
### [Lists](https://github.ncsu.edu/engr-csc342/csc342-2023Fall-GroupI/blob/main/FinalProject/frontend/src/frontend/templates/lists.html)
- Purpose: The lists page displays all saved lists for a user. They can view the details of the list and perform modifications via this page as well. They can also select a list and add it to their current list so that they don't always have to start their grocery list with no items. The user can also create a new list or modify and existing list on this page. 
- Offline Functionality: You can view the cached content and navigate to other pages via the menu bar.
### [Offline](https://github.ncsu.edu/engr-csc342/csc342-2023Fall-GroupI/blob/main/FinalProject/frontend/src/frontend/templates/offline.html)
- Purpose: To indicate to the user that they are currently offline and the operation that they are trying to perform can not be done while offline.
- Offline Functionality: You can view the cached content and navigate to other pages via the menu bar.
### [Error](https://github.ncsu.edu/engr-csc342/csc342-2023Fall-GroupI/blob/main/FinalProject/frontend/src/frontend/templates/error.html)
- Purpose: To indicate to the user that the URL they tried navigating to does not exist.
- Offline Functionality: You can view the cached content and navigate to other pages via the menu bar.

## Caching Strategies
For our caching strategy, we decided it would be best to fetch network-first and then cache-first. This works best for us because of the dynamic nature of the application: items, lists, and recipes can all be created, edited, and deleted. Therefore, it’s vital that the most updated version of the app’s state is fetched first.

## API Endpoints
A list of our API Endpoints and their descriptions can be found on our [API-Endpoints Wiki page](https://github.ncsu.edu/engr-csc342/csc342-2023Fall-GroupI/wiki/API-Endpoints)

## Entity Relationship Diagram
All items are stored in the items table and are mapped to their respective lists and recipes in the list_item and recipe_item tables. The users are also stored in the users table and are mapped to their items, lists, and recipes similarly in the user_item, user_list, and user_recipe tables respectively. Recipes store their name and category in the recipe table and lists store just their name in the list table. The Current list and Items list are implemented as lists in the list table and are identified by their specific names. Since items in recipes, lists, and the current list can have different quantities, these are stored as separate instances in the item table with unique ids mapped to their respective list or recipe and user. This will create "duplicate" items in the item table because they will have the same names and sometimes the same quantities, but this will allow the user to be able to set the quantities of the same items on different lists and recipes to be different amounts.
<br>
![ER Diagram](https://github.ncsu.edu/engr-csc342/csc342-2023Fall-GroupI/blob/main/Milestone2/database_table_relationships.png)
