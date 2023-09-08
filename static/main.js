//when clicked on a account it gets reflected on conversation block
//follow requests
//socket
//groups of 2 for personal chat
//groups of upto 50 memebers if possible or less
var chatSocket=0;
var idx=-1
function dateTime()
{
    var now = new Date();
    // Get the current date and time
    var date = now.getDate();
    var month = now.getMonth() + 1;
    var year = now.getFullYear();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();

    // Format the date and time
    var DT = month + "/" + date + "/" + year + " " + hours + ":" + minutes + ":" + seconds;
    return DT
}

function save_chat(msg,owner,receiver){
        const csrftoken = Cookies.get('csrftoken');
        $.post(
            'save_container/',
            {
                data: msg,
                owner:owner,
                receiver:receiver,
                csrfmiddlewaretoken:csrftoken
            }
            );   
}
//receiver is the follower of account user
function receiver_msg(msg,save){
        var originalDiv = document.querySelector("#conversation")
        var clonedDiv = originalDiv.querySelector("#receiver")
        clonedDiv=clonedDiv.cloneNode(true)
        clonedDiv.style.display="block"
        clonedDiv.querySelector("#inner #innerInner #receiver_msg p").innerHTML=msg
        clonedDiv.querySelector("#inner #innerInner #receiver_time p").innerHTML="Mon"
        originalDiv.appendChild(clonedDiv)
        if(save==1){
        save_chat(msg,element.id,user)// msg,sender,receiver
        }
}



//sender is the account user
function sender_msg(msg,save){
    var originalDiv = document.querySelector("#conversation")
    var clonedDiv = originalDiv.querySelector("#sender")
    clonedDiv=clonedDiv.cloneNode(true)
    clonedDiv.style.display="block"
    clonedDiv.querySelector("#inner #innerInner #sender_msg p").innerHTML=msg
    clonedDiv.querySelector("#inner #innerInner #sender_time p").innerHTML="Mon"
    originalDiv.appendChild(clonedDiv)
    if(save==1){
    save_chat(msg,user,element.id)
    }
}
//showing past interactions
function show_past(){
    var myDiv=document.getElementById("conversation").children
    while(2<myDiv.length)
    {
        myDiv[2].remove()
    }
    const request = new XMLHttpRequest();
    var room=[user,document.getElementById("heading_name").innerHTML]
    room.sort()
    const fileName="static/logs/"+room[0]+'-'+ room[1]+".json";
    request.open("GET", fileName);
    request.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
        const past = JSON.parse(this.responseText);
        // console.log(past)
        // do something with the response object
        for (var i=0;i<past.length;i++)
        {
            if(past[i].owner==user)
            sender_msg(past[i].data,0)
            else
            receiver_msg(past[i].data,0)
        }
    }
    };
    request.send();
   
}


//show_past()
//sender_msg("hello how are you?",1)
//receiver_msg("hello I am ishan the name is wrong by the way",1)



//Script starts here

var div = document.querySelector("#conversation #receiver");
div.style.display="none"
var myDiv = document.querySelector("#conversation #sender");
myDiv.style.display = "none";

var user=JSON.parse(document.getElementById('user').textContent);
var usernm=document.querySelector("#username #name span");
usernm.innerHTML=user 

var VisClient=document.querySelector("#profile");
VisClient.querySelector("#client").style.display="none";

var HidClient=document.querySelector("#HidProfile");
HidClient.querySelector("#hclient").style.display="none";


var talked=JSON.parse(document.getElementById('talked').textContent);

var Ntalked=JSON.parse(document.getElementById('Ntalked').textContent);



for (var i=0;i<talked.length;i++)
{
    var cloneDiv=VisClient.querySelector("#client").cloneNode(true)
    cloneDiv.querySelector("#client_name #sidebar-name span").innerHTML=talked[i]
    cloneDiv.setAttribute("id", talked[i]);
    cloneDiv.style.display="block"
    cloneDiv.setAttribute("onclick","profile(this)")
    VisClient.appendChild(cloneDiv)
}
for (var i=0;i<Ntalked.length;i++)
{
    if(Ntalked[i]!=user)
    {
        var cloneDiv=HidClient.querySelector("#hclient").cloneNode(true)
        cloneDiv.querySelector("#hclient_name #sideHbar-name span").innerHTML=Ntalked[i]
        cloneDiv.setAttribute("id",Ntalked[i]);
        cloneDiv.setAttribute("onclick","Hprofile(this)")
        cloneDiv.style.display="block"
        HidClient.appendChild(cloneDiv)
    }
}

function profile(element)
{
    var heading=document.getElementById("heading_name")
    heading.innerHTML=element.id
    var room=[user,element.id]
    room.sort()
    const roomName=room[0]+'-'+ room[1];
    if(chatSocket!=0)
    {
        chatSocket.close()
        chatSocket=0
    }
    chatSocket = new WebSocket(
        'ws://'
        + window.location.host
        + '/'
        + roomName
        + '/'
    );
    chatSocket.onopen=function(e){
        console.log("Opening a connection...");
    }
    chatSocket.onmessage = function(e) {
        var data=JSON.parse(e.data)
        data=data.message.message
        if(data.owner==user)
        sender_msg(data.message,0)
        else
        receiver_msg(data.message,0)
    
    };
    show_past();
}
function Hprofile(element)
{
    const csrftoken = Cookies.get('csrftoken');
    $.post(
        'save_profiles/',
        {
            data: element.id,
            owner:user,
            csrfmiddlewaretoken:csrftoken
        },
        
        ); 
   var cloneChild=HidClient.querySelector("#"+element.id).cloneNode(true)
   cloneChild.setAttribute("onclick","profile(this)")
   VisClient.appendChild(cloneChild);//it contains Hclient name as id, it does not do any harm for now
   HidClient.removeChild(HidClient.querySelector("#"+element.id));
}

//Moving on to chatting now


function send(){

msg=document.querySelector("#reply #comment").value
save_chat(msg,user,document.getElementById("heading_name").innerHTML)
document.querySelector("#reply #comment").value=""
chatSocket.send(JSON.stringify({
    'message': msg,
    'owner':user,
    'receiver':document.getElementById("heading_name").innerHTML
}));
}

function group_join(event){
    if(event.keyCode==13)
    {
        var roomName=document.getElementById("searchText").value
        window.location.pathname =  roomName + '/';
    }
}