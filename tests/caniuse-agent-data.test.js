var agentData = require("../src/caniuse-agent-data");

test("browsers tracked are the same 18 as caniuse", () => {
  const browsers = Object.keys(agentData);
  expect(browsers.length).toBe(18);
});
