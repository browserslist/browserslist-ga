/* Use data from `caniuse-lite` and convert to format used on caniuse.com */

const { agents } = require("caniuse-lite/dist/unpacker/agents");

const agentData = {};

Object.entries(agents).forEach(([browserCode, data]) => {
  const versions = data.versions.filter(version => version !== null);

  // Sort versions by timestamp. Unreleased versions have null timestamp, so they will be at the end
  const versionsByDate = Object.entries(data.release_date).sort((a, b) => b[1] - a[1]);

  agentData[browserCode] = {
    version_list: versions.map(version => ({ version })),
    current_version: versionsByDate[0][0],
    browser: data.browser,
  };
});

module.exports = agentData;
