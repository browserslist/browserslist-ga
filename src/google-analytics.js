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

const getData = (auth, profileId, startDate, endDate) =>
  new Promise((resolve, reject) => {
    const options = {
      auth,
      ids: `ga:${profileId}`,
      dimensions: [
        "ga:operatingSystem",
        "ga:operatingSystemVersion",
        "ga:browser",
        "ga:browserVersion",
        "ga:isMobile",
      ].join(","),
      sort: "ga:browser",
      "max-results": 100000,
      metrics: "ga:pageviews",
      "start-date": startDate.toISOString().slice(0, 10),
      "end-date": endDate.toISOString().slice(0, 10),
    };

    console.log("Getting data...");

    analytics.data.ga.get(options, (err, response) => {
      if (err) return reject(err);

      const results = response.data;
      const data = results.rows || [];

      resolve(data);
    });
  });

module.exports = {
  getAccounts,
  getWebProperties,
  getProfiles,
  getData,
};
