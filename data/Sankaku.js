// Image page parsers

// Gelbooru style
self.port.on("getImage", function () {
    var element = document.getElementById("image");
    if (element != null) {
        let url = element.getAttribute("src");
        let cleanUrl = "https:"+url.substring(0, url.indexOf("?"));
        let fileName = url.substring(url.lastIndexOf("/") + 1, url.indexOf("?"));
        self.port.emit("gotImage", {
            url: cleanUrl,
            fileName: fileName,
            folder: window.location.hostname,
            referrer: window.location.href,
            tags: element.getAttribute("alt")
        });
    }
});
