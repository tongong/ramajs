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



### other functions

**rama.js** also provides some other functions not directly related to iframes, to make web scripting easier:

#### rama.loadjs(url)
Creates a new script tag with the specified url. Usefull for loading external libraries.

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
