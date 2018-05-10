var client;
var userName;

function sendMessage() {
  var name = userName;
  var message = document.getElementById('message').value;
  var topic = $("#chatTopic").text();
  topic = topic.trim();
  if (topic != "none") {
    let time = new Date();
    let arriveTime = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
    var str = name + " : " + message + " [" + arriveTime + "]";
    client.publish("chat/" + topic, str);
    document.getElementById('message').value = "";
  }else{
    alert("Please click setting button");
  }
}

function userSetting() {
  var name = document.getElementById('userName').value;
  var room = $("#room").val();
  var temp = name.trim();
  var topic = $("#chatTopic").text();
  topic = topic.trim();
  if (temp == "") {
    alert("please type name");
  } else {
    userName = temp;
    if (topic == "none") {
      $.ajax({
        type: "GET",
        url: "http://163.180.117.30:8080/proper",
        success: function(data) {
          if (data.ip) {
            let ip = data.ip.slice(0, data.ip.indexOf(":"));
            let port = data.ip.slice(data.ip.indexOf(":") + 1, data.ip.length);
            port = port - 10000;
            let broker = "ws://" + ip + ":" + port;
            $("#chatTopic").text(room);
            client = mqtt.connect(broker);
            client.subscribe("chat/" + room);
            client.on('offline', function() {
                client.end();
		window.location.reload(true);
		alert("Disconnect");
            });
            client.on("message", function(topic, payload) {
              var area = $("#content");
              area.val(area.val() + "\n" + payload);
            });
            alert("Enter the " + room);
          }
        },
        error : function(error){
          alert("Don`t find Broker!");
        }
      });
    } else {
      client.unsubscribe("chat/" + topic);
      $("#chatTopic").text(room);
      client.subscribe("chat/" + room);
      alert("Enter the " + room);
      var area = $("#content");
      area.val("");
    }
  }
}
