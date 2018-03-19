const portfinder = require("portfinder");
const listen = require("./listen");
const opener = require("opener");
const { google } = require("googleapis");

const clientId =
  process.env.BROWSERSLIST_GA_CLIENT_ID ||
  "343796874716-6k918h5uajk7k3apdua9n8m6her4igv7.apps.googleusercontent.com";
const accessToken = process.env.BROWSERSLIST_GA_ACCESS_TOKEN;
const refreshToken = process.env.BROWSERSLIST_GA_REFRESH_TOKEN;

const googleAuth = callback => {
  portfinder.getPort((err, port) => {
    if (err) {
      return console.error(err);
    }

    const redirectUrl = `http://127.0.0.1:${port}`;
    const oauth2Client = new google.auth.OAuth2(clientId, null, redirectUrl);

    const handleAuth = (tokens, callback) => {
      oauth2Client.setCredentials(tokens);
      callback(oauth2Client);
    };

    if (accessToken && refreshToken) {
      return handleAuth({ access_token: accessToken, refresh_token: refreshToken }, callback);
    }

    const url = oauth2Client.generateAuthUrl({
      scope: "https://www.googleapis.com/auth/analytics.readonly",
    });

    console.log("Please open this URL in your browser:", url);
    try {
      opener(url);
    } catch (e) {
      /* User will have to open manually */
    }

    listen(redirectUrl, port, code => {
      oauth2Client.getToken(code, (err, tokens) => {
        if (err) {
          return console.error(err);
        }

        handleAuth(tokens, callback);
      });
    });
  });
};

module.exports = googleAuth;
