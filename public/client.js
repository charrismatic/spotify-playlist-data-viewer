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
        type: 'horizontalBar',
        backgroundColor: '#000000',
         data: {        
          labels: labels,
          datasets: [{

            data: values,
            backgroundColor: [
              'rgba(30,215,96, 0.6)',
              'rgba(245,115,160, 0.6)',
              'rgba(80,155,245, 0.6)',
              'rgba(255,100,55, 0.6)',
              'rgba(180,155,200, 0.6)',
              'rgba(250,230,45, 0.6)',
              'rgba(27, 249, 219, 0.6)',
              'rgba(175,40,150, 0.6)',
              'rgba(30,50,100, 0.6)',
            ],
            borderColor: [
              'rgba(30,215,96, 0)',
              'rgba(245,115,160, 0)',
              'rgba(80,155,245, 0)',
              'rgba(255,100,55, 0)',
              'rgba(180,155,200, 10',
              'rgba(250,230,45, 0)',
              'rgba(0,100,80, 0)',
              'rgba(175,40,150, 0)',
              'rgba(30,50,100, 0)'
            ],
            borderWidth: 1
          }]
        },
        chart: {
           backgroundColor: '#000000',
        },
         options: { 
          scaleLabel: {
            display: true,
          },
          legend: { display: false },
          scales: {
            yAxes: [{
              padding: .5,
              label: {
              padding: .5,
              lineHeight: .5,
                display: true,
              },
              gridLines: {
                display: false ,
                color: "#FFFFFF"
              },
              ticks: {
                lineHeight: .5,
                fontColor:'#ffffff',
              }
            }],
            xAxes: [{
              label: [{
                fontStyle: 'normal',
                fontColor:'#ffffff',
              }],
              gridLines: {
                 color: "#FFFFFF"
              },
              ticks: {
                fontStyle: 'normal',
                fontColor:'#ffffff',
                beginAtZero:true,
                max: 1
              }
            }]
          }
        }
      });
  });
}





  $.get('/category-playlists', function(data) {
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
  
  function getAnalysisHtml(track) {
    <section class="analysis">
      <ul id="results"></ul>
      <div id="analysis-chart-container">
        <canvas id="analysis-chart"></canvas>
      </div>
    </section>
  }


  function getFeaturesHtml(track) {
   var output = `
   <section class="features">
    <div class="track-details">
      <dl>
        <dt>track:</dt>
        <dd>${track.name}</dd>
        <dt>artists:</dt>
        <dd>${track.artists}<dd/>
        <dt>popularity:<dt>
        <dd>${track.popularity}<dd/>
      </dl>
    </div>
    <ul id="results"></ul>
    <p id="features"></p>
    <div id="charts-container">
      <canvas id="ft-${track.id}" class="features-chart" width="400" height="150"></canvas>
      <canvas id="an-${track.id}" class="analysis-chart" width="400" height="150"></canvas>
    </div>
    </section>`;

  }

  $.get('/playlists-tracks', function(data) {
    var playlist_id = '4VDQkvZhZbpuXKLiS99yk7'
    var options = {};
    var callback = {};
    
    data.items.map(function(item, i) {
      var track = flattenTrack(item.track);
      var content = getFeaturesHtml(track);       
      var row = $(`<div class="playlist-track">\n${content}\n</div>`);
      row.appendTo('#playlists-tracks-container');
      getFeatures(track.id);    
    });
  });
  
  


  $.get('/analysis', function(data) {
    var keys = ["danceability", "energy", "acousticness", "tempo", "instrumentalness"]
    keys.map(function(key, i) {
      if (data.hasOwnProperty(key)) {
        var feature = $('<p style="#ffffff"><span class="big-number">' + data[key] + ' </span>'  + key + '</p>');
        feature.appendTo('#audio-features-container');
      }
    });
  });
    
  $.get('/features', function(data) {
    var keys = ["danceability", "energy", "acousticness", "tempo", "instrumentalness"]
    keys.map(function(key, i) {
      if (data.hasOwnProperty(key)) {
        var feature = $('<p style="#ffffff"><span class="big-number">' + data[key] + ' </span>'  + key + '</p>');
        feature.appendTo('#audio-features-container');
      }
    });
  });
  
  $.get('/artist', function(data) {
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
