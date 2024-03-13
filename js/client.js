const socket = io('http://localhost:8001');
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container")
var audio = new Audio('ting.wav');


const append = (message,position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if (position=='left'){
        audio.play()
    }
}
const appendimg = (message,position)=>{
    const messageElement = document.createElement('div');
    var img = document.createElement("img");
    img.src = `${message}`;
    img.classList.add('imgstyle');
    messageElement.classList.add(position);
    messageElement.appendChild(img);
    messageContainer.append(messageElement);
    if (position=='left'){
        audio.play()
    }
}




function ChooseImage(){
    const imgfile= document.getElementById('imageFile').click();
}

function SendImage(e){
    var file = e.files[0];

    if(!file.type.match("image.*")){
        alert("please select image only");
    }
    else{
        var reader = new FileReader();

        reader.addEventListener("load", function(){
            appendimg(reader.result,'right');
            socket.emit('sendimg',reader.result);
        },false);
        if (file){
            reader.readAsDataURL(file);
        }
    }
}


form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`,'right');
    socket.emit('send', message);
    messageInput.value='';
})

const Name = prompt("Enter your name to join");

socket.emit('new-user-joined', Name);

socket.on('user-joined', Name =>{
    append(`${Name} joined the chat`,'right')
})

socket.on('receive', data =>{
    append(`${data.name}: ${data.message} `,'left')
})
socket.on('receiveimg', data =>{
    appendimg(data,'left');
})

socket.on('left', name =>{
    append(`${name} left the chat `,'right')
})