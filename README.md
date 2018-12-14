# liri-node-app

![Liri Gif](liriapp.gif)

### About This App
This app was an assignment during my bootcamp. Using Node.js in the terminal, you start with a prompt (using Inquirer from npm) to choose what you would like to do. Asking to find concerts will allow you to search for upcoming concerts for a specified band/artist. This data pulls from the Bandsintown API using Axios. Finding a song uses Axios to pull data from the Spotify API to give information on songs with that same title. Searching for a movie uses Axios to pull data from the OMDb API to return information on that movie. The data returned is then logged in the same format to a txt file. Choosing the last option, find what I want, will run a function to read a txt file, recognize what is in the file, and return the correct data for either concerts, songs, or a movie.

### Technologies Used
* JavaScript
* Node.js
* npm (Inquirer, Moment, Axios)
* APIs