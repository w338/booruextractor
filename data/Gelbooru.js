// Image page parsers

// Gelbooru style
var element = document.getElementById("image");
if (element != null) {
    let url = 'https:' + element.getAttribute("src");
    if (url.indexOf('?') >= 0) // support of Safebooru image path notation
    {
        url = url.substring(0, url.indexOf("?"));
    }
    let fileName = url.substring(url.lastIndexOf("/") + 1); //, url.length
    let tags = element.getAttribute("alt");

    let response = {
        url: url,
        fileName: fileName,
        folder: window.location.hostname,
        referrer: window.location.href,
        tags: tags
    };

    //console.log('Gelbooru parser: ready to send, '+ JSON.stringify(response));
    browser.runtime.sendMessage(response);
}
