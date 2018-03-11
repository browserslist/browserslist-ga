const listen = require("./listen");
const { google } = require("googleapis");

const port = 3000; // TODO Make this random and fail proof
const redirectUrl = `http://127.0.0.1:${port}`;

const googleAuth = (clientId, callback) => {
  const oauth2Client = new google.auth.OAuth2(clientId, null, redirectUrl);

  const url = oauth2Client.generateAuthUrl({
    scope: "https://www.googleapis.com/auth/analytics.readonly"
  });

  console.log("Please open this URL in your browser:", url);

  listen(redirectUrl, port, code => {
    console.log("Authorization code is:", code);

    oauth2Client.getToken(code, (err, tokens) => {
      if (err) {
        return console.error(err);
      }

      console.log("Access token is:", tokens.access_token);
      console.log("Refresh token is:", tokens.refresh_token);
      oauth2Client.setCredentials(tokens);

      callback(oauth2Client);
    });
  });
};

module.exports = googleAuth;
