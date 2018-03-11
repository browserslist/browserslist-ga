const googleAuth = require("./src/google-auth");
const googleAnalytics = require("./src/google-analytics");

googleAuth(oauth2Client => {
  googleAnalytics.getAccounts(oauth2Client, accounts => {
    console.log(accounts);
  });
});
