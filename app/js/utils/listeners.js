import { emitAudioCallStartedForChat, emitStopTypingToRoom, emitTypingToRoom, emitVideoCallStartedForChat } from "../client-socket";
import { changeChatName, createChat, deletePostByID, followOrUnfollowUser, getChatParticipants, getNumberOfUnreadForUser, getPostData, getTopicsAndUsersForSearch, likePost, retweetPost, sendMessage, sendNotificationRead, setSeenForMessagesInChat, togglePinned } from "./api";
import { addEmojiToCommentModal, addNewMessage, animateButtonAfterClickOnLike, animateButtonAfterClickOnRetweet, createChatRow, createNewNotification, createRowsAfterSearchInRightColumn, emptyFileContainer, emptyImagePreviewContainer, findChatElement, findPostWrapperElement, getPostIdForWrapper, getProfileIdFromFollowButton, hideSpinner, openModal, scrollMessagesToBottom, showSpinner, toggleButtonAvailability, toggleFollowButtons, toggleScrollForTextarea } from "./dom-manipulation";
import { createSmallRowForUser } from "./html-creators";
import { validateNumberOfImages } from "./validation";
/**
 * @param {Event} e 
 */
function onClickLikePost(e) {
  e.stopPropagation();
  const button = e.target;
  const postWrapper = findPostWrapperElement(button, 'post-wrapper') || findPostWrapperElement(button, 'original-post') || findPostWrapperElement(button, 'comment-post');

  if (!postWrapper) {
    console.error("Couldnt find post id")
    return;
  }

  const pid = getPostIdForWrapper(postWrapper)
  const otherPostLikeButtonsOnThePageWithSamePostID = document.querySelectorAll(`div.post-wrapper[data-pid="${pid}"] button.post-like, div.post-wrapper[data-retweet-id="${pid}"] button.post-like, div.original-post[data-pid="${pid}"] button.post-like, div.comment-post[data-pid="${pid}"] button.post-like`)
  Array.from(otherPostLikeButtonsOnThePageWithSamePostID)
    .forEach(button => {
      animateButtonAfterClickOnLike(button)
    });

  likePost(pid)
    .then(res => res.json())
    .then(res => { })
    .catch(err => console.error(err));
}
/**
 * @param {Event} e 
 */
function onClickRetweetPost(e) {
  e.stopPropagation()
  const button = e.target;
  /** @type { HTMLElement } */
  const postWrapper = findPostWrapperElement(button, 'post-wrapper') || findPostWrapperElement(button, 'original-post') || findPostWrapperElement(button, 'comment-post');

  if (!postWrapper) {
    console.error("Couldnt find post id")
    return;
  }

  let pid = getPostIdForWrapper(postWrapper);

  if (postWrapper.dataset.retweetId) {
    postWrapper.classList.add('animate__bounceOutRight')
    setTimeout(() => {
      postWrapper.remove()
      const retweetWrapper = document.querySelector(`div.post-wrapper[data-pid='${postWrapper.dataset.retweetId}'] div.button-retweet-wrapper`);

      removeUIRetweetedIndication(retweetWrapper)
    }, 420)
  } else {
    animateButtonAfterClickOnRetweet(button)
    const postsWhichRetweetedThis = document.querySelectorAll(`div.post-wrapper[data-retweet-id='${pid}'] `)

    Array.from(postsWhichRetweetedThis).forEach(
      post => {
        post.classList.add('animate__bounceOutRight')
        setTimeout(() => {
          post.remove()
        }, 420)
      }
    )
  }

  retweetPost(pid)
    .then(res => res.json())
    .catch(err => console.error(err));
}
/**
 * @param {Event} e 
 */
function onClickCommentPost(e) {
  e.stopPropagation()
  const button = e.target;
  const postWrapper = findPostWrapperElement(button, 'post-wrapper') || findPostWrapperElement(button, 'original-post') || findPostWrapperElement(button, 'comment-post');

  if (!postWrapper) {
    console.error("Couldnt find post id")
    return;
  }

  const pid = postWrapper.dataset.pid

  getPostData(pid)
    .then(res => res.json())
    .then(({ msg, status, data }) => {
      if (status == 200) {
        openModal(data)
      }
    })
}
/**
 * @param {Event} e 
 */
