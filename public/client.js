
function drawFeatures(data) {
  
}


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
  
    var ctx = $('#ft-'+id+'.features-chart');
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


function drawAnalysis(data) {
  console.log('drawAnalysis');
  console.log(data);

  let deviceId = '';
  var img = new Image;
  
  const colors = [
    'rgba(30,215,96, 0.9)',
    'rgba(245,115,160, 0.9)',
    'rgba(80,155,245, 0.9)',
    'rgba(255,100,55, 0.9)',
    'rgba(180,155,200, 0.9)',
    'rgba(250,230,45, 0.9)',
    'rgba(0,100,80, 0.9)',
    'rgba(175,40,150, 0.9)',
    'rgba(30,50,100, 0.9)'
  ]
 data.
  const featuresChart = document.getElementById('features-chart');
  featuresChart.style.width = featuresChart.offsetWidth;
  featuresChart.width = featuresChart.offsetWidth * 2;
  featuresChart.style.height = featuresChart.offsetHeight;
  featuresChart.height = featuresChart.offsetHeight * 2;
 
  const width = featuresChart.width;
  const height = featuresChart.height;
  const ctx = featuresChart.getContext("2d");

  const arrayLikesEntries = Object.entries(data)
    .filter(entry => entry[1] instanceof Array)
    .sort((a, b) => a[1].length - b[1].length)
  
  const arrayLikesKeys = arrayLikesEntries
    .map(entry => entry[0]);
  
  const arrayLikes = arrayLikesEntries
    .map(entry => entry[1]);
  
  const rowHeight = height / arrayLikes.length;
  
  featuresChart.addEventListener('click', analysisChartClickHanlder);
  
  arrayLikes.forEach((arrayLike, arrayLikeIndex) => {
    const startY = getRowPosition(arrayLikeIndex) * rowHeight;
    const arrayLikeHeight = rowHeight / (arrayLikeIndex + 1);
    arrayLike.forEach((section, sectionIndex) => {
      ctx.fillStyle = colors[sectionIndex % colors.length];
      ctx.fillRect(section.start/data.track.duration*width,
                   getRowPosition(arrayLikeIndex) * rowHeight,
                   section.duration/data.track.duration*width,
                   arrayLikeHeight);
    });
    const label = arrayLikesKeys[arrayLikeIndex].charAt(0).toUpperCase() + arrayLikesKeys[arrayLikeIndex].slice(1)
    ctx.fillStyle = "#000";
    ctx.font = `bold ${arrayLikeHeight}px Circular`;
    ctx.fillText(label,0,startY + arrayLikeHeight);
  });
  const markerHeight = getRowPosition(arrayLikes.length) * rowHeight;
  function provideAnimationFrame(timestamp) {
    player && player.getCurrentState().then(state => {
      ctx.clearRect(0, 0, featuresChart.width, featuresChart.height);
      ctx.drawImage(img,0,0);
      ctx.fillStyle = "#000";

      const position = state.position/1000/data.track.duration*width
      ctx.fillRect(
          position-2,
          0,
          5,
          markerHeight
      );
      
      

      const currentAndLastArrayLikes = getCurrentAndLastArrayLikes(arrayLikes, state.position/1000);
      const pitchChanges = currentAndLastArrayLikes[3][0].pitches.map((pitch, index) => Math.abs(pitch - currentAndLastArrayLikes[3][1].pitches[index]));
      const timbreChanges = currentAndLastArrayLikes[3][0].timbre.map((timbre, index) => Math.abs(timbre - currentAndLastArrayLikes[3][1].timbre[index]));
      
      // Pitch boxes
      const pitchBoxWidth = 60;
      ctx.strokeStyle = "#AAA";
      pitchChanges.forEach((pitchChange, i) => {
        ctx.fillStyle = `hsl(0, 0%, ${pitchChange * 100}%)`;
        ctx.fillRect(i*pitchBoxWidth,
                     height - 2 * pitchBoxWidth,
                     pitchBoxWidth,
                     pitchBoxWidth);
      });
      timbreChanges.forEach((timbreChange, i) => {
        ctx.fillStyle = `hsl(0, 0%, ${timbreChange * 100}%)`;
        ctx.fillRect(i*pitchBoxWidth,
                     height - 4 * pitchBoxWidth,
                     pitchBoxWidth,
                     pitchBoxWidth);
      });
      currentAndLastArrayLikes[3][0].pitches.forEach((pitchChange, i) => {
        ctx.fillStyle = `hsl(0, 0%, ${pitchChange * 100}%)`;
        ctx.fillRect(i*pitchBoxWidth,
                     height - pitchBoxWidth,
                     pitchBoxWidth,
                     pitchBoxWidth);
      });
      currentAndLastArrayLikes[3][0].timbre.forEach((pitchChange, i) => {
        ctx.fillStyle = `hsl(0, 0%, ${pitchChange * 100}%)`;
        ctx.fillRect(i*pitchBoxWidth,
                     height - 3 * pitchBoxWidth,
                     pitchBoxWidth,
                     pitchBoxWidth);
      });
      
      window.requestAnimationFrame(provideAnimationFrame);
    }).catch(e => {
      console.error("Animation: ", e);
      window.requestAnimationFrame(provideAnimationFrame);
    });
  }
  window.requestAnimationFrame(provideAnimationFrame);
  img.src = featuresChart.toDataURL('png');
}


function getAnalysis(id) {
  let query = '/analysis?id=' + id;
  
  return fetch(query).then(e => e.json()).then(_data => {
    drawAnalysis({
      data: _data,
    }  

                  );
      // fetch(`https://api.spotify.com/v1/me/player/play${deviceId && `?device_id=${deviceId}`}`, {
      //     method: "PUT",
      //     body: JSON.stringify({"uris": [`spotify:track:${id}`]}),
      //     headers: {
      //       'Authorization': `Bearer ${accessToken}`
      //     }
      //   }).catch(e => console.error(e));
  });
}



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

function getTrackHtml(track) {
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
  return output;
}

$.get('/playlists-tracks', function(data) {
  var playlist_id = '4VDQkvZhZbpuXKLiS99yk7'
  var options = {};
  var callback = {};

  data.items.map(function(item, i) {
    var track = flattenTrack(item.track);
    var content = getTrackHtml(track);       
    var row = $(`<div class="playlist-track">\n${content}\n</div>`);
    row.appendTo('#playlists-tracks-container');

    getFeatures(track.id);
    getAnalysis(track.id);
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


$.get('/category-playlists', function(data) {
  data.items.map(function(playlist, i) {
    var img = $('<img class="cover-image"/>');
    img.attr('src', playlist.images[0].url);
    img.appendTo('#category-playlists-container');
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
