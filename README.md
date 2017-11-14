Spotify Playground: Solutions
=========================

## These are some possible solutions to the [Spotify Playground](https://spotify-playground.glitch.me)

Written by [Arielle Vaniderstine](https://twitter.com/imariari)

A basic Node app that integrates with the Spotify API.

This app uses the *Client Credentials Flow* for authentication, which means you can only get non-user-specific data.

## Getting Started

1. After registering your app at developer.spotify.com, put your app's client ID and secret (which you can find in the Dashboard) into the `.env` file.

2. Click on "Show Live" in Glitch and verify that your app works (you should see data in each of the coloured sections).

## Working with the Playground

- Navigate between files in Glitch's left panel.
- See server logs by clicking "Logs" at the top of the left panel.
- Open the browser's **Developer Tools** by right-clicking and selecting **Inspect**.
- Calls to the Spotify API live in **server.js**.
- Calls to your own server and the rendering of the UI occur in **public/client.js**.

## Challenges

#### Pink: Search for a Track

[1. Change the song that shows up.](https://glitch.com/edit/#!/spotify-playground-solutions?path=server.js:51:48)

[2. Display the artist name in addition to the song name.](https://glitch.com/edit/#!/spotify-playground-solutions?path=public/client.js:20:4)

[3. Make the title link to the song on Spotify.](https://glitch.com/edit/#!/spotify-playground-solutions?path=public/client.js:16:36)

#### Purple: Get a Category's Playlists

[1. Get the playlists for a different category!](https://glitch.com/edit/#!/spotify-playground-solutions?path=server.js:66:38)

[2. Show 10 playlists instead of 5.](https://glitch.com/edit/#!/spotify-playground-solutions?path=server.js:66:59)

[3. Different playlists are shown to users in different countries. Show the playlists from another country.](https://glitch.com/edit/#!/spotify-playground-solutions?path=server.js:66:73)

#### Orange: Get Audio Features for a Track

[1. What track are these audio features for?](https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC)

[2. There are more audio features available. Display 2 more features.](https://glitch.com/edit/#!/spotify-playground-solutions?path=public/client.js:50:58)

[3. Get the audio features for another track.](https://glitch.com/edit/#!/spotify-playground-solutions?path=server.js:78:39)

#### Blue: Get an Artist

[1. Get another artist.](https://glitch.com/edit/#!/spotify-playground-solutions?path=server.js:90:24)

[2. Show the popularity value for the artist.](https://glitch.com/edit/#!/spotify-playground-solutions?path=public/client.js:77:43)

[3. Show the number of followers the artist has.](https://glitch.com/edit/#!/spotify-playground-solutions?path=public/client.js:81:42)

#### Yellow: Get an Artist's Top Tracks

[1. Whose top tracks are these?](https://)

[2. Get the top tracks of another artist.](https://glitch.com/edit/#!/spotify-playground-solutions?path=server.js:102:33)

[3. Top Tracks vary by country. Which country are these top tracks for? Show the top tracks in another country.](https://glitch.com/edit/#!/spotify-playground-solutions?path=server.js:102:59)

### Bonus!

[Use a different endpoint to get totally different data!](https://glitch.com/edit/#!/spotify-playground-solutions?path=server.js:113:0)

