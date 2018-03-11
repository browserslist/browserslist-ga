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

const getWebProperties = (auth, accountId, callback) => {
  analytics.management.webproperties.list({ auth, accountId }, (err, response) => {
    if (err) {
      return console.error(err);
    }

    const results = response.data;
    const webProperties = results.items;

    callback(webProperties);
  });
};

module.exports = {
  getAccounts,
  getWebProperties,
};
