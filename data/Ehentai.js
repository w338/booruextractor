// Image page parsers

// g.e-hentai.org
self.port.on("getImage", function () {
    var element = document.getElementById("img");
    if (element != null) {
        let gallery = document.querySelector("h1");
        let url = element.getAttribute("src");
        let fileName = url.substring(url.lastIndexOf("/") + 1);
        self.port.emit("gotImage", {
            url: url,
            fileName: fileName,
            folder: window.location.hostname,
            referrer: window.location.href,
            subFolder: gallery.innerText
        });
    }
});
