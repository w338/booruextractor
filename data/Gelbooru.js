// Image page parsers

// Gelbooru style
//console.log('Gelbooru parser: started');
var element = document.getElementById("image");
if (element != null) {
    //console.log('Gelbooru parser: got element');
    let url = 'https:' + element.getAttribute("src");
    let fileName = url.substring(url.lastIndexOf("/") + 1, url.length);
    let tags = element.getAttribute("alt");

    let response = {
        url: url,
        fileName: fileName,
        folder: window.location.hostname,
        referrer: window.location.href,
        tags: tags
    };

    //console.log('Gelbooru parser: ready to send, '+ JSON.stringify(response));
    //var sending = browser.runtime.sendMessage(response);
    //sending.then(handleResponse, handleError);      
    browser.runtime.sendMessage(response);
}

// function handleResponse(message) {
//   console.log('Gelbooru parser:  sent a response: ${message.response}');
// }

// function handleError(error) {
//   console.log('Gelbooru parser: error: '+error);
// }