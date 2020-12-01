# rama.js

1. [about](#about)
2. [installation](#installation)
3. [documentation](#documentation)
4. [examples](#examples)
5. [contributing](#contributing)
6. [other projects](#other-projects)

## about

The simplest way to automate web tasks is using the language of the web -
Javascript and the normal web apis by just running the code from the developer
console. This way you don't need to install any program, extension or separate
browser to just automate this one feature. Additionally you don't need to learn
any new tools or apis.

But running simple tasks from the browser console has one big downside: All
activities of your script have to take place on that specific website instance.
**rama.js** tries to change this. It works by opening an [iframe][] and
providing a simple api to control it. So you can for example automate clicking
on a link and the script will keep running on the new page.

However due to the [same-origin policy][] all actions are still limited to pages
on that specific domain. I think you can turn that off in most browsers, but
it's generally a very bad idea as it opens security vulnerabilities.

### name

rama.js is not named after the Hindu God
[Rama][rama-god] but after the Swedish verb _att rama
in_ = _to frame_.

## installation

There obviously is no npm-package for this as this would not benefit anyone. To
use rama.js just paste `rama.js` or the minified version `rama.min.js` in your
console or add them to the top of your script.

## documentation

### iframe functions

#### rama.new(settings\<optional\>)

Creates a new `<iframe>` and returns the `rframe`-object. A settings object can
optionally be passed in. Possible settings are:

-   `name` / `id`: for the new iframe (see
    [below](#rframename-or-rframeid-read-only)). Default is something like
    `rama-273`
-   `parent`: parent DOM element. Default is the `body`-tag
-   `url`: url to open (Can be `about:blank`). Default is the current url of the
    main window

```javascript
let client = rama.new({
    url: "about:blank",
    parent: document.getElementById("iframe-wrapper")
});
```

#### rframe.t or rframe.tag (read-only)

Access the `<iframe>`-tag.

```javascript
client.t.classList.add("invisible");
```

#### rframe.d or rframe.document (read-only)

Access the `document` inside the `<iframe>`. There is also the handy shorthand
`rframe.d.qsa(selector)` for `Array.from(rframe.d.querySelectorAll(selector))`.

```javascript
let testElement = client.d.getElementById("test-element");
let testElements = client.d.qsa(".test");
```

#### rframe.w or rframe.window (read-only)

Access the `window`-object of the `<iframe>`.

```javascript
client.w.history.back();
```

#### rframe<nolink>.name or rframe<nolink>.id (read-only)

There is a good description for this on [MDN web docs][iframe]:

> A targetable name for the embedded browsing context. This can be used in the
> target attribute of the `<a>`, `<form>`, or `<base>` elements; the formtarget
> attribute of the `<input>` or `<button>` elements; or the windowName parameter
> in the `window.open()` method.

```javascript
document.getElementById("links-to-frame").target = client.name;
```

#### rframe.waitForReload()

Pretty self-explanatory: Returns a Promise to wait for a reload of the iframe.

```javascript
button.click();
await client.waitForReload();
// do something on the new page
```

#### rframe.waitFor(testFunction, delay\<optional\>)

Retruns a Promise, which resolves when `testFunction` evaluates to true. The
`rframe`-object is passed to `testFunction`. At the moment the implementation is
a bit hacky as it uses `setInterval()`. The delay for `setInterval()` can be
changed through the `delay` parameter, the default is 500 (measured in
milliseconds).

```javascript
await client.waitFor(
    (client) => client.d.querySelector("#some-div").style.display == "block"
);
// do something now that your checks succeeded
```

#### rframe.waitForSelector(selector, delay\<optional\>)

Returns a Promise which resolves when any element on the page matches the given
selector. Useful for web-frameworks where at `rframe.waitForReload()` not
everything on the page is ready. Works by using `rframe.waitFor()`: the optional
`delay` attribute gets passed through.

```javascript
button.click();
await client.waitForReload();
await client.waitForSelector("#some-div-somewhere");
// do something on the new page
```

#### rframe.close()

Removes the iframe from the DOM.

```javascript
client.close();
```

#### rama.clearpage()

Clears the current window by setting the `<body>` to `display: none`. Changes
the standard parent for new iframes to the `<html>`-tag to keep them visible.

```javascript
rama.clearpage();
```

#### custom styling

All frames can be accessed with the CSS selector/class `rama-frame`.
Additionally every single frame has its id/name also as id on the iframe tag.

### other functions

**rama.js** also provides some other functions not directly related to iframes,
to make web scripting easier:

#### rama.loadjs(url)

Creates a new script tag with the specified url. Useful for loading external
libraries. Returns a Promise, which resolves, when the scripts finished loading.

```javascript
await rama.loadjs(
    "https://cdn.jsdelivr.net/gh/davidshimjs/qrcodejs/qrcode.min.js"
);
```

#### rama.loadcss(csstext)

Injects the given CSS into a new `<style>`-tag.

```javascript
rama.loadcss("h1 {color: red;}");
```

#### rama.clearcss()

Removes all `<style>` and `<link rel="stylesheet">`-tags.

NOTICE: inline styles given to specific elements stay!

```javascript
rama.clearcss();
```

## examples

See examples folder

## contributing

Issues and Pull-Requests are welcome.

The code is formatted with [prettier][]: the configuration can be found in
`.prettierrc`. To generate `rama.min.js` [terser][] is used:

```bash
terser -c -m -o rama.min.js -- rama.js
```

## other projects

I think, at the moment this is the only project with this main idea. But one can
never be sure that there isn't some other similar project hidden somewhere on
the internet. So if you built or found one please write me a mail, as I'm very
curious about other ideas.

[iframe]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe
[same-origin policy]: https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy
[rama-god]: https://en.wikipedia.org/wiki/Rama
[prettier]: https://github.com/prettier/prettier
[terser]: https://github.com/terser/terser
