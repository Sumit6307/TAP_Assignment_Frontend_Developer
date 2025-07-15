Nearby Explorer
A React-based web application that helps users discover nearby points of interest (POIs) using the real Overpass API. The app leverages modern Web APIs to provide an interactive and responsive experience, displaying POIs on a canvas map with lazy-loaded details.
Features

Interactive Map: Visualizes the user's location and nearby POIs using the Canvas API.
User Location: Retrieves the user's current location with the Geolocation API.
Lazy-Loading: Loads POI details efficiently using the Intersection Observer API.
Real Data: Fetches POIs from the Overpass API, including amenities, shops, and tourism nodes within a 5km radius.
Responsive Design: Built with Tailwind CSS for a modern, mobile-friendly UI.

Tech Stack

React: Frontend framework for building the UI.
Tailwind CSS: Utility-first CSS framework for styling.
Overpass API: Provides real-world POI data from OpenStreetMap.
Web APIs: Geolocation, Canvas, and Intersection Observer for dynamic functionality.

Prerequisites

Node.js (v16 or higher)
npm (v8 or higher)
Git
A modern browser (e.g., Chrome) with location services enabled

Installation

Clone the repository:git clone https://github.com/Sumit6307/TAP_Assignment_Frontend_Developer
cd nearby-finder


Install dependencies:npm install


Start the development server:npm start

The app will run at http://localhost:5173.

Deployment to Cloudflare Pages

Push to GitHub:
Initialize a Git repository:git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/Sumit6307/TAP_Assignment_Frontend_Developer
git push -u origin main




Deploy on Cloudflare Pages:
Log in to Cloudflare (https://dash.cloudflare.com).
Go to Pages > Create a project > Connect to Git.
Select your repository.
Configure build settings:
Project name: nearby-finder
Production branch: main
Build command: npm run build
Build output directory: build

Deployment Link : https://tap-assignment-frontend-developer.pages.dev/

Click Save and Deploy.
Access the app at the provided URL (e.g., nearby-finder.pages.dev).



Usage

Allow location access when prompted to fetch your current coordinates.
The app displays a map with your location (blue marker) and nearby POIs (color-coded markers: red for cafes, green for parks, purple for others).
Click a POI marker to highlight its details.
Scroll through the "Nearby Places" list to view POIs, with details lazy-loaded when cards enter the viewport.

Debugging
If you see "No places found nearby":

Open browser developer tools (F12) and check console logs:
Geolocation API success: { latitude, longitude }
Overpass API response: {...}
Fetched POIs: [...]
