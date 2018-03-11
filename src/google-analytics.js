const { google } = require("googleapis");

const analytics = google.analytics("v3");

const getAccounts = auth =>
  new Promise((resolve, reject) => {
    analytics.management.accounts.list({ auth }, (err, response) => {
      if (err) return reject(err);

      const results = response.data;
      const accounts = results.items;

      resolve(accounts);
    });
  });

const getWebProperties = (auth, accountId) =>
  new Promise((resolve, reject) => {
    analytics.management.webproperties.list({ auth, accountId }, (err, response) => {
      if (err) return reject(err);

      const results = response.data;
      const webProperties = results.items;

      resolve(webProperties);
    });
  });

const getProfiles = (auth, accountId, webPropertyId) =>
  new Promise((resolve, reject) => {
    analytics.management.profiles.list({ auth, accountId, webPropertyId }, (err, response) => {
      if (err) return reject(err);

      const results = response.data;
      const profiles = results.items;

      resolve(profiles);
    });
  });

module.exports = {
  getAccounts,
  getWebProperties,
  getProfiles,
};
