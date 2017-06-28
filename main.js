// Constants
var maxPathLength = 256;

// Set user tags
var underTags = '';

// Set listener
browser.runtime.onMessage.addListener(download);

function download(message) {
    console.log("Image data: " + JSON.stringify(message));
    DownloadImage(message);
}

// Downloader
function DownloadImage(data) {

        // Lets start constructing file path
        let fileName = CleanFileName(data.fileName);
        dirPath = 'booruextractor\\' + data.folder;

        // Check for subFolder
        if (data.subFolder != null) {
            if (data.subFolder.length > 0) {
                dirPath = CheckFolder(dirPath, fileName, data.subFolder);
            }
        }

        // Analyze tags
        opts = browser.storage.local.get("underTags");
        opts.then(onGot, onError);
        if (underTags.length > 0 & data.tags != null) {
            let tags = data.tags.split(" ");
            let crossTags = underTags.split(" ").filter(function (n) {
                return tags.indexOf(n) != -1
            });
            if (crossTags.length > 0) {
                dirPath = CheckFolder(dirPath, fileName, crossTags[0]);
            }
        }

        // Download file
        let path = dirPath + "\\" + fileName;
        console.log("Path: " + path);
        
        var downloading = browser.downloads.download({
            url: data.url,
            filename: path,
            conflictAction: 'overwrite',
            saveAs: false
        });
}

// Check for folder presence and create it, if needed
function CheckFolder(currentDir, fileName, addOn) {

    // Check for max length, allowed by OS
    var cleanAddOn = CleanDirectory(addOn);
    if ((currentDir + '\\' + cleanAddOn + '\\' + fileName).length > maxPathLength) {
        return currentDir;
    }

    newCurrentDir = currentDir + '\\' + cleanAddOn;

    return newCurrentDir;
}

function CleanFileName(name) {
    return name.replace(/[<>:"\/\\|?*\x00-\x1F]/gi, '_'); // Strip any special characters
}

function CleanDirectory(name) {
    return name.replace(/[<>"|?*\x00-\x1F]/gi, '_'); // Strip any special characters
}

function onGot(item) {
  console.log('Undertags retrieved: '+JSON.stringify(item));
  underTags = item;
}

function onError(error) {
  console.log(`Error: ${error}`);
}