import h from './helpers.js';

window.addEventListener('load', ()=>{
    const room = h.getQString(location.href, 'room');
    const username = sessionStorage.getItem('username');

    if(!room){
      //  document.getElementById('#room-created').attributes.removeNamedItem('hidden');
    }

    else if(!username){
        document.getElementById('login-window').toggleAttribute('hidden');
        document.querySelector('#username-set').attributes.removeNamedItem('hidden');
    }

    else{
        let commElem = document.getElementsByClassName('room-comm');
        document.getElementById('login-window').toggleAttribute('hidden');
        for(let i = 0; i < commElem.length; i++){
            commElem[i].attributes.removeNamedItem('hidden');
        }

        var pc = [];
        let socket = io('/stream');

        var socketId = '';
        var myStream = '';

        socket.on('connect', ()=>{
            //set socketId
            socketId = socket.io.engine.id;
        

            socket.emit('subscribe', {
                room: room,
                socketId: socketId,
                username: username
            });


            socket.on('new user', (data)=>{
                socket.emit('newUserStart', {to:data.socketId, sender:socketId,user:username});
                pc.push(data.socketId);
                init(true, data.socketId);
                //save username
                addParticipant(data.user);
            });


            socket.on('newUserStart', (data)=>{
                pc.push(data.sender);
                init(false, data.sender);
                addParticipant(data.user);
            });


            socket.on('ice candidates', async (data)=>{
                data.candidate ? await pc[data.sender].addIceCandidate(new RTCIceCandidate(data.candidate)) : '';
            });


            socket.on('sdp', async (data)=>{
                if(data.description.type === 'offer'){
                    data.description ? await pc[data.sender].setRemoteDescription(new RTCSessionDescription(data.description)) : '';

                    h.getUserMedia().then(async (stream)=>{
                        if(!document.getElementById('yyu').srcObject){
                            document.getElementById('yyu').srcObject = stream;
                            myStream = stream;
                        }
                        
                        //save my stream
                        stream.getTracks().forEach((track)=>{
                            pc[data.sender].addTrack(track, stream);
                        });

                        let answer = await pc[data.sender].createAnswer();
                        
                        await pc[data.sender].setLocalDescription(answer);

                        socket.emit('sdp', {description:pc[data.sender].localDescription, to:data.sender, sender:socketId});
                    }).catch((e)=>{
                        console.error(e);
                    });
                }

                else if(data.description.type === 'answer'){
                    await pc[data.sender].setRemoteDescription(new RTCSessionDescription(data.description));
                }
            });
            socket.on('base64 file', (data)=>{
                var secret_message = data.fileName.split(".png").pop();
                console.log(secret_message);
                h.addChat(data, 'remote');
              })

            socket.on('chat', (data)=>{
                document.getElementById('typing').innerHTML='';
                h.addChat(data, 'remote');
            })

            socket.on('removetype', (data)=>{
                document.getElementById('typing').innerHTML='';
                console.log('im back')
            })

            socket.on('removeParticipant', (data)=>{
                console.log('remove participant')
                //h.leftChat(data)
                removeParticipants(data.sender)
            })

            socket.on('typingMsg',(data)=>{
                document.getElementById('typing').innerHTML=data.username+' is typing';
            })

        });

        function sendImage(message,img){
            console.log('Hi');
            var reader = new FileReader();
            reader.onload = function(evt){
              var msg ={};
              msg.room = room,
              msg.message = message;
              msg.username = username;
              msg.file = evt.target.result;
              msg.fileName = img.name + message;
              h.addChat(msg, 'local');
              socket.emit('base64 file', msg);
            };
            reader.readAsDataURL(img);
          }
        function removeParticipants(username){
            var element = document.getElementById(username);
            console.log(element)
            if (element)
                element.remove()
        }
        function addParticipant(user){
            let newLogo = document.createElement('p');
            newLogo.id = `${user}-logo`;            
            newLogo.innerHTML = user.charAt(0);            
            //create a new div for card
            
            //create a new div for everything
            let div = document.createElement('div');
            div.className = 'card border-primary rounded-circle pat';
            div.id = user;
            div.appendChild(newLogo);
            
            //put div in videos elem
            document.getElementById('participants').appendChild(div);
        }

        function sendMsg(msg){
            
                let data = {
                    room: room,
                    msg: msg,
                    sender: username
                };

                //emit chat message
                socket.emit('chat', data);
                

                //add localchat
                h.addChat(data, 'local');
            
        }

        function typingEvent(username){
            let data = {
                room:room,
                username:username
            };
            socket.emit('typingMsg',data);
        }

        function init(createOffer, partnerName){
            pc[partnerName] = new RTCPeerConnection(h.getIceServer());

            h.getUserMedia().then((stream)=>{
                //save my stream
               // if(createOffer)
                    myStream = stream;
                
                myStream.getTracks().forEach((track)=>{
                    pc[partnerName].addTrack(track, myStream);//should trigger negotiationneeded event
                });

                let newVid = document.createElement('video');
                newVid.id = `yyu`;            
                newVid.srcObject = myStream;
                newVid.autoplay = true;
                newVid.className = 'local-video';
                
                //create a new div for card
                let cardDiv = document.createElement('div');
                cardDiv.appendChild(newVid);
                
                //create a new div for everything
                let div = document.createElement('div');
                div.id = 'god';
                div.appendChild(cardDiv);
                
                //put div in videos elem
                document.getElementById('local').appendChild(div);
                document.getElementById('yyu').addEventListener('click',(e)=>{
                    e.preventDefault();
                    console.log(e.target.srcObject.getVideoTracks())
                })
            }).catch((e)=>{
                console.error(`stream error: ${e}`);
            });



            //create offer
            if(createOffer){
                pc[partnerName].onnegotiationneeded = async ()=>{
                    let offer = await pc[partnerName].createOffer();
                    
                    await pc[partnerName].setLocalDescription(offer);

                    socket.emit('sdp', {description:pc[partnerName].localDescription, to:partnerName, sender:socketId});
                };
            }



            //send ice candidate to partnerNames
            pc[partnerName].onicecandidate = ({candidate})=>{
                socket.emit('ice candidates', {candidate: candidate, to:partnerName, sender:socketId});
            };



            //add
            pc[partnerName].ontrack = (e)=>{
                let str = e.streams[0];
                if(document.getElementById(`${partnerName}-video`)){
                    document.getElementById(`${partnerName}-video`).srcObject = str;
                }

                else{
                    //video elem
                    let newVid = document.createElement('video');
                    newVid.id = `${partnerName}-video`;            
                    newVid.srcObject = str;
                    newVid.autoplay = true;
                    newVid.className = 'remote-video';
                    
                    //create a new div for card
                    let cardDiv = document.createElement('div');
                    cardDiv.className = 'card mb-3';
                    cardDiv.appendChild(newVid);
                    
                    //create a new div for everything
                    let div = document.createElement('div');
                    div.className = 'col-sm-12 col-md-6';
                    div.id = partnerName;
                    div.appendChild(cardDiv);
                    
                    //put div in videos elem
                    document.getElementById('videos').appendChild(div);
                }
            };



            pc[partnerName].onconnectionstatechange = (d)=>{
                switch(pc[partnerName].iceConnectionState){
                    case 'disconnected':
                    case 'failed':
                        h.closeVideo(partnerName);
                        break;
                        
                    case 'closed':
                        window.alert(' signal state closed');
                        h.closeVideo(partnerName);
                        break;
                }
            };



            pc[partnerName].onsignalingstatechange = (d)=>{
                switch(pc[partnerName].signalingState){
                    case 'closed':
                        window.alert(' signal state closed');
                        h.closeVideo(partnerName);
                        break;
                }
            };
        }

        document.getElementById('encrypt-button').addEventListener('click', ()=>{
            var ele = document.getElementById('encrypt');
            if(ele.checked)
            {
              var message = document.getElementById('image-steganography-text').value;
              var image = document.getElementById('file').files[0];
              if(!message || !image)
                window.alert('fill everything bitch');
              else {
                sendImage(message, image);
              }
            }
            else if(document.getElementById('decrypt').checked)
            {
              var image = document.getElementById('file').value;
              if(!image)
                window.alert('upload file bitch');
              else {
                window.alert('everything fine');
              }
            }
          });

        //Check for unparlimentatory words
        document.getElementById('chat-input').addEventListener('keypress', (e)=>{
            typingEvent(username);
            if(e.which === 13 && (e.target.value.trim())){
                e.preventDefault();
                var msg = e.target.value;
                fetch("/currency", {
                    method: 'POST',
                    body: JSON.stringify({message: msg}),
                    headers: {
                    'Content-Type': 'application/json'}
                    })
                    .then(function(response) {
                        if (response.status >= 400) {
                        throw new Error("Bad response from server");
                        }
                        return response.json();
                    })
                    .then(function(data){
                        console.log(data)
                        var Content = data;
                        if(data.status)
                        {
                            if (data.code === 100) 
                            {
                                sendMsg(data.message);
                            }
                            else if (data.code === 169)
                            {
                                window.alert(Content.message)
                                let data = {
                                    room: room,
                                };
                                //emit chat message
                                socket.emit('removetype', data);
                            }
                        }
                        else
                            window.alert(data.message)
                    }).catch(function(err) {
                    console.log(err)
                    });

                setTimeout(()=>{
                    e.target.value = '';
                }, 50);
            }
        });
        

        document.getElementById('toggle-video').addEventListener('click', (e)=>{
            e.preventDefault();
            myStream.getVideoTracks()[0].enabled = !(myStream.getVideoTracks()[0].enabled);
            //toggle video icon
            e.srcElement.classList.toggle('fa-video');
            e.srcElement.classList.toggle('fa-video-slash');
        });

        document.getElementById('leave-room').addEventListener('click',(e)=>{
            e.preventDefault();
            let data = {
                room: room,
                sender: username
            };
            sendMsg(username+' left the group ');
            //emit remove message
            socket.emit('removeParticipant', data);
            //console.log(pc[socketId])
            window.location ='/'
        })
        document.getElementById('toggle-mute').addEventListener('click', (e)=>{
            e.preventDefault();

            myStream.getAudioTracks()[0].enabled = !(myStream.getAudioTracks()[0].enabled);

            //toggle audio icon
            e.srcElement.classList.toggle('fa-volume-up');
            e.srcElement.classList.toggle('fa-volume-mute');
        });
    }
});