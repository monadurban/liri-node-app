//naming variables 
var action = process.argv[2];
var value = process.argv[3];
var Twitter = require('twitter');
var keys = require('./keys.js');
var Spotify = require('node-spotify-api');
var client = new Twitter(keys.twitterKeys);
var clientSpotify = new Spotify(keys.spotifyClient);

var params = {
    screen_name: 'mDurBee',
    count: 20
    }
var request = require('request');

//adding song title variables for Spotify
var songTokens = process.argv.slice(2);
var song = songTokens.join('+');

//adding movie title variables for OMDB
var titleTokens = process.argv.slice(2);
var title = titleTokens.join('+');

var fs = require('fs');

switch (action) {
    case 'my-tweets':
        myTweets();
        break;
    case 'spotify-this-song':
        spotifyThis(value);
        break;
    case 'movie-this':
        movieThis(value);
        break;
    case 'do-what-it-says':
        random();
        break;
}

// my-tweets function
function myTweets() {
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error && response.statusCode == 200) {
            fs.appendFile('terminal.log', ('=============== LOG ENTRY BEGIN ===============\r\n' + Date() + '\r\n \r\nTERMINAL COMMANDS:\r\n$: ' + process.argv + '\r\n \r\nDATA OUTPUT:\r\n'), function(err) {
                if (err) throw err;
            });
            console.log(' ');
            for (i = 0; i < tweets.length; i++) {
                var number = i + 1;
                console.log(' ');
                console.log([i + 1] + '. ' + tweets[i].text);
                console.log('Created on: ' + tweets[i].created_at);
                console.log(' ');
                fs.appendFile('terminal.log', (number + '. Tweet: ' + tweets[i].text + '\r\nCreated at: ' + tweets[i].created_at + ' \r\n'), function(err) {
                    if (err) throw err;
                });
            }
            fs.appendFile('terminal.log', ('=============== LOG ENTRY END ===============\r\n \r\n'), function(err) {
                if (err) throw err;
            });
        }
    });
} // end myTweets function

// spotifyThis function
function spotifyThis(song) {
    if (song == null) {
        song = 'the sign';
    }
    clientSpotify.search({type: 'track', query: song}, function(err,data){
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        console.log('Artist: ' + data.tracks.items[0].artists[0].name);
        console.log('Song: ' + data.tracks.items[0].name); 
        console.log('Preview Link: ' + data.tracks.items[0].preview_url);
        console.log('Album Name: ' + data.tracks.items[0].album.name);
        console.log('Reference: ' + data.tracks.items[0].href);
  
      });
} // end spotifyThis function

// movieThis function
function movieThis(title) {
    if (title == null) {
        title = 'mr nobody';
    }
    request(`http://www.omdbapi.com/?t=${title}&plot=short&r=json&apikey=40e9cece`, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                jsonBody = JSON.parse(body);
                console.log('Title: ' + jsonBody.Title);
                console.log('Year: ' + jsonBody.Year);
                console.log('IMDb Rating: ' + jsonBody.imdbRating);
                console.log('Rotten Tomatoes Rating: ' + jsonBody.tomatoRating);
                console.log('Country: ' + jsonBody.Country);
                console.log('Language: ' + jsonBody.Language);
                console.log('Plot: ' + jsonBody.Plot);
                console.log('Actors: ' + jsonBody.Actors);
                console.log(' ');
                fs.appendFile('log.txt', ('=============== LOG ENTRY BEGIN ===============\r\n' + Date() + '\r\n \r\nTERMINAL COMMANDS: ' + process.argv + '\r\nDATA OUTPUT:\r\n' + 'Title: ' + jsonBody.Title + '\r\nYear: ' + jsonBody.Year + '\r\nIMDb Rating: ' + jsonBody.imdbRating + '\r\nCountry: ' + jsonBody.Country + '\r\nLanguage: ' + jsonBody.Language + '\r\nPlot: ' + jsonBody.Plot + '\r\nActors: ' + jsonBody.Actors + '\r\nRotten Tomatoes Rating: ' + jsonBody.tomatoRating + '\r\n =============== LOG ENTRY END ===============\r\n \r\n'), function(err) {
                    if (err) throw err;
            });
        }
    });
} //end movieThis function

// random function
function random() {
    fs.readFile('random.txt', 'utf8', function(error, data) {
        if (error) {
            console.log(error);
        } else {
            var dataArr = data.split(',');
            if (dataArr[0] === 'spotify-this-song') {
                spotifyThis(dataArr[1]);
            }
            if (dataArr[0] === 'movie-this') {
                movieThis(dataArr[1]);
            } 
        }
    });
} // end doWhatItSays function