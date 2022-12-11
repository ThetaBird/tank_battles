
const { google } = require('googleapis');
const axios = require("axios");

const {web} = require("./oauth.keys.json");
const {client_id, client_secret} = web;

const oauth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  'http://localhost:8080'
);

const getGoogleAuthURL = () => {
    /*
     * Generate a url that asks permissions to the user's email and profile
     */
    const scopes = [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ];

    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: scopes, // If you only need one scope you can pass it as string
    });
}

const getGoogleUser = async ({ code }) => {
    const { tokens } = await oauth2Client.getToken(code);
  
    // Fetch the user's profile with the access token and bearer
    const googleUser = await axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokens.id_token}`,
          },
        },
      )
      .then(res => res.data)
      .catch(error => {
        throw new Error(error.message);
      });
  
    console.log(googleUser);

    return googleUser;
}

module.exports = {
    getGoogleAuthURL,
    getGoogleUser
}