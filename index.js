// Add-on SDK
var pageMod = require("sdk/page-mod");
var preferences = require('sdk/simple-prefs').prefs;
var { setTimeout } = require("sdk/timers");

// Supported sources
var sources = [
    {"filter": "http://gelbooru.com/index.php?page=post&s=view&id=*","getter": "./gelbooru.js"},
    {"filter": "http://danbooru.donmai.us/posts/*","getter": "./danbooru.js"},
    {"filter": /.*booru.org.*/,"getter": "./booruorg.js"}
];

// Adding listeners
for (let source of sources) {
    pageMod.PageMod({
        include: source["filter"],
        contentScriptWhen: "ready",
        contentScriptFile: source["getter"],
        onAttach: function(worker) {
            worker.port.emit("getImage");
            worker.port.on("gotImage", function(data) {
                console.log("Image data: "+data);
                DownloadImage(data);
            });
        }
    });
}

// Downloader
function DownloadImage(data) {
    
    // Components
    var { Cc, Cu, Ci } = require("chrome");
    Cu.import("resource://gre/modules/Task.jsm");

    Task.spawn(function () {
        
        // Components
        const {Downloads} = Cu.import("resource://gre/modules/Downloads.jsm");
        Cu.import("resource://gre/modules/osfile.jsm")
        Cu.import("resource://gre/modules/NetUtil.jsm");  
        const {FileUtils} = Cu.import("resource://gre/modules/FileUtils.jsm"); 

        // Check for folder presense
        let Dir = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsIFile);
        let dirPath = OS.Path.join(preferences['imagesDirectory'], data[2]);
        Dir.initWithPath(dirPath);
        if(!Dir.exists()) {
            Dir.create(Dir.DIRECTORY_TYPE,FileUtils.PERMS_DIRECTORY);
        }

        // Download file
        let path = OS.Path.join(preferences['imagesDirectory'], data[2], data[1]);
        yield Downloads.fetch(data[0], path);

    }).then(null, Cu.reportError);
}
