// Declarations
var { Cc, Cu, Ci } = require("chrome");

const {Downloads} = Cu.import("resource://gre/modules/Downloads.jsm");
Cu.import("resource://gre/modules/osfile.jsm")
Cu.import("resource://gre/modules/Task.jsm");
Cu.import("resource://gre/modules/NetUtil.jsm");  
const {FileUtils} = Cu.import("resource://gre/modules/FileUtils.jsm"); 

var data = require("sdk/self").data;
var pageMod = require("sdk/page-mod");
var preferences = require('sdk/simple-prefs').prefs;

// Listener for Gelbooru images
pageMod.PageMod({
    include: "http://gelbooru.com/index.php?page=post&s=view&id=*",
    contentScriptFile: data.url("element-getter.js"),
    onAttach: function(worker) {
        worker.port.emit("getImageGelbooru");
        worker.port.on("gotImageGelbooru", function(data) {
            console.log("Image data: "+data);
            DownloadImage(data);
        });
    }
});

// Listener for Danbooru images
pageMod.PageMod({
    include: "http://danbooru.donmai.us/posts/*",
    contentScriptFile: data.url("element-getter.js"),
    onAttach: function(worker) {
        worker.port.emit("getImageDanbooru");
        worker.port.on("gotImageDanbooru", function(data) {
            console.log("Image data: "+data);
            DownloadImage(data);
        });
    }
});

// Downloader
function DownloadImage(data) {
    Task.spawn(function () {

        // Check for folder presense
        let localFile = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
        let dirPath = OS.Path.join(preferences['imagesDirectory'], data[2]);
        console.log("Dir path: "+dirPath);
        localFile.initWithPath(dirPath);
        if(!localFile.exists()) {
            localFile.create(localFile.DIRECTORY_TYPE,FileUtils.PERMS_DIRECTORY);
        }

        // Download file
        let path = OS.Path.join(preferences['imagesDirectory'], data[2], data[1]);
        console.log("Path: "+path);

        yield Downloads.fetch(data[0], path);
        console.log("Image has been downloaded.");

    }).then(null, Cu.reportError);
}
