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

    // Some booru.org support
    var element = document.getElementById("image");
    if (element != null) {
        let url = element.getAttribute("src");
        let fileName = url.substring(url.lastIndexOf("/") + 1);
        let tags_element = document.getElementById("tags");
        self.port.emit("gotImage", {
            url: url,
            fileName: fileName,
            folder: window.location.hostname,
            referrer: window.location.href,
            tags: tags_element.innerText
        });
    }

    // g.e-hentai.org
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

    // Flickr
    var element = document.getElementsByClassName("modelExport")[0];
    if (element != null) {
        let txt = element.text;
        let txt2 = txt.substring(txt.indexOf('":{"displayUrl"'));
        let txt3 = txt2.substring(txt2.lastIndexOf('"url":"')+11, txt2.lastIndexOf('"url":"')+200);
        let url = "http://"+txt3.substring(0, txt3.indexOf('"')).replace(/\\\//g,'/');
        let fileName = url.substring(url.lastIndexOf("/") + 1);
        self.port.emit("gotImage", {
            url: url,
            fileName: fileName,
            folder: window.location.hostname,
            referrer: window.location.href
        });
    }

});
