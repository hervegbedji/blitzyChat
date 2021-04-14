const users = [];
const rooms = [];

const checkUserNameFormat = (a) => {
    return true
}

const checkUserInfo = (username, roompin) => {

    if((typeof username !== 'undefined')){
        username = username.trim().toLowerCase();
        if(username === ''){
            return {
                error: 'Some needed information are missing from your submission. Please check the form and try again'
            };
        }
    }

    if((typeof roompin !== 'undefined')){
        roompin = roompin.trim().toLowerCase();
        if(roompin === ''){
            return {
                error: 'Some needed information are missing from your submission. Please check the form and try again'
            };
        }
    }
    

    let userObj = {}
    if(username){ userObj.username = username}
    if(roompin){ userObj.roompin = roompin}
     
    return userObj;
}

const removeUser = (id) => {
    let removedUser;
    const indexToBeRemoved = users.findIndex(user => user.id === id)

    if(indexToBeRemoved !== -1){
       removedUser = users.splice(indexToBeRemoved, 1)[0]
    }
    return removedUser;
}

const getUser = (id) => {
    return users.find((user) => user.id === id);
}

const getUsersInRoom = (roompin) => {
    roompin = roompin.trim().toLowerCase();

    return users.filter((user) => user.roompin === roompin)

    // Another method is to do users.filter((user) => user.room === room). filters out values for which predicate isn't true. So only users in the room we are looking for will be returned
}

const addUser = ({id, username, roompin}) => {

    const {error} = checkUserInfo(username, roompin);

    if(error){ return error;}

    // Check for existing user 
    const existingUser = users.find((user) => {
       return user.roompin === roompin && user.username === username
    })

    if(existingUser){
        return { error: `${username} is in use`}
    }

    // Check if room exists
    const existingRoom = rooms.find((room) => {return room === roompin})
 
     if(!existingRoom){
         return { error: `${roompin} doesn't seem to be a valid room `}
     }
    // Check for number of users in a room
    if(getUsersInRoom(roompin).length >= 5){
            return { error: `The user limit for room ${roompin} has been reached check later or contact the one who invited you please.`}
    }

    // Store user 
    const user = {id, username, roompin}
    users.push(user);
    return {user};
}

const addUser_prevalidate = ({id, username, roompin}) => {

    const {error} = checkUserInfo(username, roompin);

    if(error){ return error;}

    // Check for existing user 
    const existingUser = users.find((user) => {
       return user.roompin === roompin && user.username === username
    })

    if(existingUser){
        return { error: `The ${username} pseudo is already in use for the room ${roompin}`}
    }

    // Check if room exists
    const existingRoom = rooms.find((room) => {return room === roompin})
 
    if(!existingRoom){
            return { error: `${roompin} doesn't seem to be a valid room `}
    }

    // Check for number of users in a room
    if(getUsersInRoom(roompin).length >= 5){
        return { error: `The user limit for room ${roompin} has been reached check later or contact the one who invited you please.`}
    }

    // Store user 
    const user = {id, username, roompin}
    //users.push(user); - - No need to actually add the user. This is just for prevalidation purpose
    return {user};
}

const createRoomPin = () => {
    let roompin = Math.floor(Math.random() * new Date().getTime());
    roompin = roompin.toString().substr(8);
    rooms.push(roompin);
    return roompin;
}


module.exports = {
   addUser,
   removeUser,
   getUser,
   getUsersInRoom,
   checkUserInfo,
   createRoomPin,
   addUser_prevalidate
}