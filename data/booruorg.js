// booru.org image page parser
self.port.on("getImage", function () {
    var element = document.getElementById("image");
    if (element != null) {
        let url = element.getAttribute("src");
        let fileName = url.substring(url.lastIndexOf("/") + 1, url.indexOf("?"));
        let gallery = url.substring(url.indexOf("booru.org") + 10, url.lastIndexOf("//")) + ".booru.org";
        self.port.emit("gotImage", [url, fileName, gallery, window.location.href]);
    }
});
