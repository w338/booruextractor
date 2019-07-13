function log() {
  // Uncomment for debug output
  // console.log.apply(console, arguments);
}

// Detect location changes.
// Sadly, watching for pushstate events isn't enough :(
let oldLocation = window.location.href;
setInterval(() => {
  if (window.location.href !== oldLocation) {
    log('setInterval detected location change');
    window.dispatchEvent(new Event('locationchange'))
    oldLocation = window.location.href;
  }
}, 250);

function downloadUrl(url, tags) {
   let fileName = url.substring(url.lastIndexOf("/") + 1);
   let response = {
       url: url,
       fileName: fileName,
       folder: window.location.hostname,
       referrer: window.location.href,
       tags: tags
   };
   // Pixiv needs us to load the image in a "normal way."
   // This puts it in the browser cache, so then we can download it.
   let img = document.createElement('img');
   let result = new Promise((resolve) => {
     img.addEventListener('load', () => {
       log('downloading', url);
       browser.runtime.sendMessage(response);
       resolve(img);
     })
   });
   img.setAttribute('src', url);
   // img.setAttribute('width', 0);
   // img.setAttribute('height', 0);
   // document.body.appendChild(img);
   return result;
}

let image_extracted = false;
let started = false;
function start() {
  if (started) {
    return;
  }
  started = true;
  let intervalId = setInterval(() => {
     let element = document.querySelector('a[href$=".png"]');
     log('png element', element);
     if (element === null) {
         element = document.querySelector('a[href$=".jpg"]');
         log('jpg element', element);
     }
     log('final element', element);
     if (element != null) {
         let tags = [];
         let tag_spans = document.querySelectorAll('figcaption footer span');
         for (let tag_span of tag_spans) {
           tags.push(tag_span.innerText.replace(' ', '_'));
         }
         log('tags', tags);
         tags = tags.join(' ');
         let image_count_div = document
           .querySelector('.gtm-manga-viewer-preview-modal-open');
         let number_of_images = 1;
         if (image_count_div !== null) {
           log("Detected multiple images.");
           log(image_count_div);
           log(image_count_div.innerText);
           number_of_images = parseInt(image_count_div
             .innerText
             .match(/\/(\d+)/)[1]);
         } else {
           log("Did not detect multiple images.");
         }
         log(`Number of images: ${number_of_images}`)
         let url = element.getAttribute("href");
         for (let i = 0; i < number_of_images; i++) {
           let subUrl = url.replace('_p0.', `_p${i}.`);
           downloadUrl(subUrl, tags);
         }
         clearInterval(intervalId);
         started = false;
     }
  }, 250);
}

window.addEventListener('locationchange', () => {
  log("location change start");
  start();
});
log("normal start");
start();
