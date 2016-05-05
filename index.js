// Test: jpm run, compile: jpm xpi

// Add-on SDK
var pageMod = require("sdk/page-mod");
var preferences = require('sdk/simple-prefs').prefs;

// Supported sources
var sources = [
    {filter: "http://gelbooru.com/index.php?page=post&s=view&id=*",parser: "Gelbooru"},
    {filter: "http://danbooru.donmai.us/posts/*",parser: "Danbooru"},
    {filter: "http://safebooru.donmai.us/posts/*",parser: "Danbooru"},
    {filter: "http://safebooru.org/index.php?page=post&s=view&id=*",parser: "Danbooru"},
    {filter: "http://donmai.us/posts/*",parser: "Danbooru"},
    {filter: /.*booru.org.*/,parser: "Booru"},
    {filter: "https://www.flickr.com/photos/*",parser: "Flickr"},
    {filter: "http://g.e-hentai.org/*",parser: "Ehentai"},
    {filter: "https://chan.sankakucomplex.com/post/show/*",parser: "Gelbooru"},
];

// Adding listeners
for (let source of sources) {
    pageMod.PageMod({
        include: source.filter,
        contentScriptWhen: "ready",
        contentScriptFile: "./"+ source.parser +".js",
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

        // Check for subFolder
        if (data.subFolder != null) {
            if (data.subFolder.length > 0) {
                dirPath = OS.Path.join(dirPath, data.subFolder);
                CheckFolder(dirPath);
            }
        }

        // Analyze tags
        if (preferences['underTags'].length > 0 & data.tags != null) {
            let tags = data.tags.split(" ");
            let crossTags = preferences['underTags'].split(" ").filter(function(n) {
                return tags.indexOf(n) != -1
            });
            if (crossTags.length > 0) {
                dirPath = OS.Path.join(dirPath, crossTags[0]);
                CheckFolder(dirPath);
            }
        }

        // Download file
        let source = { url: data.url, referrer: data.referrer };
        let path = OS.Path.join(dirPath, data.fileName);
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
