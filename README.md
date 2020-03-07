Spotiguess
==========

This is a small web application that uses the Spotify API 
to fetch shared playlists and creates a small guessing game 
with the main question: "who did acutally add this song".

These project originiated from an idea to use the shared playlist
that I had with a friend to play as a guessing game.

Planned Features:

- Connect to spotify API to get your colaborative playlists
- Select a playlist
- Start a gaming session with a join key (e.g. NWAQTX)
    + this device will be the game master
    + Can start game, kick players and act as an admin
    + (Defines number of rounds played)
- Up to 4 players can join the session using the key
    + Mobile devices, tablets or smarphones
    + Desktop devices also possible
- Random song is selected from playlist with 
    + Information presented: album cover, artist, title and sample music
- The player can select any colaborator of the playlist as answer.
- Points are awarded for correct answers.
- A new random song is selected from playlist
- If number of rounds is reached a player point summary is displayed

# Technical details

- Node js backend with express
- Socket.io for gamemaster <-> player communication
- Some responsive design

# Extension features

- Meta questions:
    + Who added the most songs
    + Who has the longest streak (in songs)
    + Who has the longest streak (in time)
    + Who has added the most unavailable songs (from the perspective of the game master)
- Admin interface on the game master
