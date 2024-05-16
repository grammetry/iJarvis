var ws = new WebSocket("ws://localhost:8000/base64");
ws.onmessage = function(event) {
    var image = document.getElementById('base64');
    image.src = "data:image/jpg;base64," + event.data;
};
var ws = new WebSocket("ws://localhost:8000/bytes");
ws.binaryType = 'blob';
ws.onmessage = function(event) {
    var image = document.getElementById('bytes');
    image.src = URL.createObjectURL(event.data);
};