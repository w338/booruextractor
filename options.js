function saveOptions(e) {
  e.preventDefault();
  browser.storage.local.set({
    underTags: document.querySelector("#underTags").value
  });
}

function restoreOptions() {

  function setCurrentChoice(result) {
    document.querySelector("#underTags").value = result.underTags || "animated 3d";
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  var getting = browser.storage.local.get("underTags");
  getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);