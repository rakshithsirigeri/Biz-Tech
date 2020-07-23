var base64 = require('base-64');
var fs = require('fs');
var spawn = require("child_process").spawn;


const stream = (socket)=>{
    socket.on('subscribe', (data)=>{
        //subscribe/join a room
        socket.join(data.room);
        socket.join(data.socketId);

        //Inform other members in the room of new user's arrival
        if(socket.adapter.rooms[data.room].length > 1){
            socket.to(data.room).emit('new user', {socketId:data.socketId , user: data.username});
        }
    });


    socket.on('newUserStart', (data)=>{
        socket.to(data.to).emit('newUserStart', {sender:data.sender,user:data.user});
    });


    socket.on('sdp', (data)=>{
        socket.to(data.to).emit('sdp', {description: data.description, sender:data.sender});
    });


    socket.on('ice candidates', (data)=>{
        socket.to(data.to).emit('ice candidates', {candidate:data.candidate, sender:data.sender});
    });

    socket.on('base64 file', function (msg) {
        console.log('received base64 file from' + msg.username);
        //saving the image on the server
        var file = msg.file;
        var base64Data = file.replace(/^data:image\/png;base64,/, "");
  
        fs.writeFileSync("out.png", base64Data, 'base64');
        var secret_message = msg.fileName.split(".png").pop();
        var process = spawn('python3',["c:\\Users\\sathvik\\Desktop\\badword\\enc.py",
                                    secret_message ] );
        process.on('close', () => {
          var bitmap = fs.readFileSync('encoded-out.png');
          var temp = new Buffer(bitmap).toString('base64');
          var enc_base64 = "data:image/png;base64," + temp;
        // socket.broadcast.emit('base64 image', //exclude sender
          socket.to(msg.room).emit('base64 file',{
            sender: msg.username,
            file: enc_base64,
            fileName: msg.fileName
          }
      );
      });
      });
    socket.on('chat', (data)=>{
        socket.to(data.room).emit('chat', {sender: data.sender, msg: data.msg});
    });
    socket.on('removeParticipant', (data)=>{
        console.log('remive'+ data.sender)
        socket.to(data.room).emit('removeParticipant', {sender: data.sender});
    });

    socket.on('typingMsg',(data)=>{
        socket.to(data.room).emit('typingMsg',data);
    })
}

module.exports = stream;