function onKeyUpCommentTA(e) {
  const postBtn = document.querySelector('div.reply-button-wrapper button.reply-comment-button')
  toggleButtonAvailability(postBtn, () => e.target.value.trim().length == 0)
  toggleScrollForTextarea(e, postBtn)
}
/**
 * @param {HTMLElement} modal 
 * @param {HTMLElement} taReply 
 * @returns { Function }
 */
const createFunctionToCloseModal = (modal, taReply) => () => {
  modal.classList.add('hidden')
  taReply.value = '';
  taReply.style.height = '50px';
  taReply.style.overflowY = 'hidden'
  document.querySelector('#comment-images-for-upload').value = ''
  modal.querySelector('div.left-column__line-separator').style.height = '0px'
}
/**
 * @param {Event} e 
 */
function onPostWrapperClick(e) {
  const postWrapper = findPostWrapperElement(e.target, 'post-wrapper') || findPostWrapperElement(e.target, 'original-post') || findPostWrapperElement(e.target, 'comment-post');


  if (!postWrapper) {
    console.error("Couldnt find post id!")
    return;
  }

  const pid = getPostIdForWrapper(postWrapper);

  if (pid) {
    window.location.href = '/post/' + pid;
    return;
  }

  return console.error("Couldn't find post id")
}

/**
 * @param {Event} e 
 */
function onClickDeletePost(e) {
  e.stopPropagation();
  const postWrapper = findPostWrapperElement(e.target, 'post-wrapper') || findPostWrapperElement(e.target, 'original-post') || findPostWrapperElement(e.target, 'comment-post');

  if (!postWrapper) {
    console.error("Couldn't find post with that id")
    return;
  }

  const pid = postWrapper.dataset.pid;

  postWrapper.classList.add('animate__bounceOutRight')
  const postsToBeRemovedFromDOM = document.querySelectorAll(`div.post-wrapper[data-pid="${pid}"], div.post-wrapper[data-retweet-id="${pid}"], div.original-post[data-pid="${pid}"], div.comment-post[data-pid="${pid}"]`)

  Array.from(postsToBeRemovedFromDOM).forEach(el => {
    if (el.classList.contains('original-post') || el.classList.contains('original-post')) {
      el = findPostWrapperElement(el, 'post-wrapper', true)
    }

    el.classList.add('animate__bounceOutRight')
  })
  setTimeout(() => {
    Array.from(postsToBeRemovedFromDOM).forEach(el => {
      if (el.classList.contains('original-post') || el.classList.contains('original-post')) {
        el = findPostWrapperElement(el, 'post-wrapper', true)
      }

      el.remove()
    });
  }, 700);

  deletePostByID(pid)
    .then(res => res.json())
    .then(data => {
      if (data.status === 204) {
        setTimeout(() => {
          Array.from(postsToBeRemovedFromDOM).forEach(el => {
            if (data.retweetedPost) {
              const retweetWrapper = document.querySelector(`div.post-wrapper[data-pid='${data.retweetedPost}'] div.button-retweet-wrapper`);
              removeUIRetweetedIndication(retweetWrapper)
            }
          })
        }, 420)
      }

      if (data.status === 200) {
        console.error("there was no post to be deleted")
      }
    })
}
/** 
 * @param {HTMLElement} retweetWrapper 
 */
function removeUIRetweetedIndication(retweetWrapper) {
  const retweetSVG = retweetWrapper.querySelector('svg.retweet-icon');

  retweetSVG.classList.remove('text-retweet-button-green');
  retweetSVG.classList.remove('filled');

  const span = retweetWrapper.querySelector('span.retweet-num')
  const numOfRetweets = span.innerText;

  span.innerHTML = (numOfRetweets - 1) == 0 ? '&nbsp;&nbsp;' : numOfRetweets - 1;
  span.classList.remove('text-retweet-button-green')
}

