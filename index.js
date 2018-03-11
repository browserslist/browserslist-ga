const inquirer = require("inquirer");
const googleAuth = require("./src/google-auth");
const { getAccounts, getWebProperties, getProfiles } = require("./src/google-analytics");

googleAuth(oauth2Client => {
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
    .then(console.log)
    .catch(console.error);
});
