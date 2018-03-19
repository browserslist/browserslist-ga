#!/usr/bin/env node

const fs = require("fs");
const inquirer = require("inquirer");
const googleAuth = require("./src/google-auth");
const { getAccounts, getWebProperties, getProfiles, getData } = require("./src/google-analytics");
const { parse } = require("./src/caniuse-parser");

inquirer.registerPrompt("datetime", require("inquirer-datepicker-prompt"));

const outputFilename = "browserslist-stats.json";

googleAuth(oauth2Client => {
  let selectedProfile;

  getAccounts(oauth2Client)
    .then(accounts =>
      inquirer.prompt([
        {
          type: "list",
          name: "account",
          message: "Please select an account:",
          choices: accounts.map(account => ({
            value: account,
            name: `${account.name} (#${account.id})`,
          })),
        },
      ])
    )
    .then(({ account }) => getWebProperties(oauth2Client, account.id))
    .then(webProperties =>
      inquirer.prompt([
        {
          type: "list",
          name: "webProperty",
          message: "Please select a property:",
          choices: webProperties.map(webProperty => ({
            value: webProperty,
            name: `${webProperty.name} (#${webProperty.id})`,
          })),
        },
      ])
    )
    .then(({ webProperty }) => getProfiles(oauth2Client, webProperty.accountId, webProperty.id))
    .then(profiles =>
      inquirer.prompt([
        {
          type: "list",
          name: "profile",
          message: "Please select a profile:",
          choices: profiles.map(profile => ({
            value: profile,
            name: `${profile.name} (#${profile.id})`,
          })),
        },
      ])
    )
    .then(({ profile }) => {
      const defaultStartDate = new Date();
      const defaultEndDate = new Date();

      selectedProfile = profile;

      // End date defaults to today, start date defaults to 90 days ago
      defaultStartDate.setDate(defaultEndDate.getDate() - 90);

      return inquirer.prompt([
        {
          type: "datetime",
          name: "startDate",
          message: 'Specify a start date (format is "YYYY-MM-DD", defaults to 90 days ago):',
          format: ["yyyy", "-", "mm", "-", "dd"],
          initial: defaultStartDate,
        },
        {
          type: "datetime",
          name: "endDate",
          message: 'Specify an end date (format is "YYYY-MM-DD", defaults to today):',
          format: ["yyyy", "-", "mm", "-", "dd"],
          initial: defaultEndDate,
        },
      ]);
    })
    .then(({ startDate, endDate }) => getData(oauth2Client, selectedProfile.id, startDate, endDate))
    .then(parse)
    .then(stats => {
      fs.writeFileSync(outputFilename, JSON.stringify(stats, null, 2));
      console.log(`Success! Stats saved to '${outputFilename}'`);
      process.exit();
    })
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
});
