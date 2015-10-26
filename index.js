// Test: jpm run, compile: jpm xpi

// Add-on SDK
var pageMod = require("sdk/page-mod");
var preferences = require('sdk/simple-prefs').prefs;

// Supported sources
var sources = [
    {"filter": "http://gelbooru.com/index.php?page=post&s=view&id=*", "getter": "./gelbooru.js"},
    {"filter": "http://danbooru.donmai.us/posts/*", "getter": "./danbooru.js"},
    {"filter": /.*booru.org.*/, "getter": "./booruorg.js"}
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
                console.log("Image data: "+JSON.stringify(data));
                DownloadImage(data);
            });
        }
    });
}

// Downloader
function DownloadImage(data) {
    
    // Components
    var { Cu } = require("chrome");
    Cu.import("resource://gre/modules/Task.jsm");

    Task.spawn(function () {
        
        // Components
        const {Downloads} = Cu.import("resource://gre/modules/Downloads.jsm");
        Cu.import("resource://gre/modules/osfile.jsm")
        Cu.import("resource://gre/modules/NetUtil.jsm");  

        // Check for folder presense
        let dirPath = OS.Path.join(preferences['imagesDirectory'], data.folder);
        CheckFolder(dirPath);

        // Analyze tags
        let subFolder = "";
        if (preferences['underTags'].length > 0) {
            let underTags = preferences['underTags'].split(" ");
            let tags = data.tags.split(" ");
            for (let uTag of underTags) {
                if (data.tags.indexOf(uTag) != -1) {
                    subFolder = uTag;
                    CheckFolder(OS.Path.join(dirPath, subFolder));
                    break;
                }
            }
        }

        // Download file
        let source = { url: data.url, referrer: data.referrer };
        let path = OS.Path.join(dirPath, subFolder, data.fileName);
        console.log("Path: "+path);
        yield Downloads.fetch(source, path);

    }).then(null, Cu.reportError);
}

// Check fo folder presence and create it, if needed
function CheckFolder(name) {
    
    // Components
    var { Cc, Cu, Ci } = require("chrome");
    Cu.import("resource://gre/modules/osfile.jsm")
    const {FileUtils} = Cu.import("resource://gre/modules/FileUtils.jsm"); 

    // Check for folder presense
    let Dir = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsIFile);
    Dir.initWithPath(name);
    if(!Dir.exists()) {
        Dir.create(Dir.DIRECTORY_TYPE,FileUtils.PERMS_DIRECTORY);
    }
}
