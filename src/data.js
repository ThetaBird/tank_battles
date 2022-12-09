/*
src/data.js
System-critical constants shared by client & server.

Author: Max Jikharev
*/

function Parameters(){
    //Client-to-server socket msg types
    this.SOCKET_PROTOCOL_RCV = {
        JOIN_GAME:"game", //client requests to join a game
        GAME_UPDATE:"update", //client requests to get up-to-date info (stats, pos, etc)
        USER_INPUT:"input", //client requests server to process change in input
        SPAWN:"spawn", //client requests to spawn to battlefield
    }

    //Server-to-client socket msg types
    this.SOCKET_PROTOCOL_SND = {
        STATS:"stats", //server sends leaderboard information for current game session
        RESPAWN:"respawn", //server tells client to respawn (show respawn menu)
        GAME_DATA:"data", //server sends active game data to client
    }

    this.TANK_TYPES = {
        RECO:1,
        SNIP:2,
        TENC:3,
    }
}