function onFollowOrUnfollowClick(e, action) {
  const profileId = getProfileIdFromFollowButton(e);

  const label = e.target.querySelector('span.follow-button__label')
  const spinner = e.target.querySelector('i.follow-button__spinner')

  showSpinner(label, spinner)
  var spanToChange = document.querySelector('div.following-info-wrapper span.number-of-followers');

  followOrUnfollowUser(profileId, action)
    .then(data => {
      console.log(data);
      toggleFollowButtons(e, label, spanToChange);
      hideSpinner(label, spinner)
    })
    .catch(err => {
      console.error(err)
      console.error(`Problem with ${action}, please try again after later thank you.`)
    })
}
/**
 * 
 * @param { Event } e 
 * @param { String } type 
 * @param { Object | null } cropper 
 */
function openPhotoEditModal(e, type, cropper) {
  const modal = document.querySelector("#change-photo-modal");
  modal.classList.remove('hidden')
  const closebutton = modal.querySelector('.close-modal-button')
  closebutton.addEventListener('click', e => modal.classList.add('hidden'))

  /** @type {HTMLElement} */
  const inputFile = modal.querySelector('input[type="file"]')
  // emptyImagePreviewContainer();
  // emptyFileContainer();

  inputFile.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (e.target && e.target.files[0]) {
      const reader = new FileReader();

      reader.onload = function (e) {
        const previewImage = document.querySelector('div#image-preview > img');
        previewImage.src = e.target.result;

        if (cropper.instance) {
          cropper.instance.destroy();
          // emptyImagePreviewContainer();
          // emptyFileContainer();
        }

        cropper.instance = new Cropper(previewImage, {
          aspectRatio: type == 'profile' ? 1 / 1 : 3 / 1,
          background: false
        })
      }
      reader.readAsDataURL(file)
    }
  });

  inputFile.dataset.type = type;
}
/**
 * 
 * @param {Event} e 
 * @param {Object} cropper 
 */
function onClosePhotoModal(e, cropper) {
  document.querySelector("#change-photo-modal").classList.add('hidden')
  if (cropper.instance) {
    cropper.instance.destroy();
  }
  emptyImagePreviewContainer();
  emptyFileContainer()
}

