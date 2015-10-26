// Gelbooru image page parser
self.port.on("getImage", function () {
    var element = document.getElementById("image");
    if (element != null) {
        let url = element.getAttribute("src");
        let fileName = url.substring(url.lastIndexOf("/") + 1, url.indexOf("?"));
        self.port.emit("gotImage", {
            url: url,
            fileName: fileName,
            folder: "Gelbooru",
            referrer: window.location.href,
            tags: element.getAttribute("alt")
        });
    }
});
