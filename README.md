<img width="520" height="68" src="./logo.svg" alt="Browserslist-GA logo">

Target browsers tailored to your audience.

---

<p align="center">
  <strong><em>Interested in a bot that does all of this for you?
    <a href="https://goo.gl/forms/WPS13gLAJTwqWQyy1">Click here!</a>
  </em></strong>
</p>

---

## How to use

In the root directory of your project run:

```yaml
npx browserslist-ga
```

_([npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) comes with npm 5.2+, for older versions run `npm install -g browserslist-ga` and then `browserslist-ga`)_  
_(to run the latest code directly from GitHub, execute `npx github:browserslist/browserslist-ga` instead)_

You'll be asked to login with your Google Account. Your access token will only be used locally to generate a `browserslist-stats.json` file in the root of your project. After finishing the steps, you can use your stats with Browserlist by adding the following to your [Browserslist config](https://github.com/ai/browserslist#config-file):

```yaml
> 0.5% in my stats  # Or a different percentage
```

Note that you can query against your custom usage data while also querying against global or regional data. For example, the query `> 1% in my stats, > 5% in US, 10%` is permitted.

## Why should I care?

Browsers update very often these days, with major releases getting published every month.
With each new browser version comes support for new web platform features.
Thanks to open source projects such as Autoprefixer and Babel we are able to use these features while supporting older browsers.
But this backward compatibility comes with a cost.
We can't really keep adding prefixes, polyfills and other fallbacks to support every browser ever invented.

Browserslist is an open source project that can minimize those costs by allowing you to configure which browsers you care about.
It is supported by tools such as
[Autoprefixer](https://github.com/postcss/autoprefixer),
[babel-preset-env](https://github.com/babel/babel/tree/master/packages/babel-preset-env),
[postcss-normalize](https://github.com/jonathantneal/postcss-normalize) and many others.
Here's how you configure Browserslist:

```yaml
> 1%              # I want to support browser versions that have more than 1% of global usage
Last 2 versions   # And the latest 2 versions of each browser
IE 9              # And also Internet Explorer 9 specifically
```

The global browser usage data comes from [caniuse.com](https://caniuse.com) and is downloaded from npm when you run `npm install`.
Package managers such as npm and Yarn will generate a lockfile with the exact version of each package that was installed.
This means the caniuse database that is used to perform these queries will always be the same.
This is great because it's predictable, but it's important to update this package from time to time to keep up with the latest stats.
Apart from remembering to update this package, there's something else you should consider:

* For instance, in China there are some popular browsers that are not used in the US and Europe.
* Or maybe your audience uses mostly mobile browsers.
* Or maybe you are building an application for the government and need to support Internet Explorer 8.

The point being, it's important to make decisions based on your audience.
Browserslist-GA aims to help you with that.
It integrates Google Analytics with Browserslist to keep your targeted browsers updated.

## Notes

There are some differences compared to the `caniuse` Google Analytics importer:

* All browsers on iOS use Safari's WebKit as the underlying engine, and hence will be resolved to Safari. The  `caniuse` Google Analytics parser only converts some of the data to Safari, while the remaining is left untracked (see [#1](https://github.com/browserslist/browserslist-ga/pull/1)).
* YaBrowser, a popular browser in russian-speaking countries, uses the Blink web browser engine and is based on Chromium. It is currently not available on `caniuse` and so is resolved to Chrome (or Chrome for Android) and the version is mapped to the nearest available version (see [#2](https://github.com/browserslist/browserslist-ga/pull/2)).
* Just like for YaBrowser, the [same approach](https://github.com/dmfrancisco/map-to-chrome/blob/master/data/coc_coc_browser.json) is applied to the Coc Coc browser.

## Kudos

All the praise goes to the humans and martians that develop and maintain [Can I Use](https://caniuse.com) and [Browserslist](https://github.com/ai/browserslist).
