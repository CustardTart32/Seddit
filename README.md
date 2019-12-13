## Instructions for Getting Started 
On your terminal, nagivate to the backend/ folder and enter the following commands:
* virtualenv -p /usr/local/bin/python3 env
* source env/bin/activate
* pip install -r requirements.txt
* python backend_server.py

After running these commands, navigate to the frontend/ folder and run the command given by backend_server.py
* Should be something like "python3 frontend_server.py http://127.0.0.1:5000"

Follow the instructions given by the previous command to view the forum page.

If these instructions do not work, there are static HTML and Webarchive pages for demo. (Safari or Chrome recommended) 

## Seddit - Introduction

JavaScript is used increasingly to provide a native-like application experience in the web. One
major avenue of this has been in the use of Single Page Applications or SPAs. SPAs
are generated, rendered, and updated using JavaScript. Because SPAs don't require a user
to navigate away from a page to do anything, they retain a degree of user and application state.

There are millions of websites that utilise SPAs in part of, or all of their web applications.

The assignment intends to teach students to build a simple SPA which can fetch dynamic data from a HTTP/S API.
Your task will be to provide an implemention of a SPA that can provide a number of key features.

Some of the skills/concepts this assignment aims to test (and build upon):

* Simple event handling (buttons)
* Advanced Mouse Events (Swipe)
* Fetching data from an API
* Infinite scroll
* CSS Animations
* Web Workers / Service Workers
* Push Notifications (Polling)
* Offline Support
* Routing (URL fragment based routing)

## API

The backend server will be where you'll be getting your data. Don't touch the code in the backend; although we've provided the source, 
it's meant to be a black box. Final testing will be done with our own backend so don't _assume_ any single piece of data will be there. Use the instructions provided in the backend/README.md
to get it started.

For the full docs on the API, start the backend server and navigate to the root (very likely to be `localhost:5000`, the exact url will be printed when you run the backend, see backend/README.md for more info). You'll see all the endpoints, descriptions and expected responses.

## A Working Product
Your application should be compatible with 'modern' Chrome, Safari, and Mozilla browsers.
We will assume your browser has JavaScript enabled, and supports ES6 syntax.