function onClickUploadImageToServer(e, cropper) {
  var canvas = cropper.instance.getCroppedCanvas();
  if (!canvas) {
    console.error("Couldn't upload image, make sure that it is an image file")
    return;
  }
  const photoSaveLabel = e.target.querySelector('span.modal-save-button__label')
  const photoSaveSpinner = e.target.querySelector('i.modal-save-button__spinner')
  showSpinner(photoSaveLabel, photoSaveSpinner)

  canvas.toBlob((blob) => {
    var formData = new FormData()
    formData.append('croppedImage', blob)
    const typeOfPhotoToUpload = document.querySelector('input#photo').dataset.type;

    fetch(`/profile/upload/${typeOfPhotoToUpload}`, {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(({ status }) => {
        hideSpinner(photoSaveLabel, photoSaveSpinner)
        if (status === 200) {
          location.reload()
        }
      })
      .catch(err => {
        console.error(err)
      })
  });
}
/**
 * 
 * @param {Event} e 
 * @returns {Promise<post>}
 */
function onClickTogglePinned(e) {
  e.stopPropagation();
  const button = e.target
  const postWrapper = findPostWrapperElement(button, 'post-wrapper') || findPostWrapperElement(button, 'original-post') || findPostWrapperElement(button, 'comment-post');
  const pinned = button.dataset.pinned == 'true';
  // const isProfilePage = document.querySelector("div#profile-posts div.pinned-button-wrapper");

  if (!postWrapper) {
    console.error("Couldnt find post id")
    return;
  }

  const pid = getPostIdForWrapper(postWrapper)
  togglePinned(pid, pinned)
    .then(({ data, msg, status }) => {
      if (status == 200) {
        location.reload();
      }
    })

}
/**
 * @param { Event } e 
 * @param { Array.<user> } selectedUsers 
 */
function onClickCreateChat(e, selectedUsers) {
  createChat(selectedUsers)
    .then(res => {
      window.location.href = '/messages/' + res.data._id
    })
    .catch(err => {
      console.error(err)
    })
}

/**
 * @param { Event } e 
 * @param { HTMLElement } modal 
 * @param { string } chatId 
 */
function onClickSaveChatNameButton(e, modal, chatId) {
  const chatNameElement = modal.querySelector('input#chat-name')
  const chatName = chatNameElement.value.trim()

  if (chatName.length > 0) {
    changeChatName(chatName, chatId)
      .then(res => {
        const chatNameHeader = document.querySelector('#inbox > div.chat-messages-wrapper > div.header-chat-info-wrapper > div > div.header-chat-name > h4');
        chatNameHeader.innerHTML = res.data.chatName;
        modal.classList.add('hidden')
        chatNameElement.value = ''
      })
      .catch(err => {
        console.error(err)
        console.error("There was an error while trying to change chat name")
      })
  }
}

function addEmojiToInput(e, textarea) {
  //TODO dodati da se emoji dodaje na kraju 
  textarea.value += e.detail.unicode
}
/**
 * 
 * @param {Event} e 
 * @param {HTMLElement} messageInput 
 * @param {HTMLElement} chatMessagesContainer 
 * @param {Array.<File>} selectedImages 
 * @returns {Promise}
 */
function onSendMessage(e, messageInput, chatMessagesContainer, selectedImages) {
  const chatId = document.querySelector('#send-message-button').dataset.chatId;
  const content = messageInput.value.trim()

  messageInput.value = '';
  messageInput.focus()
  return sendMessage(chatId, content, selectedImages)
    .then(res => {
      console.log(res.data)
      addNewMessage(res.data, 'sent', res.data.images)
      scrollMessagesToBottom(chatMessagesContainer)
      stopTyping(chatId)
      return Promise.resolve(res.data)
    })
    .catch(err => {
      console.error(err)
      messageInput.value = content;
    })
}

var typing = false;
var lastTypingTime = 0;
/**
 * Emits event about typing or not typing by the user
 * @param {String} room 
 */
function updateTyping(room) {
  if (!typing) {
    typing = true;
    emitTypingToRoom(room)
  }

  lastTypingTime = new Date().getTime();
  var timerLength = 3000;

  setTimeout(() => {
    const timeNow = new Date().getTime();
    const timeDiff = timeNow - lastTypingTime;

    if (timeDiff >= timerLength) {
      stopTyping(room)
    }
  }, timerLength)
}

function stopTyping(room) {
  emitStopTypingToRoom(room)
  typing = false;
}

function onClickOnNotification(e) {
  e.preventDefault();
  /** @type { HTMLElement } */
  const aTag = e.target;
  const href = aTag.getAttribute('href');
  const notificationId = aTag.dataset.notificationId;

  if (!notificationId) {
    console.error("No notification ID")
    return;
  }

  sendNotificationRead(notificationId)
    .then(data => {
      if (data.status == 200) {
        window.location.href = href;
      }
    })
    .catch(err => {
      console.log(err);
      console.error("There was a problem with viewing notification, please try again later thank you.")
    })
}
/**
 * 
 * @param {message} msg 
 */
function onNewMessage(msg) {
  const chatContainer = document.querySelector('#inbox div.chat-messages-container')
  const inboxChatsWrapper = document.querySelector('#inbox #chats')

  //* This means that I am in the chat so no notification should be fetched and displayed
  if (chatContainer) {
    addNewMessage(msg, 'received', msg.images)
    scrollMessagesToBottom(chatContainer)
    setSeenForMessagesInChat(msg.chat._id || msg.chat)
      .then(data => console.log(data.msg))
      .catch(err => console.error(err));

    return
  }

  if (inboxChatsWrapper) {
    const chatElement = findChatElement(msg.chat._id || msg.chat, inboxChatsWrapper)
    if (chatElement) {
      chatElement.classList.add('bg-comment-button-blue-background')
      chatElement.querySelector('div.chat-info-messages h4').classList.add('font-semibold')
      const contentEl = chatElement.querySelector('div.chat-info-messages p');
      contentEl.classList.add('font-medium')
      contentEl.innerText = msg.sender.fullName + ": " + msg.content;

    } else {
      const chatRow = createChatRow(msg)
      inboxChatsWrapper.prepend(chatRow);
    }

  } else {
    getNumberOfUnreadForUser()
      .then(data => {
        const numOfChatsSpan = document.querySelector("#numOfUnreadChats")
        if (numOfChatsSpan && data.data > 0) {
          numOfChatsSpan.classList.add('bg-red-700')
          numOfChatsSpan.innerText = data.data
        }
      })
  }

}
/**
 * 
 * @param {Object} data 
 * @param {notification} data.notification 
 * @param {Number} data.notificationNumber 
 */
function onNewNotification(data) {
  const numOfNotificationsSpan = document.querySelector("#numOfUnreadNotifications");
  const notificationsContainer = document.querySelector('#notifications div.content-wrapper')
  data = JSON.parse(data)

  //* If true means that we are on notifications page
  if (notificationsContainer) {
    //TODO - add new notification to screen
    const newNotificationElement = createNewNotification(data.notification)
    notificationsContainer.prepend(newNotificationElement)
  } else {
    if (numOfNotificationsSpan && data.notificationNumber > 0) {
      numOfNotificationsSpan.classList.add('bg-red-700')
      numOfNotificationsSpan.innerText = data.notificationNumber
    }
  }
}

function addAllListenersToPosts(validateAndPreviewImages = null) {
  addEmojiToCommentModal()

  if (validateAndPreviewImages) {
    const commentUploadImagesInput = document.querySelector('#comment-images-for-upload');

    document.querySelector('div.reply-icons-wrapper button.comment-image-button')
      .addEventListener('click', () => {
        commentUploadImagesInput.click()
        commentUploadImagesInput.removeEventListener('change', validateAndPreviewImages)
        commentUploadImagesInput.addEventListener('change', validateAndPreviewImages)
      })
  }

  Array.from(document.querySelectorAll('.comment-button')).forEach(el => {
    el.addEventListener('click', onClickCommentPost)
  })

  Array.from(document.querySelectorAll('.post-like')).forEach(el => {
    el.addEventListener('click', onClickLikePost)
  })

  Array.from(document.querySelectorAll('.retweet-post')).forEach(el => {
    el.addEventListener('click', onClickRetweetPost)
  })

  Array.from(document.querySelectorAll('.post-wrapper')).forEach(el => {
    el.addEventListener('click', onPostWrapperClick)
  })

  Array.from(
    document.querySelectorAll('div.post-wrapper div.delete-post-button-wrapper button.delete-post-button')
  ).forEach(el => {
    el.addEventListener('click', onClickDeletePost)
  })

  Array.from(
    document.querySelectorAll('#posts div.post-content__info.flex.flex-row.items-center.w-full div.pinned-button-wrapper.inline-block > button')
  ).forEach(el => {
    el.addEventListener('click', onClickTogglePinned)
  })
  document.querySelector('#comment-images-for-upload').addEventListener('change', validateNumberOfImages)
}

const onSearchTopicsAndUsers = (timeout = null) => e => {
  clearTimeout(timeout);
  const val = e.target.value;
  document.body.addEventListener('click', () => document.querySelector('div.search-users-hastags-container > div.result-modal').classList.add('hidden'))

  timeout = setTimeout(() => {
    if (val.length > 0) {
      getTopicsAndUsersForSearch(val.trim())
        .then(({ data, status, msg }) => {
          if (status == 200) {
            createRowsAfterSearchInRightColumn(data.hashtags, data.users)
          }
        })
        .catch(err => console.error(err))
    } else {
      document.querySelector('div.search-users-hastags-container > div.result-modal').classList.add('hidden');
    }
  }, 1000)
}

/**
 * 
 * @param {Event} e 
 */
function onClickToggleOnlineUsersWrapper(e) {
  const closeButton = document.querySelector('div.online-users-container > div.online-users-header > button.close-online-users');
  const openButton = document.querySelector('div.online-users-container > div.online-users-header > button.open-online-users');
  const onlineUsersList = e.target.parentElement.nextElementSibling;

  closeButton.classList.toggle('hidden');
  openButton.classList.toggle('hidden');

  onlineUsersList.classList.toggle('slide-up')
  onlineUsersList.classList.toggle('slide-down')
}

function onFindingOnlineUsers(users) {
  const usersWrapper = document.querySelector('div.online-users-container div.online-users-list')

  users.forEach(u => {
    usersWrapper.innerHTML = '';
    users.forEach(u => {
      usersWrapper.innerHTML += createSmallRowForUser(u, `/messages/${u._id}`);
    })
  });

  const onlineIndicatorDiv = document.querySelector('#is-online-indicator');

  if (window.location.pathname.indexOf("/messages/") > -1 && window.location.pathname != '/messages/new' && onlineIndicatorDiv) {
    const parts = window.location.pathname.split("/")
    const chatId = parts[parts.length - 1]

    getChatParticipants(chatId)
      .then(({ chatParticipantsIds, allOnlineUserIds, setOnlineIndicator }) => {
        if (!setOnlineIndicator) {
          onlineIndicatorDiv.remove();
        } else {
          onlineIndicatorDiv.classList.remove("hidden")
          const phoneIcon = onlineIndicatorDiv.querySelector(".fa-phone")
          const videoIcon = onlineIndicatorDiv.querySelector(".fa-video")
          phoneIcon.addEventListener('click', () => {
            emitAudioCallStartedForChat(chatId);
          })
          videoIcon.addEventListener('click', () => {
            emitVideoCallStartedForChat(chatId)
          })
        }
      })
      .catch(err => {
        console.error("🚀 ~ file: listeners.js ~ line 641 ~ onFindingOnlineUsers ~ err", err)
      })
  }
}
var waitingModalTimeout = null;

const displayWaitingForAnswerModal = () => {
  clearTimeout(waitingModalTimeout);

  const modalWrapper = document.querySelector('#waiting_call_modal');
  modalWrapper.classList.remove('hidden')

  waitingModalTimeout = setTimeout(() => {
    modalWrapper.classList.add('hidden')
  }, 60000)
}

const onDisconnectRemoveFriendFromList = (userId) => {
  console.log("USER DISCONNECTED ", userId)
  const userWrapper = document.querySelector(`div.online-users-container div.online-users-list a[data-user-id="${userId}"]`)

  if (userWrapper) {
    userWrapper.remove()
  }
}

const onFriendConnectionAddToList = (user) => {
  const usersWrapper = document.querySelector('div.online-users-container div.online-users-list')
  const userWrapper = document.querySelector(`div.online-users-container div.online-users-list a[data-user-id="${user._id}"]`)

  if (userWrapper) {
    userWrapper.remove()
  }
  usersWrapper.innerHTML += createSmallRowForUser(user, `/messages/${user._id}`);
}

let callTimeout = null;

const onCallDisplayRinging = (type, { uuid, chat }) => {
  const callWrapper = document.querySelector(`#${type}-call-wrapper`)
  callWrapper.classList.remove("hidden");
  clearTimeout(callTimeout);

  var audio = document.querySelector("#ringtone")
  audio.play();

  const answerBtn = callWrapper.querySelector("div.call-icons-wrapper div.answer")
  const denyBtn = callWrapper.querySelector("div.call-icons-wrapper div.deny")
  const chatNameSpan = callWrapper.querySelector('span.chat-name')
  const chatNameHeader = document.querySelector('div.header-chat-name h4')
  chatNameSpan.innerText = chat.chatName || chatNameHeader?.innerText || ""

  answerBtn.addEventListener("click", () => {
    window.location.href = "/call_room/" + type + "/" + uuid;
    audio.pause();
  })
  denyBtn.addEventListener("click", () => {
    callWrapper.classList.add("hidden");
    audio.pause();
  })

  callTimeout = setTimeout(() => {
    callWrapper.classList.add("hidden")
    audio.pause();
  }, 60000)
}

export {
  onClickLikePost,
  onClickCommentPost,
  onKeyUpCommentTA,
  createFunctionToCloseModal,
  onClickRetweetPost,
  onClickDeletePost,
  onClosePhotoModal,
  openPhotoEditModal,
  onPostWrapperClick,
  onClickTogglePinned,
  onClickUploadImageToServer,
  onFollowOrUnfollowClick,
  onClickSaveChatNameButton,
  onClickCreateChat,
  addEmojiToInput,
  onSendMessage,
  updateTyping,
  stopTyping,
  onClickOnNotification,
  onNewMessage,
  addAllListenersToPosts,
  onNewNotification,
  onClickToggleOnlineUsersWrapper,
  onSearchTopicsAndUsers,
  onDisconnectRemoveFriendFromList,
  onFriendConnectionAddToList,
  onFindingOnlineUsers,
  onCallDisplayRinging
};

