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
        FIRE:"fire", //client requests to spawn a projectile
    },

    //Server-to-client socket msg types
    SOCKET_PROTOCOL_SND: {
        STATS:"stats", //server sends leaderboard information for current game session
        RESPAWN:"respawn", //server tells client to respawn (show respawn menu)
        GAME_DATA:"data", //server sends active game data to client
        UNAUTH:"unauthorized", //server tells client that oauth failed.
        AUTH:"authorized", //server tells client that oauth passed.
    },

    TANK_TYPES: {
        RECO:"RECO",
        SNIP:"SNIP",
        TENC:"TENC",
    },

    TANK_CONSTANTS: {
        RECO:{
            HLT:100,
            SPD:.5,
            DMG:40,
            RNG:50,
            RLD:1000, //ms
            RTS:.03,
        },
        SNIP:{
            UID:2,
            HLT:50,
            SPD:.35,
            DMG:200,
            RNG:100,
            RLD:2000,
            RTS:.01,
        },
        TENC:{
            UID:3,
            HLT:150,
            SPD:.25,
            DMG:80,
            RNG:60,
            RLD:1500,
            RTS:.02,
        }
    },
});