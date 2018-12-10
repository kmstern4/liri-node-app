require("dotenv").config();
var keys = require("./keys");
var axios = require("axios");
var inquirer = require("inquirer");
var moment = require("moment");
var fs = require("fs");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var linebreak = "----------------------------------------------------"

function concerts() {
    inquirer
    .prompt([
        {
            type: "input",
            message: "What artist/band would you like to see?",
            name: "concert"
        }
    ]).then(function(answer) {
        var artist = answer.concert;
        if (answer.concert == "") {
            artist = "The Rolling Stones";
        }
        getConcerts(artist);
    })
};

function getConcerts(artist) {
    axios.get(`https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`)
    .then(function(response) {
        var data = response.data;
        console.log(`${linebreak}\nUpcoming concerts for ${artist}\n${linebreak}\n`)
        for (var i = 0; i < 5; i++) {
            var datetime = moment(data[i].datetime).format("MMM Do YYYY");
            console.log(`Venue: ${data[i].venue.name}\nLocation: ${data[i].venue.city}, ${data[i].venue.region} ${data[i].venue.country}\nDate: ${datetime}\n\n`)
        };
        liriAgain();
    })
};

function songs() {
    inquirer
    .prompt([
        {
            type: "input",
            message: "What song would you like to listen to?",
            name: "song"
        }
    ]).then(function(answer) {
        var song = answer.song;
        if (answer.song == "") {
            song = "The Sign + Ace of Base";
        };
        getSongs(song);
    })
};

function getSongs(song) {
    spotify.search({
        type: "track",
        query: song
    }, function(err, data) {
        if (err) {
            return console.log("Error Occurred: " + err);
        }
        var data = data.tracks.items
        console.log(`Song: ${song}`);
        console.log(`${linebreak}\nSong results for ${song}\n${linebreak}\n`)
        if (song == "The Sign + Ace of Base" || song == `"I Want it That Way"`) {
            console.log(`Artist/Band: ${data[0].artists[0].name}\nSong Title: ${data[0].name}\nAlbum: ${data[0].album.name}\nURL: ${data[0].preview_url}\n`);
        } else {
            for (var i = 0; i < 5; i++) {
                console.log(`Artist/Band: ${data[i].artists[0].name}\nSong Title: ${data[i].name}\nAlbum: ${data[i].album.name}\nURL: ${data[i].preview_url}\n`);
            };
        }
        liriAgain();
    })
};

function movies() {
    inquirer
    .prompt([
        {
            type: "input",
            message: "What movie would you like to find?",
            name: "movie"
        }
    ]).then(function(answer) {
        var movie = answer.movie;
        if (answer.movie == "") {
            movie = "Mr Nobody";
        };
        getMovies(movie);
    })
};

function getMovies(movie) {
    axios.get("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy")
    .then(function(response) {
        var data = response.data;
        console.log(`${linebreak}\nMovie information for ${movie}\n${linebreak}\n`);
        console.log(`Title: ${data.Title}\nYear Released: ${data.Year}\nIMDB Rating: ${data.imdbRating}\nRotten Tomatoes Rating: ${data.Ratings[1].Value}\nCountry: ${data.Country}\nLanguage(s): ${data.Language}\nPlot Summary: ${data.Plot}\nActors: ${data.Actors}\n`);
        liriAgain();
    })
};

function whatIWant() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }
        var search = data.split(",").slice(1);
        var term = data.split(",").slice(0, 1).toString();
        console.log(term);
        switch(term) {
            case "spotify-this-song":
                getSongs(search);
                break;
            case "concert-this":
                getConcerts(search);
                break;
            case "movie-this":
                getMovies(search);
                break;
            default:
                console.log("error reading file");
        }
    })
}

function startLiri() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                choices: ["Find Concerts", "Find a Song", "Find a Movie", "JUST FIND WHAT I WANT"],
                name: "whatdo"
            }
        ]).then(function(answers) {
            switch(answers.whatdo) {
                case "Find Concerts":
                    concerts();
                    break;
                case "Find a Song":
                    songs();
                    break;
                case "Find a Movie":
                    movies();
                    break;
                case "JUST FIND WHAT I WANT":
                    whatIWant();
                    break;
                default:
                    console.log("Please select one of the four options.");
            }
        })
};

function liriAgain() {
    inquirer.prompt([
        {
            type: "confirm",
            message: "Would you like to find something else?",
            default: true,
            name: "confirm"
        }
    ]).then(function(answer) {
        if (answer.confirm) {
            startLiri();
        } else {
            return false;
        }
    })
}

startLiri();