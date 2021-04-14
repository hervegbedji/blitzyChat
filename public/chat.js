const socket = io();

// HTML ELEMENTS
const locationBtn = $('#send-location');
const submit = $('.submitBtn');
const messageInputArea = $('#theMessage');
const messageDisplayArea = $('#displayMessages');
const leaveChatBtn = $('#leaveChat');
const userListContainer = $('#userList');

// Mustache Template
const userMessageTemplate = $('#message-template').html();
const systemMessageTemplate = $('#system-template').html();
const userListTemplate = $('#userlist-template').html()

// Options
const {username, roompin} = Qs.parse(location.search, {ignoreQueryPrefix: true});

function joinRoom(){
    if(username && roompin){ // joining a room
        socket.emit('joiningRoom', {username, roompin}, (error) => { // acknowledgement
           if(error){
               alert(error)
               location.href = '/'
           }
        });
    } else if(username){ // creating a room
        socket.emit('initiatingRoom', {username}, (errorObj) => { // acknowledgement
            if(errorObj){
                alert('There was an error with the input')
                location.href = '/'
            }
         });  
    } else {
        // redirect to index page
    }
}

function leaveRoom(){
   leaveChatBtn.on('click', function(){
       location.href = '/'
       //window.location.replace('http://localhost:3000')
   })
}

function displayUserMessage(messageObj){
    const html = Mustache.render(userMessageTemplate, {
        message: messageObj.message,
        username: messageObj.username,
        createdAt: moment(messageObj.createdAt).format('h:mm a',)
    });
    messageDisplayArea.append(html);
}

function displaySystemMessage(msgFromServer){
    const html = Mustache.render(systemMessageTemplate, {
        message: msgFromServer,
    });
    messageDisplayArea.append(html);
}

function displayUserList(usersArray){
    console.log(`users array is ${usersArray}`)
    const html = Mustache.render(userListTemplate, 
        {users: usersArray }); // this is not rendering on my page
    userListContainer.html(html); 
}

function listenToEventsFromServer(){

    socket.on('WelcomeUser', (messageObj) => {
        displaySystemMessage(messageObj.message);
    })

    socket.on('MessageThreadUpdate', (msgString) => {
        // display data in chat window
        displaySystemMessage(msgString);
   })

    socket.on('typingNotice', (notice) => {
        displaySystemMessage(notice);
   })

    socket.on('userMessageOutput', (messageObj) => {
        displayUserMessage(messageObj);
        // display timestamp later
    })

    socket.on('roomAnnouncement', (messageObj) => {
        displaySystemMessage(messageObj.message)
        //console.log(msg);
        
    })

    socket.on('UserList', (usersArray) => {
       displayUserList(usersArray)
    })
}

function sendMessage(){
    submit.on('click', function(e){
        e.preventDefault();
        //console.log(msg.val());
        socket.emit('userMessageInput', messageInputArea.val(), (deliveryDate) => {
            // deliveryStatusStr = `The message was delivered on ${deliveryDate}`;
            let deliveryStatusStr = '';
            displaySystemMessage(deliveryStatusStr);
            messageInputArea.val('');
        });
    })
}

function trackTyping(){
   const msgTxtBox = messageInputArea;
   msgTxtBox.on('keyup', () => {
       socket.emit('typing', username);
   })
}

function shareLocation(){
    locationBtn.on('click', function(){
        if(!navigator.geolocation){
            return alert('Geolocation is not supported by your browswer');
        }

        navigator.geolocation.getCurrentPosition((position) => {
            console.log(position);
            var location = {};
            location.lat = position.coords.latitude;
            location.long = position.coords.longitude;

            socket.emit('locationToServer', location);
        });



    }); // onClick
}

$(document).ready(function(){
    console.log('Herve is ready to make wonders')
    sendMessage();
    listenToEventsFromServer();
    shareLocation();
    joinRoom();
    trackTyping();
    leaveRoom();
});