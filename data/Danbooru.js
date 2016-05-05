// Image page parsers

// Danbooru style
self.port.on("getImage", function () {
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
});
