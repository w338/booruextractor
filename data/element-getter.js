self.port.on("getElements", function (tag) {
    var element = document.getElementById("image");
    if (element != null)
        self.port.emit("gotElement", element.getAttribute("src"));
});