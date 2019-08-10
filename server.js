// init project
var qs = require('querystring');
var express = require('express');
var app = express();

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

//-------------------------------------------------------------//
//----------------------- AUTHORIZATION -----------------------//
//-------------------------------------------------------------//


const jssdkscopes = [
  // "streaming",
  // "user-read-birthdate", 
  // "user-read-email", 
  // "user-read-private", 
  // "user-modify-playback-state"
];

const redirectUriParameters = {
  client_id: process.env.CLIENT_ID,
  response_type: 'token',
  scope: jssdkscopes.join(' '),
  redirect_uri: encodeURI('https://spotify-playlist-data-viewer.glitch.me/'),
  show_dialog: true,
};

const redirectUri = `https://accounts.spotify.com/authorize?${qs.stringify(redirectUriParameters)}`;

var SpotifyWebApi = require('spotify-web-api-node');

// The object we'll use to interact with the API
var spotifyApi = new SpotifyWebApi({
  clientId : process.env.CLIENT_ID,
  clientSecret : process.env.CLIENT_SECRET
});

// Using the Client Credentials auth flow, authenticate our app
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err.message);
  });




function authenticate(callback) {
  spotifyApi.clientCredentialsGrant()
    .then(function(data) {
      console.log('The access token expires in ' + data.body['expires_in']);
      console.log('The access token is ' + data.body['access_token']);
    
      callback instanceof Function && callback();

      // Save the access token so that it's used in future calls
      spotifyApi.setAccessToken(data.body['access_token']);
    }, function(err) {
      console.log('Something went wrong when retrieving an access token', err.message);
    });
}


const reAuthenticateOnFailure = (action) => {
  action(() => {
    authenticate(action);
  })
}



//-------------------------------------------------------------//
//------------------------- API CALLS -------------------------//
//-------------------------------------------------------------//


app.get('/search-track', function (request, response) {
  
  // Search for a track!
  spotifyApi.searchTracks('track:Mr. Brightside', {limit: 1})
    .then(function(data) {
    
      // Send the first (only) track object
      response.send(data.body.tracks.items[0]);
    
    }, function(err) {
      console.error(err);
    });
});


app.get('/playlists-tracks', function (request, response) {
  var playlist_user = 'mjharris2407';
  var playlist_id = '4VDQkvZhZbpuXKLiS99yk7';

  spotifyApi.getPlaylistTracks(playlist_user, playlist_id, {offset: 1,limit: 5,fields: 'items'})
  .then(function(data) {
    response.send(data.body);
  }, function(err) {
   console.error(err);
  });                 

});

app.get('/category-playlists', function (request, response) {
  
  // Get playlists from a browse category
  // Find out which categories are available here: https://beta.developer.spotify.com/console/get-browse-categories/
  spotifyApi.getPlaylistsForCategory('holidays', { limit : 10, country: 'SE' })
    .then(function(data) {
    
    // Send the list of playlists
    response.send(data.body.playlists);
    
  }, function(err) {
    console.error(err);
  });
});

app.get('/audio-features', function (request, response) {
  spotifyApi.getAudioFeaturesForTrack('7oK9VyNzrYvRFo7nQEYkWN')
    .then(function(data) {
    
      // Send the audio features object
      response.send(data.body);
    
    }, function(err) {
      console.error(err);
    });
});

app.get('/artist', function (request, response) {
  spotifyApi.getArtist('7oPftvlwr6VrsViSDV7fJY')
    .then(function(data) {
    
      // Send the list of tracks
      response.send(data.body);
    
    }, function(err) {
      console.error(err);
    });
});

app.get('/artist-top-tracks', function (request, response) {
  spotifyApi.getArtistTopTracks('0uq5PttqEjj3IH1bzwcrXF', 'US')
    .then(function(data) {
    
      // Send the list of tracks
      response.send(data.body.tracks);
    
    }, function(err) {
      console.error(err);
    });
});

app.get('/user', function (request, response) {
  
  spotifyApi.getUser('arirawr')
    .then(function(data) {
    
      // Send the user object
      response.send(data.body);
    
    }, function(err) {
      console.error(err);
    });
});



app.get("/features", function (request, response) {
  spotifyApi.getAudioFeaturesForTrack(request.query.id)
  .then(function(data) {
    console.log(data.body);
    response.send(data.body);
  }, function(err) {
    console.log(err)
  });
});

app.get("/analysis", function (request, response) {
  reAuthenticateOnFailure((failure) => {
    spotifyApi.getAudioAnalysisForTrack(request.query.id)
    .then(function(data) {
      response.send(data.body);
    }, failure);
  });
});



//-------------------------------------------------------------//
//------------------------ WEB SERVER -------------------------//
//-------------------------------------------------------------//


// Listen for requests to our app
// We make these requests from client.js
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
