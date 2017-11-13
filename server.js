// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});


//-------------------------------------------------------------//


// init Spotify API wrapper
var SpotifyWebApi = require('spotify-web-api-node');

// The API object we'll use to interact with the API
var spotifyApi = new SpotifyWebApi({
  clientId : process.env.CLIENT_ID,
  clientSecret : process.env.CLIENT_SECRET
});

// Using the Client Credentials auth flow, authenticate our app
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
  
    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);
  
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err.message);
  });

app.get('/myendpoint', function (request, response) {
  
  // Search for a track!
  spotifyApi.searchTracks('track:Dancing Queen', {limit: 1})
    .then(function(data) {
    
      // Send the first (only) track object
      response.send(data.body.tracks.items[0]);
    
    }, function(err) {
      console.error(err);
    });
});

app.get('/category-playlists', function (request, response) {
  
  // Get playlists from a browse category
  // Find out which categories are available here: https://beta.developer.spotify.com/console/get-browse-categories/
  spotifyApi.getPlaylistsForCategory('jazz', { limit : 5 })
    .then(function(data) {
    
    // Send the playlists
    response.send(data.body.playlists);
    
  }, function(err) {
    console.error(err);
  });
});

app.get('/audio-features', function (request, response) {
  spotifyApi.getAudioFeaturesForTrack('3Qm86XLflmIXVm1wcwkgDK')
    .then(function(data) {
    
      response.send(data.body);
    
    }, function(err) {
      console.error(err);
    });
});


//-------------------------------------------------------------//


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
