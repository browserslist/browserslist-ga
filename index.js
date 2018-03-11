const listen = require("./src/listen");
const { google } = require("googleapis");

const clientId =
  "343796874716-bobhn4m27r1p57oqgqc2oacq7m2s5mq2.apps.googleusercontent.com";
const port = 3000; // TODO Make this random and fail proof
const redirectUrl = `http://127.0.0.1:${port}`;

const oauth2Client = new google.auth.OAuth2(clientId, null, redirectUrl);

const url = oauth2Client.generateAuthUrl({
  scope: "https://www.googleapis.com/auth/analytics.readonly"
});

console.log("Please open this URL in your browser:", url);

listen(redirectUrl, port, code => {
  console.log("Authorization code is:", code);
});
