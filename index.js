const inquirer = require("inquirer");
const googleAuth = require("./src/google-auth");
const { getAccounts, getWebProperties } = require("./src/google-analytics");

googleAuth(oauth2Client => {
  getAccounts(oauth2Client)
    .then(accounts =>
      inquirer.prompt([
        {
          type: "list",
          name: "accountId",
          message: "Please select your account:",
          choices: accounts.map(account => ({
            value: account.id,
            name: `${account.name} (#${account.id})`,
          })),
        },
      ])
    )
    .then(({ accountId }) => getWebProperties(oauth2Client, accountId))
    .then(console.log)
    .catch(console.error);
});
