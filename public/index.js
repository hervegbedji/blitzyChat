const socket = io();

// HTML ELEMENTS
const usernameTextBox = $('#username');
const enableRoomJoin = $('#enableRoomJoin');
const disableRoomJoin = $('#disableRoomJoin');
const submitAccessRoom = $('#submitAccessRoom');
const roomAccessInputTags = $('#inputTags');
const roomAccessForm = $('#roomAccessForm');
const errorDisplayArea = $('#displayErrors');


const room = document.createElement('input');
const jsCreatedRoomPinTxtBx = $(room);
jsCreatedRoomPinTxtBx.attr({
    id: "roompin",
    type: "number",
    name: "roompin",
    placeholder: "Enter Room Code",
});
jsCreatedRoomPinTxtBx.css('display', 'block').addClass('col-10 form-control').prop('required', true);

// Mustache Template
const errorMessageTemplate = $('#error-message').html();

// Options
function displayErrorMessage(errorMsg){
    const html = Mustache.render(errorMessageTemplate, {
        message: errorMsg,
    });
    errorDisplayArea.addClass('alert alert-warning');
    errorDisplayArea.append(html);
}

function enableChatAccessOptions(){
    enableRoomJoin.on('click', function(){
        $(this).css('display', 'none')
        submitAccessRoom.addClass('joinRoom').removeClass('createRoom')
        roomAccessInputTags.append(jsCreatedRoomPinTxtBx);
        disableRoomJoin.css('display', 'block')
        removeErrorFromScreen()
    })

    disableRoomJoin.on('click', function(){
        $(this).css('display', 'none');
        $('#roompin').remove();
        submitAccessRoom.addClass('createRoom').removeClass('joinRoom')
        enableRoomJoin.css('display', 'block')
    })

}


function preValidateUserInfo(){

    const username = usernameTextBox.val();

    if(submitAccessRoom.hasClass('joinRoom')){
        // joinRoom active means the roompin textbox can be accessed via DOM
        const roompin = $('#roompin').val();
        
        if(username !== "" && roompin !== ""){
            socket.emit('preValidate', {username, roompin}, (validationRsltObj) => { // acknowledgement
               if(!validationRsltObj.validationResult){
                 console.log(validationRsltObj.errorMsg); // display a message to the user
                 displayErrorMessage(validationRsltObj.errorMsg);
                 return;
               }
               location.href = `/chat?username=${username}&roompin=${roompin}`;
            });
            
        }
    } else { // If we are not joining a room then we are starting one
        if(username !== ""){ // creating a room
            socket.emit('preValidate', {username}, (validationRsltObj) => { // acknowledgement
                if(!validationRsltObj.validationResult){
                    console.log(validationRsltObj.errorMsg); // display a message to the user
                    return;
                  }
             });
             location.href = `/chat?username=${username}` 
        }
    }
 
}

function removeErrorFromScreen(){
    usernameTextBox.bind('keyup', function(){
        errorDisplayArea.removeClass('alert alert-warning');
        errorDisplayArea.empty();
    })

    $('#roompin').bind('keyup', function(){
        errorDisplayArea.removeClass('alert alert-warning');
        errorDisplayArea.empty();
    })
}

function disableDefaultFormBehaviorAndValidateInput(){
    roomAccessForm.on('submit', (e) => {
        e.preventDefault()
        preValidateUserInfo()
    })
}


$(document).ready(function(){
    console.log('Herve is ready to make wonders')
    disableDefaultFormBehaviorAndValidateInput()
    enableChatAccessOptions()
    removeErrorFromScreen()
});