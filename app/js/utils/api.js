/**
 * Sends request to /api/posts to attempt creation of a new post.
 * @param { String } content 
 * @param { Array.<File> } selectedImages 
 * @returns Promise
 */
function createPost(content, selectedImages) {
  const formData = new FormData()

  formData.append('content', content)
  for (let i = 0; i < selectedImages.length; i++) {
    formData.append('images', selectedImages[i]);
  }

  return fetch(`${process.env.SERVER_URL}/api/posts`, {
    method: "POST",
    body: formData
  })
}
/**
 * 
 * @param { String } _id 
 * @returns Promise
 */
function likePost(_id) {
  return fetch(`${process.env.SERVER_URL}/api/posts/like`, {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ _id })
  })
}
/**
 * 
 * @param { String } _id 
 * @returns Promise
 */
function retweetPost(_id) {
  return fetch(`${process.env.SERVER_URL}/api/posts/retweet`, {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ _id })
  })
}
/**
 * 
 * @param { String } _id 
 * @returns Promise
 */
function getPostData(_id) {
  return fetch(`${process.env.SERVER_URL}/api/posts/${_id}`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json"
    }
  })
}
/** 
 * @param { String } _id 
 * @param { String } content 
 * @param { Array.<File> } selectedImages 
 * @returns Promise
 */
function replyToPost(_id, content, selectedImages) {
  const formData = new FormData()

  formData.append('content', content)
  formData.append('_id', _id)

  for (let i = 0; i < selectedImages.length; i++) {
    formData.append('images', selectedImages[i]);
  }

  return fetch(`${process.env.SERVER_URL}/api/posts/replyTo/${_id}`, {
    method: 'POST',
    body: formData
  })
}

/**
 * 
 * @param {String} id 
 * @returns Promise
 */
function deletePostByID(id) {
  return fetch(`${process.env.SERVER_URL}/api/posts/delete/${id}`, {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json"
    }
  })
}

function getAllPostsForUserAndSelectedTab(tabId) {
  return fetch(`${process.env.SERVER_URL}/api/posts/profile/${tabId}`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
}
/**
 * 
 * @param {string} profileId 
 * @param {string } action 
 * @returns { Promise }
 */
function followOrUnfollowUser(profileId, action) {
  return fetch(`${process.env.SERVER_URL}/profile/${action}/${profileId}`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
}
/**
 * Toggles pin boolean for 
 * @param {string} postId 
 * @param {boolean} pinned 
 * @returns { Promise }
 */
function togglePinned(postId, pinned) {
  return fetch(`${process.env.SERVER_URL}/api/posts/pin/${postId}`, {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ pinned: !pinned })
  })
    .then(res => res.json())
}
/**
 * Searches for users in search page
 * @param {String} type 
 * @param {String} searchTerm 
 * @returns { Promise }
 */
function searchTermByType(type, searchTerm) {
  return fetch(`${process.env.SERVER_URL}/api/search/${type}/${searchTerm}`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
}
/**
 * Searches for users on inbox page
 * @param {String} searchTerm 
 * @returns { Promise }
 */
function searchUsers(searchTerm) {
  return fetch(`${process.env.SERVER_URL}/api/search/inbox/${searchTerm}`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
}
/**
 * 
 * @param {Array.<user>} selectedUsers 
 * @returns { Promise }
 */
function createChat(selectedUsers) {
  return fetch(`${process.env.SERVER_URL}/api/chat/create`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      users: selectedUsers
    })
  }).then(res => res.json())
}
/**
 * 
 * @param {string} chatName 
 * @param {string} chatId 
 * @returns { Promise }
 */
function changeChatName(chatName, chatId) {
  return fetch(`${process.env.SERVER_URL}/api/chat/change-chat-name`, {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ chatName, chatId })
  }).then(res => res.json())
}
/**
 * 
 * @param {string} chatId 
 * @param {string} content 
 * @param {Array.<File>} selectedImages 
 * @returns { Promise }
 */
function sendMessage(chatId, content, selectedImages) {
  const formData = new FormData();

  formData.append('chatId', chatId)
  formData.append('content', content)

  for (let i = 0; i < selectedImages.length; i++) {
    formData.append('images', selectedImages[i]);
  }

  return fetch(`${process.env.SERVER_URL}/api/message/sendMessage`, {
    method: 'POST',
    body: formData
  }).then(res => res.json())
}
/**
 * 
 * @param {string} _id
 * @returns { Promise }
 */
function sendNotificationRead(_id) {
  return fetch(`${process.env.SERVER_URL}/api/notification/read`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ notificationId: _id })
  }).then(res => res.json())
}
/**
 * 
 * @param {string} _id
 * @returns { Promise }
 */
function getNumberOfUnreadForUser(_id) {
  return fetch(`${process.env.SERVER_URL}/api/message/unread-number`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json"
    }
  }).then(res => res.json())
}
/**
 * @param {String} chatId 
 * @returns { Promise }
 */
function setSeenForMessagesInChat(chatId) {
  return fetch(`${process.env.SERVER_URL}/api/message/seen-chat-messages`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ chatId })
  }).then(res => res.json())
}
/**
 * @param {string} searchTerm 
 * @returns {Promise}
 */
function getTopicsAndUsersForSearch(searchTerm) {
  return fetch(`${process.env.SERVER_URL}/api/topics/search/${searchTerm}`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json"
    }
  }).then(res => res.json())
}

function getChatParticipants(chatId) {
  return fetch(`${process.env.SERVER_URL}/api/chat/online-participants/${chatId}`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json"
    }
  }).then(res => res.json())
}

export {
  searchTermByType,
  searchUsers,
  changeChatName,
  createPost,
  likePost,
  retweetPost,
  getPostData,
  replyToPost,
  deletePostByID,
  followOrUnfollowUser,
  togglePinned,
  createChat,
  getAllPostsForUserAndSelectedTab,
  sendMessage,
  sendNotificationRead,
  getNumberOfUnreadForUser,
  setSeenForMessagesInChat,
  getTopicsAndUsersForSearch,
  getChatParticipants
};

