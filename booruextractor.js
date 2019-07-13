let maxPathLength = 255;
let max_suspicious_bytes = 1024;

function log() {
  // Uncomment for debug output
  // console.log.apply(console, arguments);
}

let underTags = '';
var getting =
browser.storage.local.get("underTags")
    .then((result) => {
      underTags = result.underTags || "animated 3d";
    },
    (error) => {
        log(`Error restoring options: ${error}`);
    });

// Set listeners
browser.runtime.onMessage.addListener(download);
browser.storage.onChanged.addListener(updateOptions);

// Update options, if changed
function updateOptions(changes, area) {
    if (area == 'local') {
        var changedItems = Object.keys(changes);
        for (let item of changedItems) {
            if (item == 'underTags') {
                underTags = changes[item].newValue;
            }
        }
    }
}

function download(message) {
    log("Image data: " + JSON.stringify(message));
    DownloadImage(message);
}

// Downloader
async function DownloadImage(data) {

    // Lets start constructing file path
    let fileName = CleanFileName(data.fileName);
    let dirPath = 'booruextractor/' + data.folder;

    // Check for subFolder
    if (data.subFolder != null) {
        if (data.subFolder.length > 0) {
            dirPath = CheckFolder(dirPath, fileName, data.subFolder);
        }
    }

    // Analyze tags
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
    let path = dirPath + '/' + fileName;
    log('download path: ' + path);

    function download_item_is_good(download_item) {
      return download_item.totalBytes > max_suspicious_bytes;
    }

    async function download() {
      let previous_downloads = await browser.downloads.search({url: data.url});
      if (previous_downloads.length > 0 &&
          download_item_is_good(previous_downloads[0])) {
        log(`Skipping download of ${data.url}`)
        return previous_downloads[0];
      }
      let downloadId = await browser.downloads.download({
          url: data.url,
          filename: path,
          conflictAction: 'overwrite',
          saveAs: false
      });
      while (true) {
        let downloadItems = await browser.downloads.search({id: downloadId});
        let downloadItem = downloadItems[0];
        if (downloadItem.state === "complete") {
          return downloadItem;
        } else if (downloadItem.state === "interrupted") {
          throw TypeError(`Download of ${data.url} was interrupted.`);
        }
      }
    }

    try {
      // Probably just an error message, retry.
      let downloadItem = await download();
      for (let i = 0; i < 2; i++) {
        if (!download_item_is_good(downloadItem)) {
          downloadItem = await download();
        }
      }
      if (!download_item_is_good(downloadItem)) {
        let msg = `Image ${data.url} is suspiciously short.`;
        console.error(msg);
        browser.notifications.create({
          type: "basic",
          title: "Image Download (Probably) Failed",
          message: msg
        });
      }
    } catch (e) {
      let msg = `Image ${data.url} could not be downloaded: ${e.message}`;
      console.error(msg);
      browser.notifications.create({
        type: "basic",
        title: "Image Download Failed",
        message: msg
      });
    }
}

// Check for folder presence and create it, if needed
function CheckFolder(currentDir, fileName, addOn) {

    // Check for max length, allowed by OS
    let cleanAddOn = CleanDirectory(addOn);
    if ((currentDir + '/' + cleanAddOn + '/' + fileName).length > maxPathLength) {
        return currentDir;
    }

    let newCurrentDir = currentDir + '/' + cleanAddOn;

    return newCurrentDir;
}

function CleanFileName(name) {
    return name.replace(/[<>:"\/\\|?*\x00-\x1F]/gi, '_'); // Strip any special characters
}

function CleanDirectory(name) {
    return name.replace(/[<>"|?*\x00-\x1F]/gi, '_'); // Strip any special characters
}
