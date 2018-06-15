#!/usr/bin/env node

const fs = require("fs");
const inquirer = require("inquirer");
const googleAuth = require("./src/google-auth");
const { getAccounts, getWebProperties, getProfiles, getData } = require("./src/google-analytics");
const { parse } = require("./src/caniuse-parser");
const { metadata } = require("./src/metadata");

inquirer.registerPrompt("datetime", require("inquirer-datepicker-prompt"));

const outputFilename = "browserslist-stats.json";

googleAuth(oauth2Client => {
  const selections = {}

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
    .then(({ account }) => {
      selections.selectedAccount = account;

      return getWebProperties(oauth2Client, account.id);
    })
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
    .then(({ webProperty }) => {
      selections.selectedProperty = webProperty;

      return getProfiles(oauth2Client, webProperty.accountId, webProperty.id);
    })
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
      selections.selectedProfile = profile;

      const defaultStartDate = new Date();
      const defaultEndDate = new Date();

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
    .then(({ startDate, endDate }) => {
      selections.selectedStartDate = startDate;
      selections.selectedEndDate = endDate;

      return getData(oauth2Client, selections.selectedProfile.id, startDate, endDate);
    })
    .then(data => ({ stats: parse(data), metadata: metadata(new Date(), selections) }))
    .then(({ stats, metadata }) => {
      const output = Object.assign({}, stats, metadata);

      fs.writeFileSync(outputFilename, JSON.stringify(output, null, 2));
      console.log(`Success! Stats saved to '${outputFilename}'`);
      process.exit();
    })
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
});
