// Test: jpm run, compile: jpm xpi

// Add-on SDK
var pageMod = require("sdk/page-mod");
var preferences = require('sdk/simple-prefs').prefs;

// Constants
var maxPathLength = 256;

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
    {filter: "https://chan.sankakucomplex.com/post/show/*",parser: "Sankaku"},
    {filter: "https://idol.sankakucomplex.com/post/show/*",parser: "Sankaku"},
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
        
        // Lets start constructing file path
        let fileName = CleanFileName(data.fileName);
        let dirPath = OS.Path.normalize(CleanDirectory(preferences['imagesDirectory']));
        CheckFolder(dirPath);

        // Check for folder presense
        let folder = CleanDirectory(data.folder);
        if ( (fileName+dirPath+folder).length < maxPathLength ) {
            dirPath = OS.Path.join(dirPath, folder);
            CheckFolder(dirPath); 
        }

        // Check for subFolder
        if (data.subFolder != null) {
            if (data.subFolder.length > 0) {
                let subFolder = CleanDirectory(data.subFolder);
                if ( (fileName+dirPath+subFolder).length < maxPathLength ) {
                    dirPath = OS.Path.join(dirPath, subFolder);
                    CheckFolder(dirPath);
                }
            }
        }

        // Analyze tags
        if (preferences['underTags'].length > 0 & data.tags != null) {
            let tags = data.tags.split(" ");
            let crossTags = preferences['underTags'].split(" ").filter(function(n) {
                return tags.indexOf(n) != -1
            });
            if (crossTags.length > 0) {
                let crossTag = CleanDirectory(crossTags[0]);
                if ( (fileName+dirPath+crossTag).length < maxPathLength ) {
                    dirPath = OS.Path.join(dirPath, crossTag);
                    CheckFolder(dirPath);
                }
            }
        }

        // Download file
        let source = { url: data.url, referrer: data.referrer };
        let path = OS.Path.join(dirPath, fileName);
        console.log("Path: "+path);
        try {
            yield Downloads.fetch(source, path);
        } catch (ex) {
            console.log("Download error: "+ex);
        }

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

function CleanFileName(name) {
    return name.replace(/[<>:"\/\\|?*\x00-\x1F]/gi, '_'); // Strip any special characters
}

function CleanDirectory(name) {
    return name.replace(/[<>"|?*\x00-\x1F]/gi, '_'); // Strip any special characters
}