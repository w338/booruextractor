let image_extracted = false;
let intervalId = setInterval(() => {
   let element = document.querySelector('a[href$=".png"]');
   console.log('png element', element);
   if (element === null) {
       element = document.querySelector('a[href$=".jpg"]');
       console.log('jpg element', element);
   }
   console.log('final element', element);
   if (element != null) {
       let url = element.getAttribute("href");
       let fileName = url.substring(url.lastIndexOf("/") + 1);
       let tags = [];
       let tag_spans = document.querySelectorAll('figcaption footer span');
       for (let tag_span of tag_spans) {
         tags.push(tag_span.innerText.replace(' ', '_'));
       }
       console.log('tags', tags);
       let response = {
           url: url,
           fileName: fileName,
           folder: window.location.hostname,
           referrer: window.location.href,
           tags: tags.join(' ')
       };
       console.log('downloading', url);
       browser.runtime.sendMessage(response);
       clearInterval(intervalId);
   }
}, 250);
