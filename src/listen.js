const http = require("http");
const { URL } = require("url");

const template = message => `
  <!doctype html>
  <html lang=en>
    <head>
      <meta charset=utf-8>
      <title>${message}</title>
      <style>body { font: 1.2rem sans-serif; margin: 1.5rem }</style>
    </head>
    <body>
      <p>${message}</p>
    </body>
  </html>
`;

const listen = (redirectUrl, port, callback) => {
  let server;

  const requestHandler = (request, response) => {
    const code = new URL(redirectUrl + request.url).searchParams.get("code");

    if (code) {
      response.end(template("✅ Success! You can close this tab and go back to the terminal."));
      callback(code);
      server.close();
    } else {
      response.end(template("❌ Unable to retrieve authorization code."));
    }
  };

  server = http.createServer(requestHandler);

  server.listen(port, err => {
    if (err) {
      return console.error("An error has occurred:", err);
    }
  });
};

module.exports = listen;
