// complete this file later
const generateMessage = (message, username) => { // message from users
  return {
      message,
      username,
      createdAt: new Date().getTime()
  }
}

const systemMessage = {
    welcomeTheUser: function(user){
        return {
            message: `Hello ${user.username}, Welcome to the room ${user.roompin}`
        }
    },
    announceJoiner: function(user){
        return {
            message: `${user.username} just joined this room!`,
            createdAt: new Date().getTime()
        }
    },
    announceLeaver: function(user){
        return {
            message: `${user.username} has left!`,
            createdAt: new Date().getTime()
        }
    },
    indicateMaximumRoomCapacityReached: function(){
       return {
           message: 'The maximum capacity of 5 users have been reached for this room'
       }
    },
    inputError: function(){
        return {
            message: 'Please check your input and try again'
        }
     }
}

module.exports = {
    generateMessage,
    systemMessage
}