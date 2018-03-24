/* Code adapted from caniuse.com with permission */

var yaBrowserMapping = require("map-to-chrome/data/YaBrowser.json");
var cocCocMapping = require("map-to-chrome/data/coc_coc_browser.json");
var agentData = require("./caniuse-agent-data");

var helpers = {};
var versionCache = {};
var browsers;

var OPERA_MINI_VERSION = agentData.op_mini.version_list[0].version;
var CURRENT_VERSION = "CURRENT_VERSION";

helpers.setData = function(data) {
  browsers = data;
};

// iOS apps use iOS user agent string but give no version info, so distribute based on known data
helpers.distributeIOS = function() {
  if (!("iOS Safari" in browsers) || !("iOS app" in browsers)) {
    return;
  }
  var iOSTotal = browsers["iOS Safari"].total;
  var appTotal = browsers["iOS app"].total;

  // Distribute iOS app points
  for (var o in browsers["iOS Safari"]) {
    var val = browsers["iOS Safari"][o];
    var ratio = val / iOSTotal;
    browsers["iOS Safari"][o] += Math.round(ratio * appTotal);
  }
  delete browsers["iOS app"];
};

// Google Analytics has no info on Opera Mobile versions, so distribute equally
helpers.distributeOperaMobile = function() {
  if (!("Opera Mobile" in browsers)) {
    return;
  }
  var operaMobileArr = [];
  var versions = agentData["op_mob"].version_list;
  var i;
  for (i = 0; i < versions.length; i++) {
    var operaMobile = versions[i];
    if (operaMobile !== null) {
      operaMobileArr.push(operaMobile);
    }
  }
  var browsersStats = browsers["Opera Mobile"];
  var part = Math.round(browsersStats.total / operaMobileArr.length);
  for (i = 0; i < operaMobileArr.length; i++) {
    var cur = operaMobileArr[i].version;
    browsersStats[cur] = part;
  }
};

helpers.getIntVersion = function(versionString) {
  var m = versionString.match(/^(\d+?)\./);
  if (m && m.length > 1) {
    return +m[1] + "";
  }
};

/* Returns version as N.N */
helpers.getSubVersion = function(versionString) {
  var m = versionString.match(/^(\d+\.\d)/);
  if (m && m.length > 1) {
    return +m[1] + "";
  }
};

helpers.getOperaVersion = function(versionString) {
  var version = helpers.getSubVersion(versionString);
  if (version >= "9" && version < "9.5") {
    version = "9";
  }
  version = helpers.getVersionMatch("opera", version);
  return version;
};

helpers.getSafariVersion = function(versionString) {
  var parts = versionString.split(".");
  var major = parts[0];
  var minor = parts[1];
  var version = major + "." + minor;

  switch (version) {
    case "4.1":
      version = "4.0";
      break;
    default:
      if (minor == "0") {
        version = major;
      }
      break;
  }
  return version;
};

helpers.getAndroidVersion = function(versionString) {
  var version = helpers.getSubVersion(versionString);
  if (version > 3 && version < 4) {
    version = "3";
  }
  version = helpers.getVersionMatch("android", version);
  return version;
};

helpers.getIosSafariVersion = function(versionString) {
  var parts = versionString.split(".");
  var major = parts[0];
  var minor = parts[1];

  var version = major + "." + minor;
  version = helpers.getVersionMatch("ios_saf", version);
  return version;
};

helpers.getChromeMapping = function(mapping, versionString) {
  var parts = versionString.split(".");
  var major = parseInt(parts[0]);
  var minor = parseInt(parts[1]);
  var entry = mapping.find(v => v[0] < major || (v[0] == major && v[1] <= minor));

  if (entry) {
    return entry[2];
  }
};

helpers.getYaBrowserChromeMapping = function(versionString) {
  return helpers.getChromeMapping(yaBrowserMapping, versionString);
};

helpers.getCocCocChromeMapping = function(versionString) {
  return helpers.getChromeMapping(cocCocMapping, versionString);
};

helpers.getVersionMatch = function(browserId, versionString) {
  var version;
  var id = browserId + versionString;
  if (id in versionCache) {
    return versionCache[id];
  }
  if (isNaN(versionString)) {
    versionCache[id] = versionString;
    return versionString;
  }

  var versionList = agentData[browserId].version_list;
  for (var i = 0; i < versionList.length; i++) {
    var ver = versionList[i].version;
    var range = ver.split("-");
    if (range.length < 2) {
      // Single value, compare numerically
      if (+ver == +versionString) {
        version = ver;
        break;
      } else {
        continue;
      }
    }

    var start = +range[0];
    var end = +range[1];
    var versionNum = +versionString;
    if (versionNum >= start && versionNum <= end) {
      version = ver;
      break;
    }
  }
  var result = version || versionString;
  versionCache[id] = result;
  return result;
};

