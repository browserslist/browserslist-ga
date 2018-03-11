const googleAuth = require("./src/google-auth");

const clientId =
  process.env.BROWSERSLIST_GA_CLIENT_ID ||
  "343796874716-6k918h5uajk7k3apdua9n8m6her4igv7.apps.googleusercontent.com";
const accessToken = process.env.BROWSERSLIST_GA_ACCESS_TOKEN;
const refreshToken = process.env.BROWSERSLIST_GA_REFRESH_TOKEN;

if (!accessToken || !refreshToken) {
  googleAuth(clientId, oauth2Client => {
    console.log("Completed successfully!");
  });
}
