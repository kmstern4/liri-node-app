require("dotenv").config();
var keys = require("./keys");
var axios = require("axios");
var inquirer = require("inquirer");
var moment = require("moment");
var fs = require("fs");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

inquirer
    .prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["Find Concerts", "Find a Song", "Find a Movie", "JUST FIND WHAT I WANT"],
            name: "whatdo"
        }
    ]).then(function(answers) {
        if (answers.whatdo == "Find Concerts") {
            inquirer
                .prompt([
                    {
                        type: "input",
                        message: "What artist/band would you like to see?",
                        name: "concert"
                    }
                ]).then(function(answer) {
                    var artist = answer.concert;
                    axios.get(`https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`)
                    .then(function(response) {
                        console.log(response.data[0].venue.name);
                        console.log(`${response.data[0].venue.city}, ${response.data[0].venue.region} ${response.data[0].venue.country}`);
                        console.log(response.data[0].datetime);
                    })
                })
        }
        if (answers.whatdo == "Find a Song") {
            inquirer
                .prompt([
                    {
                        type: "input",
                        message: "What song would you like to listen to?",
                        name: "song"
                    }
                ]).then(function(answer) {
                    var song = answer.song;
                    spotify.search({
                        type: "track",
                        query: song
                    }, function(err, data) {
                        if (err) {
                            return console.log("Error Occurred: " + err);
                        }
                        console.log(data.tracks.items[0].artists[0].name);
                        console.log(data.tracks.items[0].name);
                        console.log(data.tracks.items[0].preview_url);
                        console.log(data.tracks.items[0].album.name);
                    })
                })
        }
        if (answers.whatdo == "Find a Movie") {
            inquirer
                .prompt([
                    {
                        type: "input",
                        message: "What movie would you like to find?",
                        name: "movie"
                    }
                ]).then(function(answer) {
                    var movie = answer.movie;
                    axios.get("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy")
                    .then(function(response) {
                        console.log(response.data.Title);
                        console.log(response.data.Year);
                        console.log(response.data.imdbRating);
                        console.log(response.data.Ratings[1].Value);
                        console.log(response.data.Country);
                        console.log(response.data.Language);
                        console.log(response.data.Plot);
                        console.log(response.data.Actors);
                    })
                })
        }
        if (answers.whatdo == "JUST FIND WHAT I WANT") {
            fs.readFile("random.txt", "utf8", function(error, data) {
                if (error) {
                    return console.log(error);
                }
                var song = data.split(",").slice(1);
                spotify.search({
                    type: "track",
                    query: song
                }, function(err, data) {
                    if (err) {
                        return console.log("Error Occurred: " + err);
                    }
                    console.log(data.tracks.items[0].artists[0].name);
                    console.log(data.tracks.items[0].name);
                    console.log(data.tracks.items[0].preview_url);
                    console.log(data.tracks.items[0].album.name);
                })
            })
        }
    })