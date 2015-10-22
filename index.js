
var { Cu } = require("chrome");

const {Downloads} = Cu.import("resource://gre/modules/Downloads.jsm");
Cu.import("resource://gre/modules/osfile.jsm")
Cu.import("resource://gre/modules/Task.jsm");

var data = require("sdk/self").data;
var pageMod = require("sdk/page-mod");
var preferences = require('sdk/simple-prefs').prefs;

pageMod.PageMod({
    include: "http://gelbooru.com/index.php?page=post&s=view&id=*",
    contentScriptFile: data.url("element-getter.js"),
    onAttach: function(worker) {
        worker.port.emit("getElements");
        worker.port.on("gotElement", function(elementContent) {
            console.log("Image URL: "+elementContent);
            GetImageFromURL(elementContent);
        });
    }
});

function GetImageFromURL(url) {
    Task.spawn(function () {

        let fileName = url.substring(url.lastIndexOf("/")+1, url.indexOf("?"));
        let path = OS.Path.join(preferences['imagesDirectory'], fileName);

        console.log("Path: "+path);

        yield Downloads.fetch(url, path);

        console.log("Image has been downloaded.");

    }).then(null, Cu.reportError);
}
    