import jwt_decode from 'jwt-decode';
import { io } from "socket.io-client";
import { createAudioBlock, createVideoCallBlock } from './utils/html-creators';

export default function call_room() {
  var socket = io(process.env.SERVER_URL)
  const port = document.querySelector("#port_num").value;
  console.log("🚀 ~ file: call_room.js ~ line 8 ~ call_room ~ port", port)

  const myPeer = new Peer(undefined, {
    host: `/`,
    port: port == 3000 ? port : 443,
    path: 'peerjs/peer-server'
  });
  const parts = window.location.pathname.split("/")
  const ROOM_ID = parts[parts.length - 1]
  const CALL_TYPE = parts[parts.length - 2]

  const myVideo = document.createElement('video')
  myVideo.muted = true;
  const peers = {};
  const jwtUser = jwt_decode(document.querySelector("#test").value)

  const options = { audio: true }
  if (CALL_TYPE === 'video') {
    options.video = true;
  }

  navigator.mediaDevices.getUserMedia(options)
    .then(stream => {
      const leaveCallButton = document.querySelector('button#leave-call');
      leaveCallButton.addEventListener('click', function () {
        myPeer.disconnect();
        window.history.back();
      })

      if (CALL_TYPE === 'video') {
        connectForVideo(stream)
      } else {
        connectForAudio(stream)
      }
    })

  socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close()
  })

  myPeer.on('open', id => {
    socket.emit('join-call', ROOM_ID, id, jwtUser)
  })

  function addNewUserToAudioCall(peerId, stream, user) {
    const call = myPeer.call(peerId, stream)
    const video = document.createElement('video')

    call.on('stream', userVideoStream => {
      addAudioCallStreamWhenUserConnected(video, userVideoStream, user)
    })

    call.on('close', () => {
      removeVideo("audio_call", video, user._id)
    })

    peers[peerId] = call
  }

  function addNewUserToVideoCall(peerId, stream, user) {
    const call = myPeer.call(peerId, stream)
    const video = document.createElement('video')

    call.on('stream', userVideoStream => {
      addVideoCallStreamWhenUserConnected(video, userVideoStream, user)
    })

    call.on('close', () => {
      removeVideo("video_call", video, user._id)
    })

    peers[peerId] = call
  }

  function connectForAudio(stream) {
    myPeer.on('call', call => {
      call.answer(stream)
      const video = document.createElement('video')

      call.on('stream', userVideoStream => {
        addAudioCallStreamWhenUserConnected(video, userVideoStream)
      })
    })

    socket.on('user-connected-to-call', (peerId, user, roomId) => {
      const isAlreadyDisplayed = document.querySelector(`#participants-wrapper .call-user-wrapper[data-uid='${user._id}']`)

      if (!isAlreadyDisplayed) {
        displayUserBlockInAudioCall(user)
      }

      addNewUserToAudioCall(peerId, stream, user)
      socket.emit("already-in-room", jwtUser, roomId)
    })

    socket.on('already-in-room', user => {
      const isAlreadyDisplayed = document.querySelector(`#participants-wrapper .call-user-wrapper[data-uid='${user._id}']`)

      if (!isAlreadyDisplayed) {
        displayUserBlockInAudioCall(user)
      }
    })
  }

  function connectForVideo(stream) {
    addMyVideoStreaming(myVideo, stream)

    myPeer.on('call', call => {
      call.answer(stream)
      const video = document.createElement('video')

      call.on('stream', userVideoStream => {
        addVideoCallStreamWhenUserConnected(video, userVideoStream)
      })
    })

    socket.on('user-connected-to-call', (peerId, user, roomId) => {
      setTimeout(() => {
        addNewUserToVideoCall(peerId, stream, user)
      }, 2000)
    })
  }

  function removeVideo(callType, video, userId) {
    video.remove();

    if (callType === 'audio_call') {
      const wrapper = document.querySelector(`.call-user-wrapper[data-uid='${userId}']`)
      wrapper.remove();
    }
  }

  function displayUserBlockInAudioCall(user) {
    const participantsWrapper = document.querySelector("#participants-wrapper");
    const userBlock = createAudioBlock(user);
    participantsWrapper.innerHTML += userBlock;
  }

  /**
   * 
   * @param { HTMLElement } video 
   * @param {*} stream 
   * @param { user } user
   */
  let videoTimeout = null;
  let isChanged = null;
  function addVideoCallStreamWhenUserConnected(video, stream, user = null) {
    const videoGrid = document.getElementById('video-grid')

    video.srcObject = stream

    video.addEventListener('loadedmetadata', () => {
      video.play()

      setTimeout(() => {
        if (!isChanged) {
          const bigVideo = document.querySelector('#big-video-wrapper video')
          const smallVideoSrcObject = video.srcObject;
          video.srcObject = bigVideo.srcObject;
          bigVideo.srcObject = smallVideoSrcObject;

          isChanged = true;
        }
      }, 500)
    })

    const divVideoBlock = createVideoCallBlock(video, user)

    clearTimeout(videoTimeout)

    videoTimeout = setTimeout(() => {
      video.addEventListener('click', () => {
        const bigVideo = document.querySelector('#big-video-wrapper video')
        const smallVideoSrcObject = video.srcObject;
        video.srcObject = bigVideo.srcObject;
        bigVideo.srcObject = smallVideoSrcObject;
      })
    }, 1000)

    videoGrid.append(divVideoBlock)

  }

  /**
   * 
   * @param { HTMLElement } video 
   * @param {*} stream
   */

  function addAudioCallStreamWhenUserConnected(video, stream) {
    const videoGrid = document.getElementById('video-grid')

    video.srcObject = stream

    video.addEventListener('loadedmetadata', () => {
      video.play()
    })

    video.className = "object-fill cursor-pointer hover:border hover:border-white lg:max-h-80 lg:max-w-none xs:max-w-[170px] sm:max-w-[200px] max-w-[150px]  lg:mb-4"
    videoGrid.append(video)
  }
  /**
   * 
   * @param {HTMLElement} video 
   * @param {*} stream 
   */
  function addMyVideoStreaming(video, stream) {
    const videoGrid = document.getElementById('big-video-wrapper')

    video.srcObject = stream
    video.classList.add("h-full")
    video.classList.add("w-full")
    video.classList.add("object-cover")
    video.classList.add("lg:object-fill")

    video.addEventListener('loadedmetadata', () => {
      video.play()
    })
    videoGrid.append(video)
  }
}