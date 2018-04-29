// Image page parsers

// Danbooru style
    var element = document.getElementById("image-container");
    if (element != null) {
        let url = element.getAttribute("data-file-url");
        let fileName = url.substring(url.lastIndexOf("/") + 1);
        try {
          let downloadAnchor = document.querySelector('a[download]');
          fileName = downloadAnchor.href.match(/.*\/([^?]*)/)[1];
        } catch (e) {}
        let response = {
            url: url,
            fileName: fileName,
            folder: window.location.hostname,
            referrer: window.location.href,
            tags: element.getAttribute("data-tags")
        };
        browser.runtime.sendMessage(response);
    }
