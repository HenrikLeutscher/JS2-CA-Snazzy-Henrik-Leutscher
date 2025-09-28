# JS2-CA-Snazzy-Henrik-Leutscher
 
![Project Teaser (Image will be added)]()

## Content

- [Description](#description)
- [Built With](#built-with)
- [My Coding Choices](#my-coding-choices)
- [Future Plans](#future-plans)
- [Installing](#installing)
- [Running](#running)
- [Config (After running the app)](#config)
- [Contact](#contact)
## Description

- Front-End Client for a Social Media Application with my own name: Snazzy
- Login as a user
- Register to become a user
- View all posts posted
- View a single post with its details
- Create a post
- Edit your own posts
- Delete your own posts
- View the profile of other users and their posts
- Follow and Unfollow other users
- Search by post name / body
- See your own profile, and edit it

## Built With

- HTML, CSS, Bootstrap, JavaScript
- Noroff API (V2)
- Live Host (Netlify)

## My Coding Choices
- I have used ES6 Modules to keep code modular and reusable
   - I have split functions into different js files to organize them and have the tracking for future development easier.
- I have used async / await for every API request, to ensure better readability and error handling
- I have used chaining when accessing properties to avoid errors when running.
- I have used try/catch blocks to handle API errors gracefully and display messages to users.

## Future Plans:
- Overall styling with bootstrap
- Post Plans:
  - Likes on each post (With count)
  - Comments on each post (with count)
  - Reply to comments on each post

## Getting Started:

## Installing

1. Clone the repo:

```bash
git clone git@github.com:HenrikLeutscher/JS2-CA-Snazzy-Henrik-Leutscher
```

2. Navigate to the project folder:

```bash
cd JS2-CA-Snazzy-Henrik-Leutscher
```

3. Install the dependencies:

```
npm install
```

### Running

To run the app, run the following commands:

```bash
npm run start
```

Open the app in your browser:
```bash
http://localhost:3000
```

## Config

1. Register a user.
Go to "Register" page and fill out required information

2. Get your API Key.
Go to this link: https://docs.noroff.dev/docs/v2/auth/api-key

Scroll down until you see "API Key Tool".
Login using the credentials you just registered a user with

Copy the API Key provided under: "Your API Key:"

3. Change API_KEY.
Go into the project folder

Navigate to:
JS (Folder) --> config.js

Change the API_KEY "string" to your API Key

4. Login and have fun exploring the project!

## Contact

[My LinkedIn page](https://www.linkedin.com/in/henrik-leutscher/)
