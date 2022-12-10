/*
src/data.js
System-critical constants shared by client & server.

Author: Max Jikharev
*/

module.exports = Object.freeze({
    //Client-to-server socket msg types
    SOCKET_PROTOCOL_RCV: {
        JOIN_GAME:"game", //client requests to join a game
        GAME_UPDATE:"update", //client requests to get up-to-date info (stats, pos, etc)
        USER_INPUT:"input", //client requests server to process change in input
        SPAWN:"spawn", //client requests to spawn to battlefield
    },

    //Server-to-client socket msg types
    SOCKET_PROTOCOL_SND: {
        STATS:"stats", //server sends leaderboard information for current game session
        RESPAWN:"respawn", //server tells client to respawn (show respawn menu)
        GAME_DATA:"data", //server sends active game data to client
    },

    TANK_TYPES: {
        RECO:{
            UID:1,
            HLT:100,
            SPD:100,
            DMG:40,
            RNG:100,
            RLD:1000 //ms
        },
        SNIP:{
            UID:2,
            HLT:50,
            SPD:75,
            DMG:200,
            RNG:200,
            RLD:2000
        },
        TENC:{
            UID:3,
            HLT:150,
            SPD:50,
            DMG:80,
            RNG:120,
            RLD:1500
        }
    },
});