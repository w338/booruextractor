// Image page parsers

// Some booru.org support
self.port.on("getImage", function () {
    var element = document.getElementById("image");
    if (element != null) {
        // Get URL and filename
        let url = element.getAttribute("src");
        if (url.indexOf("?") >= 0)
            url = url.substring(0, url.indexOf("?"));
        let fileName = url.substring(url.lastIndexOf("/") + 1);
        // Get tags
        let tags = "";
        let tags_element = document.getElementById("tags");
        if (tags_element != null)
            tags = tags_element.innerText;
        else
            tags = element.getAttribute("alt");
        // Send it
        self.port.emit("gotImage", {
            url: url,
            fileName: fileName,
            folder: window.location.hostname,
            referrer: window.location.href,
            tags: tags_element.innerText
        });
    }
});
