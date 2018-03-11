const { google } = require("googleapis");

const analytics = google.analytics("v3");

const getAccounts = (auth, callback) => {
  analytics.management.accounts.list({ auth }, (err, response) => {
    if (err) {
      return console.error(err);
    }

    const results = response.data;
    const accounts = results.items;

    callback(accounts);
  });
};

module.exports = {
  getAccounts,
};
