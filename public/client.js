
function drawFeatures(data) {
  const labels = data.labels;
  const values = data.values;
  const ctx = data.ctx;
  
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
              'rgba(180,155,200,10)',
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
}

function getFeatures(id) {
  let query = '/features?id=' + id;
  
  $.get(query, function(data) {
    let _labels = [];
    let _values = [];
    
    for (var feature in data) {
      if (data.hasOwnProperty(feature) && feature !== 'key' && feature !== 'mode') {
        if(data[feature] <= 1 && data[feature] >= 0) {
          _labels.push(feature);
          _values.push(data[feature]);
        }
      }
    }

    const chart_selector = `#ft-${id}.features-chart`;
    const _chart = document.querySelector(chart_selector);

    drawFeatures({
      labels: _labels,
      values: _values,
      ctx: _chart,
    });
    

  });
}


function drawAnalysis(_track) {
  let id = _track.id;
  let data = _track.data; 
  // console.log(data);
  
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
  
  function binaryIndexOf(searchElement, valueof, valueout) {
    var minIndex = 0;
    var maxIndex = this.length - 1;
    var currentIndex;
    var currentElement;
    while (minIndex <= maxIndex) {
      currentIndex = (minIndex + maxIndex) / 2 | 0;
      currentElement = valueof(this[currentIndex]);

      if (currentElement < searchElement && ((currentIndex + 1 < this.length) 
          ? valueof(this[currentIndex+1]) : Infinity) > searchElement) {
        return valueout(currentElement, currentIndex, this);
      }
      
      if (currentElement < searchElement) {
        minIndex = currentIndex + 1;
      } else if (currentElement > searchElement) {
        maxIndex = currentIndex - 1;
      } else { 
        return this[currentIndex]; 
      }
    }
    return -1;
  }
  
  function analysisChartClickHanlder(clickEvent) {
    var chart = clickEvent.target;
    const time = (clickEvent.offsetX / chart.width) * data.track.duration * 2;
    const kind = getFloorRowPosition(clickEvent.offsetY * 2 , rowHeight);

//     const seekTime = binaryIndexOf.call(  
//       arrayLikes[kind], 
//       time, 
//       e => e.start, 
//       (element, index) => element
//     );
    
    // fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${Math.floor(seekTime*1000)}`, {
    //   method: "PUT",
    //   headers: {
    //     'Authorization': `Bearer ${accessToken}`
    //   }
    // }).catch(console.log);
  }
  
  const getCurrentAndLastArrayLikes = (arrayLikes, time) => {
    arrayLikes.map(arrayLike => {
      binaryIndexOf.call(arrayLike, time, e => e.start, 
        (element, index, array) => ([
          array[index],
          array[index > 0 ? index - 1 : 0]
        ])
      )
    })
  };
  
  const getRowPosition = index => index === 0 ? 0 : 1 / index + getRowPosition(index-1);
  const getFloorRowPosition = ( searchPosition, rowHeight, i=0, max=5) => i > max 
    ? max : searchPosition < (getRowPosition(i+1) * rowHeight) 
    ? i : getFloorRowPosition(searchPosition, rowHeight, i+1, max);
  
  const chart_selector = `#an-${id}.analysis-chart`;
  const analysisChart = document.querySelector(chart_selector);
  
  analysisChart.style.width = analysisChart.offsetWidth;
  analysisChart.width = analysisChart.offsetWidth * 2;
  analysisChart.style.height = analysisChart.offsetHeight;
  analysisChart.height = analysisChart.offsetHeight * 2;
  
  const width = analysisChart.width;
  const height = analysisChart.height;
  const ctx = analysisChart.getContext("2d");
  
  const arrayLikesEntries = Object.entries(data)
  .filter(entry => entry[1] instanceof Array)
  .sort((a, b) => a[1].length - b[1].length)
  
  const arrayLikesKeys = arrayLikesEntries.map(entry => entry[0]);
  const arrayLikes = arrayLikesEntries.map(entry => entry[1]);
  const rowHeight = height / arrayLikes.length;
  
  analysisChart.addEventListener('click', analysisChartClickHanlder);
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
        ctx.clearRect(0, 0, analysisChart.width, analysisChart.height);
        ctx.drawImage(img,0,0);
        ctx.fillStyle = "#000";
        
        const position = state.position/1000/data.track.duration*width
        ctx.fillRect(position-2,
          0,
          5,
          markerHeight);
          
          
          
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
          img.src = analysisChart.toDataURL('png');
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
    <canvas id="an-${track.id}" class="analysis-chart" width="300" height="150"></canvas>
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

function getAnalysis(id) {
  let query = '/analysis?id=' + id;
  
  return fetch(query).then(e => e.json()).then(_data => {
    drawAnalysis({
      data: _data,
      id: id,
    });
    // fetch(`https://api.spotify.com/v1/me/player/play${deviceId && `?device_id=${deviceId}`}`, {
    //     method: "PUT",
    //     body: JSON.stringify({"uris": [`spotify:track:${id}`]}),
    //     headers: {
    //       'Authorization': `Bearer ${accessToken}`
    //     }
    //   }).catch(e => console.error(e));
  });
}

// $.get('/analysis', function(data) {
//   return drawAnalysis(data)
// });

$.get('/features', function(data) {
  var keys = ["danceability", "energy", "acousticness", "tempo", "instrumentalness"]
  keys.map(function(key, i) {
    if (data.hasOwnProperty(key)) {
      var feature = $('<p style="#ffffff"><span class="big-number">' + data[key] + ' </span>'  + key + '</p>');
      feature.appendTo('#audio-features-container');
    }
  });
});


// $.get('/artist', function(data) {
//   var img = $('<img class="circle-image" />');
//   img.attr('src', data.images[0].url);
//   img.appendTo('#artist-container');

//   var trackName = $('<h3>' + data.name + '</h3>');
//   trackName.appendTo('#artist-container');

//   var trackName = $('<h3>Popularity: ' + data.popularity + '</h3>');
//   trackName.appendTo('#artist-container');

//   var trackName = $('<h3>Followers: ' + data.followers.total + '</h3>');
//   trackName.appendTo('#artist-container');

//   data.genres.map(function(genre, i) {
//     var genreItem = $('<p>' + genre + '</p>');
//     genreItem.appendTo('#artist-container');
//   });
// });

$.get('/artist-top-tracks', function(data) {
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
  var img = $('<div class="circle-image"></div>');
  img.attr('style', 'background:url(' + data.images[0].url + ') center/cover;height:300px;width:300px;');
  img.appendTo('#user-container');
  var trackName = $('<a href="' + data.external_urls.spotify + '" style="color:white;text-decoration:underline;"><h3>' + data.id + '</h3></a>');
  trackName.appendTo('#user-container');
  var trackName = $('<h3>Followers: ' + data.followers.total + '</h3>');
  trackName.appendTo('#user-container');
});
