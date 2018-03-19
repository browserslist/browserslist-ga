var { helpers } = require("../src/caniuse-parser");

test("invalid YaBrowser version is mapped to undefined", () => {
  const chromeVersion = helpers.getYaBrowserChromeMapping("1");
  expect(chromeVersion).toBeUndefined();
});

test("exact YaBrowser version is mapped to the right Chrome version", () => {
  const chromeVersion = helpers.getYaBrowserChromeMapping("18.1");
  expect(chromeVersion).toBe(63);
});

test("non-existing YaBrowser version is mapped to the older nearest Chrome version", () => {
  const chromeVersion = helpers.getYaBrowserChromeMapping("18");
  expect(chromeVersion).toBe(62);
});
