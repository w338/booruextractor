// Booru-s image page parser
self.port.on("getImage", function () {

    // Danbooru style
    var element = document.getElementById("image-container");
    if (element != null) {
        let url = window.location.origin + element.getAttribute("data-file-url");
        let fileName = url.substring(url.lastIndexOf("/") + 1);
        self.port.emit("gotImage", {
            url: url,
            fileName: fileName,
            folder: window.location.hostname,
            referrer: window.location.href,
            tags: element.getAttribute("data-tags")
        });
    }

    // Gelbooru style
    var element = document.getElementById("image");
    if (element != null) {
        let url = element.getAttribute("src");
        let fileName = url.substring(url.lastIndexOf("/") + 1, url.indexOf("?"));
        self.port.emit("gotImage", {
            url: url,
            fileName: fileName,
            folder: window.location.hostname,
            referrer: window.location.href,
            tags: element.getAttribute("alt")
        });
    }
});
