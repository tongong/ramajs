# rama.js

# AT THE MOMENT ONLY AN IDEA AND NO ACTUAL IMPLEMENTATION EXISTS

## about
The simplest way to automate web tasks is using the language of the web - Javascript and the normal web apis by just running the code from the developer console. This way you don't need to install any program, extension or separate browser to just automate this one feature. Additionally you don't need to learn any new tools or apis.

But running simple tasks from the browser console has one big downside: All activities of your script have to take place on that specific website instance. **rama.js** tries to change this. It works by opening an [iframe](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe) and providing a simple api to control it. So you can for example automate clicking on a link and the script will keep running on the new page.

However due to the [same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy) all actions are still limited to pages on that specific domain. I think you can turn that off in most browsers, but it's generally a very bad idea as it opens security vulnerabilities.

### name
rama.js is not named after the Hindu God [Rama](https://en.wikipedia.org/wiki/Rama) but after the Swedish verb *att rama in* = *to frame*.





## installation
**currently missing**





## documentation

### iframe functions

#### rama.new( settings\<optional\> )
Creates a new `<iframe>` and returns the `rframe`-object. A settings object can optionally be passed in. Possible settings are:

- `name` / `id`: for the new iframe (see [below](#rframename-or-rframeid-read-only)). Default is something like `rama-273`
- `parent`: parent dom element. Defaul is the `body`-tag
- `url`: url to open (Can be `about:blank`). Default is the current url of the main window

```javascript
let client = rama.new({
    url: "about:blank",
    parent: document.getElementById("iframe-wrapper"),
});
```

#### rframe.close()
Removes the iframe from the DOM.

```javascript
client.close();
```

#### rframe.d or rframe.document (read-only)
Access the `document` inside the `<iframe>`. There is also the handy shorthand `rframe.d.qsa(selector)` for `Array.from(rframe.d.querySelectorAll(selector))`.

```javascript
let testElement = client.d.getElementById("test-element");
let testElements = client.d.qsa(".test");
```

#### rframe.w or rframe.window (read-only)
Access the `window`-object of the `<iframe>`.

```javascript
client.w.history.back();
```

#### rframe&#46;name or rframe&#46;id (read-only)
There is a good description for this on [MDN web docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe):
> A targetable name for the embedded browsing context. This can be used in the target attribute of the `<a>`, `<form>`, or `<base>` elements; the formtarget attribute of the `<input>` or `<button>` elements; or the windowName parameter in the `window.open()` method.

```javascript
document.getElementById("links-to-frame").target = client.name;
```
#### rframe.waitForReload()
Pretty self-explanatory: It waits for a reload of the iframe.

```javascript
button.click();
await client.waitForReload();
// do something on the new page
```

#### rframe.waitForUpdate()
Waits for any kind of update to the DOM.

```javascript
while(!checkSomething()) {
    await client.waitForUpdate();
}
// do something now that your checks succeed
```

#### rframe.waitForSelector(selector)
Waits for a specific selector to match any item on the page. Useful for web-frameworks where at `rframe.waitForReload()` not everything on the website is ready.

```javascript
button.click();
await client.waitForReload();
await client.waitForSelector("#some-div-somewhere");
// do something on the new page
```

#### custom styling
All frames can be accessed with the css selector/class `rama-frame`. Additionally every single frame has its id/name also as id on the iframe tag.





### other functions

**rama.js** also provides some other functions not directly related to iframes, to make web scripting easier:

#### rama.loadjs(url)
Creates a new script tag with the specified url. Useful for loading external libraries.

```javascript
rama.loadjs("https://cdn.jsdelivr.net/gh/davidshimjs/qrcodejs/qrcode.min.js");
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

#### rama.clearScreen()
Sets all currently existing elements to `display: none`.

```javascript
rama.clearScreen();
```





## other projects
I think, at the moment this is the only project with this main idea. But one can never be sure that there isn't some other similar project hidden somewhere on the internet. So if you built or found one please write me a mail, as I'm very curious about other ideas.
