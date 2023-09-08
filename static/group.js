//receiver is the follower of account user
function receiver_msg(msg,receiver){
    var originalDiv = document.querySelector("#conversation")
    var clonedDiv = originalDiv.querySelector("#receiver")
    clonedDiv=clonedDiv.cloneNode(true)
    clonedDiv.style.display="block"
    clonedDiv.querySelector("#inner #innerInner #receiver_msg p").innerHTML=msg
    clonedDiv.querySelector("#inner #innerInner #receiver_time p").innerHTML=receiver
    originalDiv.appendChild(clonedDiv)
}



//sender is the account user
function sender_msg(msg){
    var originalDiv = document.querySelector("#conversation")
    var clonedDiv = originalDiv.querySelector("#sender")
    clonedDiv=clonedDiv.cloneNode(true)
    clonedDiv.style.display="block"
    clonedDiv.querySelector("#inner #innerInner #sender_msg p").innerHTML=msg
    clonedDiv.querySelector("#inner #innerInner #sender_time p").style.display="none"
    originalDiv.appendChild(clonedDiv)
}


//Main script starts here
var div = document.querySelector("#conversation #receiver");
div.style.display="none"
var myDiv = document.querySelector("#conversation #sender");
myDiv.style.display = "none";
var user=JSON.parse(document.getElementById('user').textContent);
var roomName = JSON.parse(document.getElementById('room-name').textContent);

var chatSocket = new WebSocket(
    'ws://'
    + window.location.host
    + '/'
    + roomName
    + '/'
);

chatSocket.onopen=function(e){
    console.log("Opening a connection...");
}

function send(){

    msg=document.querySelector("#reply #comment").value
    document.querySelector("#reply #comment").value=""
    chatSocket.send(JSON.stringify({
        'message': msg,
        'owner':user,
        'receiver':document.getElementById("heading_name").innerHTML
    }));
}
chatSocket.onmessage = function(e) {
    var data=JSON.parse(e.data)
    data=data.message.message
    if(data.owner==user)
    sender_msg(data.message)
    else
    receiver_msg(data.message,data.owner)

};

var title=document.querySelector("#heading_name a").innerHTML=roomName

chatSocket.onclose = function(e) {
    console.error('Chat socket closed unexpectedly');
};

function leave_group(){
    chatSocket.close()
}
