// Image page parsers

// Gelbooru style
    var element = document.getElementById("image");
    if (element != null) {
        let url = element.getAttribute("src");
        let cleanUrl = "https:"+url.substring(0, url.indexOf("?"));
        let fileName = url.substring(url.lastIndexOf("/") + 1, url.indexOf("?"));
        let response = {
            url: cleanUrl,
            fileName: fileName,
            folder: window.location.hostname,
            referrer: window.location.href,
            tags: element.getAttribute("alt")
        };
        browser.runtime.sendMessage(response);
    }
