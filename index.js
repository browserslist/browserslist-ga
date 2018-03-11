const inquirer = require("inquirer");
const googleAuth = require("./src/google-auth");
const googleAnalytics = require("./src/google-analytics");

googleAuth(oauth2Client => {
  googleAnalytics.getAccounts(oauth2Client, accounts => {
    inquirer
      .prompt([
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
      .then(answers => {
        console.log(answers.accountId);
      });
  });
});
