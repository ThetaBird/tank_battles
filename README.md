## About

tank_battles is a basic socket.io game built in ~3 days for a final project. Although unpolished, it features:

- Login with Google OAuth
- Smooth movement mechanics & physics calculations
- Server-validated client behaviors
- An object-oriented backend
- 3-Dimensional graphics made possible with **Three.js**

## Installation & Initialization
**Node.js 16.9.0 or newer is recommended.**
```sh
npm install 
npm run build
sudo node src/server/app.js
#Sudo permissions are needed to listen to port 80. If sudo perms are missing, change the port variables in .env to 8080 instead.
#Now listening on port 80 by default. Open localhost (or url if hosting on open server) in a browser.
```

## Notes

**Google OAuth won't work without an oauth.keys.json file containing the relevant google API information. This has been omitted from the repository for security concerns.**

There are unresolved inefficiencies with this code due to time constraints:

- Undesired behavior when rotating the turret past the threshold point directly below the tank
- The clients send input data through the socket 60 times/sec (the server does not verify this and is vulnerable to overload attacks), performs physics calculations 30 times/sec, and sends data back to the client 60 times/sec (if changes are detected). This results in extremely high outbound data usage. This can be mitigated by sending data to the client ~10 times/sec and having the clients tween the movements to whatever refresh rate they have. The following is a network usage graph for a ~10-minute demonstration with ~40 concurrent players on a single threaded shared cloud complete instance:

<div align="center">
    <img src="https://us-east-1.tixte.net/uploads/tacti.bot.style/tank_battles_test.jpeg" width="546" alt="tank_battles_network_usage" />
</div>

- The frontend for this project is essentially bare minimum, and I would consider it worse than spaghetti. For this demonstration, a "function-over-form" approach was taken.
- Not all desired functionality has been implemented. Teams, conditional respawns, scores, map environments, and more could not could be completed within the timeframe, but some boilerplate has been implemented for them.
- The collision detection is based on distance from point to point, so there are some "dead-zones" where minor false positives occur.
- There is no multithreading. 


## Switching from Localhost to VPS for multiplayer functionality

- Change .env ENV variable to anything but "DEV"
- Change public/login.js line 1 true -> false
- Change src/data.js URL true -> false

## Pictures
<div align="center">
    <div>Short Gameplay GIF</div>
    <img src="https://us-east-1.tixte.net/uploads/tacti.bot.style/tank_battles_gif.gif" width="546" alt="tank_battles_gif" />
    <div>Gameplay Screenshot</div>
    <img src="https://us-east-1.tixte.net/uploads/tacti.bot.style/tank_battles_screenshot.jpeg" width="546" alt="tank_battles_screenshot" />
    <div>Quick 10-minute tank model in Fusion 360</div>
    <img src="https://us-east-1.tixte.net/uploads/tacti.bot.style/tank_battles_3D_model.jpeg" width="546" alt="tank_battles_3D_model" />
    <div>Gameplay Screenshot w/ camera unlocked</div>
    <img src="https://us-east-1.tixte.net/uploads/tacti.bot.style/tank_battles_screenshot_2.jpeg" width="546" alt="tank_battles_screenshot_2" />
</div>