function convertBrowserData(allData) {
  var ga_stats = allData.usage;
  var full_total = allData.total;
  var matched = 0;

  var newUsage = {};
  var agentId;
  var amount;

  for (agentId in agentData) {
    var agdata = agentData[agentId];
    var caniuseBrowser = agdata.browser;
    var usageByVersion = (newUsage[agentId] = {});

    var versionList = agdata.version_list;
    var currentVersion = agdata.current_version;

    for (var i = 0; i < versionList.length; i++) {
      var versionNumber = versionList[i].version;
      usageByVersion[versionNumber] = 0;
      var browserGAStats = ga_stats[caniuseBrowser];
      if (!browserGAStats) {
        continue;
      }
      if (currentVersion == versionNumber && browserGAStats[CURRENT_VERSION]) {
        browserGAStats[versionNumber] = browserGAStats[CURRENT_VERSION];
      }
      if (browserGAStats[versionNumber]) {
        amount = browserGAStats[versionNumber];
        var percentage = amount / full_total * 100;
        usageByVersion[versionNumber] = percentage;
        matched += amount;
        browserGAStats.total -= amount;
        delete browserGAStats[versionNumber];
        if (currentVersion == versionNumber) {
          delete browserGAStats[CURRENT_VERSION];
        }
      }
    }
  }

  allData.usage = newUsage;
}

function parse(entries) {
  var browsers = { others: 0 };
  var other_total = 0;
  var tracked_total = 0;

  helpers.setData(browsers);

  for (var i = 0; i < entries.length; i++) {
    var entry = entries[i];
    var os = entry[0];
    var os_ver = entry[1];
    var browser = entry[2];
    var version = entry[3];
    var isMobile = entry[4] == "Yes";
    var pageviews = +entry[5];

    if (browser == "Opera" && (isMobile || os == "(not set)")) {
      browser = "Opera Mobile";
    } else if (os == "iOS" || os == "iPad" || os == "iPhone" || os == "iPod") {
      // all apps on ios must use safari engine by apple rules
      browser = "iOS Safari";
    } else if (browser == "Safari (in-app)") {
      browser = "iOS Safari";
    } else if (browser == "BlackBerry") {
      browser = "Blackberry Browser";
    } else if (browser == "Internet Explorer") {
      browser = "IE";
    } else if (browser == "UC Browser" && os == "Android") {
      browser = "UC Browser for Android";
    }

    var v_num;
    var tracked = true;
    switch (browser) {
      case "Edge":
        browser = "Edge";
        v_num = helpers.getIntVersion(version);
        break;

      case "Chrome":
        if (os == "Android") {
          browser += " for Android";
          v_num = CURRENT_VERSION;
        } else {
          v_num = helpers.getIntVersion(version);
        }
        break;

      case "YaBrowser":
        // This is valid for both Desktop and Android (iOS is considered Safari)
        v_num = helpers.getYaBrowserChromeMapping(version);
        if (v_num) {
          browser = os == "Android" ? "Chrome for Android" : "Chrome";
        }
        break;

      case "Coc Coc":
        // This is valid for both Desktop and Android (iOS is considered Safari)
        v_num = helpers.getCocCocChromeMapping(version);
        if (v_num) {
          browser = os == "Android" ? "Chrome for Android" : "Chrome";
        }
        break;

      case "Opera":
        v_num = helpers.getOperaVersion(version);
        break;

      case "Firefox":
        if (os == "Android") {
          browser += " for Android";
          v_num = CURRENT_VERSION;
        } else {
          v_num = helpers.getSubVersion(version);
        }
        break;

      case "IE":
        v_num = helpers.getSubVersion(version);
        break;

      case "Opera Mini":
        v_num = OPERA_MINI_VERSION; // getSubVersion(version);
        break;

      case "Opera Mobile":
        v_num = helpers.getSubVersion(version);
        if (!v_num) {
          v_num = "x";
        }
        break;

      case "Safari":
        v_num = helpers.getSafariVersion(version);
        //if(v_num) b.total += pageviews;
        break;

      case "Android Browser":
        v_num = helpers.getAndroidVersion(os_ver);
        break;

      case "Android Webview":
        browser = "Android Browser";
        // v_num = helpers.getIntVersion(version); // Use this once multi versions are available
        v_num = CURRENT_VERSION;
        break;

      case "iOS Safari":
        v_num = helpers.getIosSafariVersion(os_ver);
        break;

      case "iOS app":
        v_num = "x";
        break;

      case "Blackberry Browser":
        v_num = version.split(".")[0];
        break;

      case "UC Browser for Android":
        v_num = CURRENT_VERSION; // helpers.getSubVersion(version);
        break;

      default:
        v_num = null;
    }

    if (!(browser in browsers)) {
      browsers[browser] = { total: 0 };
    }
    var b = browsers[browser];

    if (!v_num) {
      tracked = false;
    }

    if (v_num) {
      if (b[v_num]) {
        b[v_num] += pageviews;
      } else {
        b[v_num] = pageviews;
      }
      b.total += pageviews;
    } else {
      browsers.others += pageviews;
      if (!tracked) b.total += pageviews;
    }

    if (!tracked) {
      other_total += pageviews;
    } else {
      tracked_total += pageviews;
    }
  }

  // Remove insignificant browsers
  for (var o in browsers) {
    if (browsers[o].total < 10) {
      delete browsers[o];
    }
  }

  // Distribute iOS points
  helpers.distributeIOS();

  // Distribute Opera Mobile points
  helpers.distributeOperaMobile();

  var full_total = other_total + tracked_total;

  var data_obj = {
    total: full_total,
    usage: browsers,
  };

  convertBrowserData(data_obj);

  return data_obj.usage;
}

module.exports = {
  parse,
  helpers,
};
