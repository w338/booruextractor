// Danbooru image page parser
self.port.on("getImage", function () {
    var element = document.getElementById("image-container");
    if (element != null) {
        let url = "http://danbooru.donmai.us"+element.getAttribute("data-file-url");
        let fileName = url.substring(url.lastIndexOf("/") + 1);
        self.port.emit("gotImage", {
            url: url,
            fileName: fileName,
            folder: "Danbooru",
            referrer: window.location.href,
            tags: element.getAttribute("data-tags")
        });
    }
});
