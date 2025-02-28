// no "let" or "var" here so that pasting updated versions of the code to the
// developer console does not fire redeclaration-errors
rama = {
    // #################### iframe functions ####################
    // for ids -> no id gets used twice
    number: 0,
    // to  make this settig globally changeable
    stdparent: document.querySelector("body"),

    new: function (config) {
        // parse the settings object
        const defaultConfig = {
            url: window.location.href,
            parent: this.stdparent,
            name: "rama-" + this.number
        };
        this.number++;
        if (typeof config !== "object") config = {};
        if (!config.hasOwnProperty("url")) config.url = defaultConfig.url;
        if (!config.hasOwnProperty("parent"))
            config.parent = defaultConfig.parent;
        if (!config.hasOwnProperty("name")) config.name = defaultConfig.name;
        if (config.hasOwnProperty("id")) config.name = config.id;
        console.log(config);

        // create the iframe
        let iframeTag = document.createElement("iframe");
        iframeTag.name = config.name;
        iframeTag.src = config.url;
        iframeTag.id = config.name;
        iframeTag.classList.add("rama-frame");
        config.parent.appendChild(iframeTag);

        // create the rframe object
        // Is this the correct way to create an object? it works...
        const rframe = {
            tag: iframeTag,
            t: iframeTag,
            // .d & .document are added when the page loads (see below)
            w: iframeTag.contentWindow,
            window: iframeTag.contentWindow,
            name: config.name,
            id: config.name,

            waitForReload: function () {
                return new Promise((resolve) => {
                    iframeTag.addEventListener("load", resolve, { once: true });
                });
            },
            waitFor: function (testFunction, delay) {
                // - kind of hacky implementation with setInterval() ...
                // - You could use MutationObservers here but that seems to be
                //   performance-wise the worse choice
                // - when MutationObservers aren't used there is actually no
                //   reason to define this function on this specific object
                //   rather than global
                return new Promise((resolve) => {
                    if (!delay) delay = 500;

                    let interval = window.setInterval(() => {
                        if (testFunction(rframe)) {
                            window.clearInterval(interval);
                            resolve();
                        }
                    }, delay);
                });
            },
            waitForSelector: function (selector, delay) {
                return this.waitFor(
                    (c) => c.d && !!c.d.querySelector(selector),
                    delay
                );
            },
            close: function () {
                this.tag.parentElement.removeChild(this.tag);
            }
        };
        // add events for the .document attribute (changes at reload)
        iframeTag.addEventListener("load", () => {
            rframe.document = iframeTag.contentDocument;
            // qsa() function
            rframe.document.qsa = function (selector) {
                return Array.from(rframe.document.querySelectorAll(selector));
            };
            rframe.d = rframe.document;
        });
        return rframe;
    },

    clearpage: function () {
        // Not the best practice to put content outside the <body> tag but it
        // enables us in this case to completely switch to the iframe window
        this.stdparent = document.querySelector("html");
        this.loadcss(
            ".rama-frame { width: 100vw; height: 100vh; " +
                "position: fixed; top: 0; left: 0; } " +
                "body { display: none; } " +
                "html { overflow: hidden; } "
        );
    },

    // #################### non-iframe functions ####################
    loadjs: function (url) {
        // modified version of script by Frank Gambino on
        // https://stackoverflow.com/a/39008859
        return new Promise((resolve, reject) => {
            let scriptTag = document.createElement("script");
            scriptTag.src = url;
            scriptTag.addEventListener("load", resolve);
            scriptTag.addEventListener("error", (e) => reject(e.error));
            document.head.appendChild(scriptTag);
        });
    },

    loadcss: function (csstext) {
        let styleTag = document.createElement("style");
        styleTag.innerHTML = csstext;
        document.head.appendChild(styleTag);
    },

    clearcss: function () {
        Array.from(
            document.querySelectorAll("style, link[rel='stylesheet']")
        ).forEach((e) => e.parentElement.removeChild(e));
    }
};
