// Image page parsers

// Flickr
    var element = document.getElementsByClassName("modelExport")[0];
    if (element != null) {
        let txt = element.text;
        let txt2 = txt.substring(txt.indexOf('":{"displayUrl"'));
        let txt3 = txt2.substring(txt2.lastIndexOf('"url":"')+11, txt2.lastIndexOf('"url":"')+200);
        let url = "http://"+txt3.substring(0, txt3.indexOf('"')).replace(/\\\//g,'/');
        let fileName = url.substring(url.lastIndexOf("/") + 1);
        let response = {
            url: url,
            fileName: fileName,
            folder: window.location.hostname,
            referrer: window.location.href
        };
        browser.runtime.sendMessage(response);
    }
