// Gelbooru image page parser
self.port.on("getImageGelbooru", function () {
    var element = document.getElementById("image");
    if (element != null) {
        let url = element.getAttribute("src");
        let fileName = url.substring(url.lastIndexOf("/") + 1, url.indexOf("?"));
        self.port.emit("gotImageGelbooru", [url, fileName, "Gelbooru"]);
    }
});

// Danbooru image page parser
self.port.on("getImageDanbooru", function () {
    var element = document.getElementById("image-container");
    if (element != null) {
        let url = "http://danbooru.donmai.us"+element.getAttribute("data-file-url");
        let fileName = url.substring(url.lastIndexOf("/") + 1);
        self.port.emit("gotImageDanbooru", [url, fileName, "Danbooru"]);
    }
});