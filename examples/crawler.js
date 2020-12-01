// this script crawls through all connected pages on the same domain as it
// started and generates one array of all the pages and one of all referenced
// pages on other domains

// run in the console after loading rama.js

// links pointing to a different domain
externalLinks = [];
// links on the same domain, which were already crawled
internalCrawled = [];
// links on the same domain, which have to be crawled
internalNotCrawled = [];

// returns the url of a location object without the URL fragment
// (https://en.wikipedia.org/wiki/URI_fragment)
// -> no page has to be loaded twice
function urlf(location) {
    return location.href.replace(location.hash, "");
}

// Anonymous function wrapper needed for await to work
(async () => {
    // initialize the rama.js client
    rama.clearpage();
    c = rama.new();

    await c.waitForReload();
    internalNotCrawled.push(c.w.location.href);

    while (internalNotCrawled.length > 0) {
        // visit the next page
        let newUrl = internalNotCrawled.shift();
        internalCrawled.push(newUrl);
        c.w.location = newUrl;
        console.log("visiting " + newUrl);
        console.log(
            "internal: " +
                internalCrawled.length +
                " crawled and " +
                internalNotCrawled.length +
                " remaining. external: " +
                externalLinks.length
        );
        await c.waitForReload();

        // get all <a> tags
        links = c.d.qsa("a");

        // filter out all urls of filetypes that are not websites
        links = links.filter((l) => {
            let parts = l.pathname.split(".");

            // just a normal path like /examplefolder/examplesite
            if (parts.length == 1) return true;
            else {
                // file with extension like /examplefolder/examplefile.txt or a
                // weird path like /example.folder/examplesite or
                // /example/.folder/file.txt
                let extension = parts[parts.length - 1];

                // it is actually no extension but some weird path like
                // /example.folder/examplesite
                if (extension.includes("/")) return true;

                // just a website with extension
                if (
                    ["html", "htm", "php", "asp", "aspx", "shtml"].includes(
                        extension
                    )
                )
                    return true;

                // it has to be an evil file
                return false;
            }
        });

        // add the links to the lists if they are not already there
        links.forEach((l) => {
            if (l.hostname != c.w.location.hostname) {
                // external link
                // push to list if not already there
                if (!externalLinks.includes(urlf(l)))
                    externalLinks.push(urlf(l));
            } else {
                if (
                    !internalCrawled.includes(urlf(l)) &&
                    !internalNotCrawled.includes(urlf(l))
                ) {
                    // internal link, which is not already part of the lists
                    internalNotCrawled.push(urlf(l));
                }
            }
        });
    }
    console.log("finished crawling");
})();
