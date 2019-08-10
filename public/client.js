// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery,
// add other scripts at the bottom of index.html

$(function() {
    
  $.get('/search-track', function(data) {
    // "Data" is the object we get from the API. See server.js for the function that returns it.
    console.group('%cResponse from /search-track', 'color: #F037A5; font-size: large');
    console.log(data);
    console.groupEnd();
    
    // Display the track name
    var trackName = $('<a href="' + data.external_urls.spotify + '" style="color:white;text-decoration:underline;"><h3>' + data.name + '</h3></a>');
    trackName.appendTo('#search-track-container');
    
    // Display the artist name
    var artistName = $('<h3>by ' + data.artists[0].name + '</h3>');
    artistName.appendTo('#search-track-container');
    
    // Display the album art
    var img = $('<img/>');
    img.attr('src', data.album.images[0].url);
    img.appendTo('#search-track-container');
  });
  
  $.get('/category-playlists', function(data) {
    // "Data" is the object we get from the API. See server.js for the function that returns it.
    console.group('%cResponse from /category-playlists', 'color: #F037A5; font-size: large');
    console.log(data);
    console.groupEnd();
    
    // Display the covers of the playlists
    data.items.map(function(playlist, i) {
      var img = $('<img class="cover-image"/>');
      img.attr('src', playlist.images[0].url);
      img.appendTo('#category-playlists-container');
    });
  });
  
  
  $.get('/playlists-tracks', function(data) {
    // "Data" is the object we get from the API. See server.js for the function that returns it.
    console.group('%cResponse from /playlists-tracks', 'color: #F037A5; font-size: large');
    console.log(data);
    console.groupEnd();
    
    var playlist_id = '4VDQkvZhZbpuXKLiS99yk7'
    var options = {};
    var callback = {};
    
    // Display the tracks of the playlists
    data.items.map(function(item, i) {
      var track = JSON.stringify(item.track);
      var row_inner = `<div class="track-details"><p>${track}</p></div>`;
      
      var row_content = `track: ${track.name}`;
      var row_content = row_content + `artists: ${track.artists}`;
      var row_content = row_content + `popularity: ${track.popularity}`;
      
      var row_inner = row_inner + `<canvas id="${track.id}" class="features-chart" width="400" height="200"></canvas>`;
      
      
      var row = $('<div class="playlist-track" style="display:flex;">' + row_inner + '</div>');
      row.appendTo('#playlists-tracks-container');
      var track_features = getFeatures(track);
    });
  });
  
  
  
  $.get('/features', function(data) {
    // "Data" is the object we get from the API. See server.js for the function that returns it.
    console.group('%cResponse from /audio-features', 'color: #F037A5; font-size: large');
    console.log(data);
    console.groupEnd();
    
    // The audio features we want to show
    var keys = ["danceability", "energy", "acousticness", "tempo", "instrumentalness"]
    
    // Display the audio features
    keys.map(function(key, i) {
      if (data.hasOwnProperty(key)) {
        var feature = $('<p><span class="big-number">' + data[key] + ' </span>'  + key + '</p>');
        feature.appendTo('#audio-features-container');
      }
    });
  });
  
  $.get('/artist', function(data) {
    // "Data" is the object we get from the API. See server.js for the function that returns it.
    console.group('%cResponse from /artist', 'color: #F037A5; font-size: large');
    console.log(data);
    console.groupEnd();
    
    // Display the artist's image
    var img = $('<img class="circle-image" />');
    img.attr('src', data.images[0].url);
    img.appendTo('#artist-container');
    
    // Display the artist name
    var trackName = $('<h3>' + data.name + '</h3>');
    trackName.appendTo('#artist-container');
    
    // Display the artist's popularity
    var trackName = $('<h3>Popularity: ' + data.popularity + '</h3>');
    trackName.appendTo('#artist-container');
    
    // Display the artist's follower count
    var trackName = $('<h3>Followers: ' + data.followers.total + '</h3>');
    trackName.appendTo('#artist-container');
    
    // Display the artist's genres
    data.genres.map(function(genre, i) {
      var genreItem = $('<p>' + genre + '</p>');
      genreItem.appendTo('#artist-container');
    });
  });
  
  $.get('/artist-top-tracks', function(data) {
    // "Data" is the object we get from the API. See server.js for the function that returns it.
    console.group('%cResponse from /artist-top-tracks', 'color: #F037A5; font-size: large');
    console.log(data);
    console.groupEnd();
    
    // Display the audio features
    data.map(function(track, i) {
      var trackName = $('<li>' + track.name + '</li>');
      trackName.appendTo('#top-tracks-container');
    });
  });
  
  $.get('/user', function(data) {
    // "Data" is the object we get from the API. See server.js for the function that returns it.
    console.group('%cResponse from /user', 'color: #F037A5; font-size: large');
    console.log(data);
    console.groupEnd();
    
    // Display the user's image
    var img = $('<div class="circle-image"></div>');
    img.attr('style', 'background:url(' + data.images[0].url + ') center/cover;height:300px;width:300px;');
    img.appendTo('#user-container');
    
    // Display the user id
    var trackName = $('<a href="' + data.external_urls.spotify + '" style="color:white;text-decoration:underline;"><h3>' + data.id + '</h3></a>');
    trackName.appendTo('#user-container');
    
    // Display the user's follower count
    var trackName = $('<h3>Followers: ' + data.followers.total + '</h3>');
    trackName.appendTo('#user-container');
  });

});
