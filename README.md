Spotiguess
==========

This is a small web application that uses the Spotify API
to fetch shared play-lists and creates a small guessing game
with the main question: "who did actually add this song".

These project originated from an idea to use the shared play-list
that I had with a friend to play as a guessing game.

Planned Features:

- Connect to Spotify API to get your collaborative play-lists
- Select a play-list
- Start a gaming session with a join key (e.g. NWAQTX)
    + this device will be the game master
    + Can start game, kick players and act as an admin
    + (Defines number of rounds played)
- Up to 4 players can join the session using the key
    + Mobile devices, tablets or smart-phones
    + Desktop devices also possible
- Random song is selected from play-list with
    + Information presented: album cover, artist, title and sample music
- The player can select any collaborator of the play-list as answer.
- Points are awarded for correct answers.
- A new random song is selected from play-list
- If number of rounds is reached a player point summary is displayed

# Technical details

- Node js back-end with express
- Socket.io for game-master <-> player communication
- Bootstrap for responsive design

# Extension features

- Meta questions:
    + Who added the most songs
    + Who has the longest streak (in songs)
    + Who has the longest streak (in time)
    + Who has added the most unavailable songs (from the perspective of the game master)
- Admin interface on the game master
