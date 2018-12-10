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
                    if (answer.concert == "") {
                        artist = "The Rolling Stones";
                    }
                    axios.get(`https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`)
                    .then(function(response) {
                        for (var i = 0; i < 5; i++) {
                            console.log(artist);
                            console.log(response.data[i].venue.name);
                            console.log(`${response.data[i].venue.city}, ${response.data[i].venue.region} ${response.data[i].venue.country}`);
                            console.log(moment(response.data[i].datetime).format("MMM Do YYYY"));
                        };
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
                    if (answer.song == "") {
                        song = "The Sign + Ace of Base";
                    };
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
                    if (answer.movie == "") {
                        movie = "Mr Nobody";
                    };
                    axios.get("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy")
                    .then(function(response) {
                        console.log(`Title: ${response.data.Title}`);
                        console.log(`Year Released: ${response.data.Year}`);
                        console.log(`IMDB Rating: ${response.data.imdbRating}`);
                        console.log(`Rotten Tomatoes Rating: ${response.data.Ratings[1].Value}`);
                        console.log(`Country: ${response.data.Country}`);
                        console.log(`Language(s): ${response.data.Language}`);
                        console.log(`Plot Summary: ${response.data.Plot}`);
                        console.log(`Actors: ${response.data.Actors}`);
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