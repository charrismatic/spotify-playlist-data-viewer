// client-side js
// run by the browser each time your view template is loaded
function getFeatures(id) {
  let query = '/features?id=' + id;

  $.get(query, function(data) {
    let labels = [];
    let values = [];
    
    for (var feature in data) {
      if (data.hasOwnProperty(feature) && feature !== 'key' && feature !== 'mode') {
        if(data[feature] <= 1 && data[feature] >= 0) {
          labels.push(feature);
          values.push(data[feature]);
        }
      }
    }
  
    var ctx = $('#'+id+'.features-chart');
    
       var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            data: values,
            backgroundColor: [
              'rgba(30,215,96, 0.2)',
              'rgba(245,115,160, 0.2)',
              'rgba(80,155,245, 0.2)',
              'rgba(255,100,55, 0.2)',
              'rgba(180,155,200, 0.2)',
              'rgba(250,230,45, 0.2)',
              'rgba(0,100,80, 0.2)',
              'rgba(175,40,150, 0.2)',
              'rgba(30,50,100, 0.2)'
            ],
            borderColor: [
              'rgba(30,215,96, 1)',
              'rgba(245,115,160, 1)',
              'rgba(80,155,245, 1)',
              'rgba(255,100,55, 1)',
              'rgba(180,155,200, 1)',
              'rgba(250,230,45, 1)',
              'rgba(0,100,80, 1)',
              'rgba(175,40,150, 1)',
              'rgba(30,50,100, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: { 
          scaleLabel: {
            display: true,
          },
          legend: {
            display: false
          },
          scales: {
            yAxes: [{
              label: {
                display: true,
                color: 'yellow',
              },
              gridLines: {
                display: false ,
                color: "#FFFFFF"
              },
              ticks: {
                beginAtZero:true,
                max: 1
              }
            }],
            xAxes: [{
              gridLines: {
                color: "#FFFFFF"
              }
            }]
          }
        }
      });


  });
}

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
  
  function flattenArtists(artists){
    var result = [];
    artists.forEach(function (artist) {
      result.push(artist.name);
    });
    return result.join(', ');
  }

  function flattenTrack(track) {
    return {
      album :       track.album.name,
      name:         track.name,
      artists:      flattenArtists(track.artists),
      popularity:   track.popularity,
      id:           track.id,
      preview_url:  track.preview_url,
      href:         track.href,
      explicit :    track.explicit,
      duration_ms:  track.duration_ms,
      uri:          track.uri,
    };
  }
  
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
      var track = flattenTrack(item.track);
      var row_content = `track: ${track.name} <br/>`;
      var row_content = row_content + `artists: ${track.artists}<br/>`;
      var row_content = row_content + `popularity: ${track.popularity}<br/>`;

      var row_inner = `<div class="track-details"><p>${row_content}</p></div>`;      
      
      var row_inner = row_inner + `<section class="features"><ul id="results"></ul><p id="features"></p>`;
      var row_inner = row_inner + `<canvas id="${track.id}" class="features-chart" width="400" height="200"></canvas>`;
      var row_inner = row_inner + '</section>';
     
      var row = $('<div class="playlist-track">' + row_inner + '</div>');
      row.appendTo('#playlists-tracks-container');
      getFeatures(track.id);    
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
