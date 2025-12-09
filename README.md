# MovieHub
- Setup Instructions:
1. Download ZIP
2. Head to react-client directory
3. Run: npm install && npm run dev
4. Head to most parent directory
5. Run: npm install && node --watch server.js

- Deployed App URL: https://moviehub-7t2e.onrender.com

## Design Choices: Why you chose your frontend framework, backend structure, and database schema
I chose to work with Vite React as I am most comfortable with it, and have been using it personally in personal projects. I also like the use of components and the organisational structure. The backend framework is node.js with Express as well as the Google OAuth 2.0 strategy for authentication. This was the easiest implementation of authentication as we covered in during class, although turned out to provide some challenges when I implemented it. Lastly, the database schema I chose to implement actually omitted a ‘movies’ table. This was a decision I made while implementing my TMDB API as I realised it would take some important decision making on how/when to store movies in MY database (when a user adds it to a playlist, store a bunch of movies randomly, store as many as possible from TMDB?). In the end I chose to only store movies that are associated with a playlist in playlist_movies, and have each movie simply be handled by its ID using the TMDB API.
## Challenges: Technical or conceptual hurdles you faced and how you solved them
Some technical & conceptual hurdle I faced was having sessions persist between authentication and calling /auth/me to get the user information. I would get 404 unauthenticated. This was because at first I wanted to host my frontend on a different service than my backend, rather than redirecting all non-API requests to the react app’s index.html, which made handling CORS and sessions much easier.
## Learning Outcomes: What you learned about full-stack development and deployment
Planning is key, I did well to plan my wireframes and sketches, which allowed frontend development to go very quickly and smoothly. However, I did not plan for deployment causing some confusion when certain aspects of my setup did not apply in the Render environment.
## Future Work: Features you would add or refine with more time
Some features I would have added with more time, is searching for other users’ playlists, to see what other people are adding to their playlists (and maybe get some inspiration).


## MVP Video:
- https://www.loom.com/share/20e1ec2613a343d6a7720d7908fd9890
