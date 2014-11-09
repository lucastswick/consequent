var uncontextDataWatcher;

UncontextDataWatcher = function(sketch) {

  var socket;
  var socketData;
  var socketTimeout;
  var div = document.getElementById("data");

  function resetSocket() {
    socket = new WebSocket('ws://duel.uncontext.com');
    
    socket.onclose = function (event) {
      socketTimeout = setTimeout(resetSocket, 2000);
      // div.innerHTML = 'close';
    }
    
    socket.onopen = function (event) {
      if (socketTimeout) {
        clearTimeout(socketTimeout);
      }
      // div.innerHTML = 'open1';
    }

    socket.onmessage = function (event) {
      var tempJSON = JSON.parse(event.data);

      match = true;
      
      if (socketData != tempJSON) {

        socketData = tempJSON;

        sketch.onDataChange(socketData);

      }

      // console.log(tempJSON);
      // div.innerHTML = event.data;
    }
  }
  resetSocket();
}