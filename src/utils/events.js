const { addUser, removeUser, getUser, getUsersInRoom, checkUserInfo, createRoomPin, addUser_prevalidate} = require('./users');
const {generateMessage, systemMessage} = require('./messages')

const chatEvents = (io) => {

    let msgCount = 0;

    io.on('connection', (socket) => {
        console.log('I am hearing sthing');
        //socket.emit('newUser');

        // Doing realtime prevalidation before giving access to chat
        socket.on('preValidate', (userInformationObj, ackowledgeWithCheckResult) => {

            let validationResultObj = {errorMsg:"", validationResult:true}

            if(userInformationObj.username && userInformationObj.roompin){
                const {error, user} = addUser_prevalidate({id: socket.id, ...userInformationObj}) //userInfo = {username, roompin}
                
                if(error){
                    validationResultObj.validationResult = false;
                    validationResultObj.errorMsg = error;
                    
                    return ackowledgeWithCheckResult(validationResultObj)
                } else {
                    return ackowledgeWithCheckResult(validationResultObj)
                }
            } else if(userInformationObj.username){
                const {error} = checkUserInfo(userInformationObj.username);
                if(error){
                    validationResultObj.validationResult = false;
                    validationResultObj.errorMsg = error;
                    return ackowledgeWithCheckResult(validationResultObj)
                } else {
                    return ackowledgeWithCheckResult(validationResultObj)
                }
            }
            
        })
        
        // Join a room
        socket.on('joiningRoom', (userInformationObj, acknowledgeRoomJoin) => {

            const {error, user} = addUser({id: socket.id, ...userInformationObj}) //userInfo = {username, roompin}
  
            if(error){
                return acknowledgeRoomJoin(error)
            }
            // check if room is available
            

            socket.join(user.roompin)
            
            socket.emit('WelcomeUser', systemMessage.welcomeTheUser(user));
            socket.broadcast.to(user.roompin).emit('roomAnnouncement', systemMessage.announceJoiner(user)) // create a message helper later
            io.to(user.roompin).emit('UserList', getUsersInRoom(user.roompin))
            // ackwoledge to client that all is good
            acknowledgeRoomJoin();
        })

        socket.on('initiatingRoom', (userInformationObj, acknowledgeRoomJoin) => {
            // check if username is valid - create a room pin - connect user to room pin 
            const {error} = checkUserInfo(userInformationObj.username);
            
            if(error){
                return acknowledgeRoomJoin(systemMessage.inputError())
            }
            const generatedRoomPin = createRoomPin();

            const functionResult = addUser({id: socket.id, username: userInformationObj.username, roompin: generatedRoomPin})
            if(functionResult.error){
                return acknowledgeRoomJoin(functionResult.error)
            }

            socket.join(generatedRoomPin)
            socket.emit('WelcomeUser', systemMessage.welcomeTheUser(functionResult.user));
        })
        
        // Send a message
        socket.on('userMessageInput', (msg, acknowledgEvent) => {
            //console.log(`Client: ${msg}`);
            const {username, roompin} = getUser(socket.id);
            if(username && roompin){
                io.to(roompin).emit('userMessageOutput', generateMessage(msg, username));
            } 
            acknowledgEvent(Date.now());
       });

       // Track typing
       socket.on('typing', (username) => {
           //socket.broadcast.to(2000).emit('typingNotice', `${username} is typing`);
       });
    
       // Disconnect
        socket.on('disconnect', () => {
           const user = removeUser(socket.id) 
           if(user){
            io.to(user.roompin).emit('roomAnnouncement', systemMessage.announceLeaver(user))
            io.to(user.roompin).emit('UserList', getUsersInRoom(user.roompin))
           }
       })
    })

}

module.exports = chatEvents;