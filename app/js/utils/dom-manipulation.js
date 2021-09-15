import { Picker } from 'emoji-picker-element';
import './../../../typedefs';
import { createChatRowContent, createCommentButtonElements, createDeleteButtonElements, createElementForButtonWrapper, createFollowButtonElement, createFollowingButtonElement, createLikeButtonElements, createNewMessageHTML, createNewNameLabelHTML, createNotificationRow, createPostElement, createRetweetButtonElements, createRightColumnSearchRowForHashtag, createSmallRowForUser, createUserRowHTML } from './html-creators';
import { addEmojiToInput, createFunctionToCloseModal, onKeyUpCommentTA } from './listeners';

/**
 * @param {post} post 
 */
function openModal(post) {
  const modal = document.getElementById('modal-container')
  modal.classList.remove('hidden')

  fillModalWithPostValues(modal, post)
  adjustHeightOfSeparator(modal);

  const taReply = modal.querySelector("div.reply-aria textarea")
  taReply.addEventListener('keyup', onKeyUpCommentTA)

  const closebutton = modal.querySelector('.close-modal-button')
  closebutton.addEventListener('click', createFunctionToCloseModal(modal, taReply))
}

function emptyImagePreviewContainer() {
  const imagePreviewContainer = document.querySelector("#image-preview");

  /** @type {HTMLElement} */
  const imageTag = document.createElement("img")
  imageTag.setAttribute('src', '');
  imageTag.setAttribute('class', 'block max-w-full w-full');

  imagePreviewContainer.innerHTML = "";
  imagePreviewContainer.appendChild(imageTag)
}

function emptyFileContainer() {
  const fileContainer = document.querySelector('#file-preview-wrapper')
  const input = document.createElement('input');
  input.type = 'file'
  input.name = 'profile-photo'
  input.id = 'photo';
  input.dataset.type = "profile"
  fileContainer.innerHTML = '';
  fileContainer.appendChild(input);
}
/**
 * @param {HTMLElement} modal 
 */
function adjustHeightOfSeparator(modal) {
  const rightColumnHeaderHeight = modal.querySelector('div.modal-content__right-column div.right-column__header').offsetHeight
  const rightColumnPostContentHeight = modal.querySelector('div.modal-content__right-column div.post-content').offsetHeight
  const rightColumnReplyAreaHeight = modal.querySelector('div.modal-content__right-column div.reply-aria').offsetHeight
  const val = rightColumnHeaderHeight + rightColumnPostContentHeight + rightColumnReplyAreaHeight;

  modal.querySelector('div.left-column__line-separator').style.height = (val / 3)
}
/**
 * @param {post} post 
 */
function fillModalWithPostValues(modal, post) {
  modal.querySelector('div.comment-modal__content div.post-content > p').innerHTML = post.content;
  modal.querySelector('div.comment-modal__content span.postedBy-name').innerHTML = post.postedBy.fullName;
  modal.querySelector('div.comment-modal__content span.postedBy-username').innerHTML = `@${post.postedBy.username}`;
  modal.querySelector('div.comment-modal__content span.postedBy-month-and-date').innerHTML = post.fromNow || (`${post.date} · ${post.time}`);
  modal.querySelector('div.comment-modal__content a.postedBy-username-link').innerHTML = `@${post.postedBy.username}`;
  modal.querySelector('div.comment-modal__content img.post-creator-profile-picture').setAttribute('src', post.postedBy.profilePic)
  modal.querySelector('div.comment-modal__content img.post-creator-profile-picture').setAttribute('alt', post.postedBy.username)
  modal.querySelector('div.reply-button-wrapper button.reply-comment-button').dataset.pid = post._id;
}
/**
 * Enables button for creating new post
 * @param { HTMLElement } btn 
 * @param { String } hoverClass 
 */
function enableButton(btn, hoverClass) {
  btn.classList.add(hoverClass);
  btn.classList.add('cursor-pointer');
  btn.classList.remove('cursor-auto');
  btn.classList.remove('bg-opacity-50');
  btn.removeAttribute('disabled')
}
/**
 * Disables button for creating new post
 * @param { HTMLElement } btn 
 * @param { String } hoverClass 
 */
function disableButton(btn, hoverClass) {
  btn.classList.add('bg-opacity-50');
  btn.classList.add('cursor-auto');
  btn.classList.remove(hoverClass);
  btn.classList.remove('cursor-pointer');
  btn.setAttribute('disabled', true)
}
/**
 * Adds newly created post to the targetElement
 * @param { HTMLElement } targetElement 
 * @param {post} post
 * @param { string } method 
 */
function addNewPost(targetElement, post, createdAt, method = 'prepend') {
  const postElement = createPostElement(post._id, post.content, post.postedBy, createdAt);
  targetElement[method](postElement);

  createElementForButtonWrapper(postElement, '.button-comment-wrapper', createCommentButtonElements)
  createElementForButtonWrapper(postElement, '.button-retweet-wrapper', createRetweetButtonElements)
  createElementForButtonWrapper(postElement, '.button-like-wrapper', createLikeButtonElements)
  createElementForButtonWrapper(postElement, '.delete-post-button-wrapper', createDeleteButtonElements)
}

/**
 * Adds newly created post to the targetElement
 * @param { HTMLElement } targetElement 
 * @param {post} post
 * @param { string } method 
 */
function addNewPostWithPredefinedButtons(targetElement, post, method = 'prepend') {
  const postElement = createPostElement(post._id, post.content, post.postedBy, post.fromNow);
  targetElement[method](postElement);

  createElementForButtonWrapper(postElement, '.button-comment-wrapper', () => createCommentButtonElements(post))
  createElementForButtonWrapper(postElement, '.button-retweet-wrapper', () => createRetweetButtonElements(post))
  createElementForButtonWrapper(postElement, '.button-like-wrapper', () => createLikeButtonElements(post))
  if (post.hasDelete) {
    createElementForButtonWrapper(postElement, '.delete-post-button-wrapper', createDeleteButtonElements)
  }
}

/**
 * Recursively finds data-pid prop
 * @param { HTMLElement } element 
 * @param { string } className 
 * @param { boolean } withoutPID 
 * @returns { boolean | HTMLElement }
 */
function findPostWrapperElement(element, className, withoutPID = false) {
  if (['body', 'head', 'html'].includes(element.tagName.toLowerCase())) {
    return false;
  }

  if (
    element.tagName.toLowerCase() == 'div' &&
    element.classList.contains(className) && (
      withoutPID ||
      getPostIdForWrapper(element)
    )) {
    if (withoutPID) {
      return element
    }

    const pid = element.dataset.pid;

    if (!pid) {
      return false;
    }

    return element;
  }

  return findPostWrapperElement(element.parentElement, className, withoutPID);
}
/**
 * @param {HTMLElement} postWrapper 
 * @returns { string }
 */
function getPostIdForWrapper(postWrapper) {
  return postWrapper.dataset.retweetId || postWrapper.dataset.pid
}
/**
 * Hides spinner inside of button for posting new post
 * @param {HTMLElement} label 
 * @param {HTMLElement} spinner 
 */
function hideSpinner(label, spinner) {
  enableButton(spinner.parentElement);
  label.classList.remove('hidden')
  spinner.classList.add('hidden')
}

/**
 * Shows spinner inside of button for posting new post
 * @param {HTMLElement} label 
 * @param {HTMLElement} spinner 
 */
function showSpinner(label, spinner) {
  label.classList.add('hidden')
  spinner.classList.remove('hidden')
  disableButton(spinner.parentElement);
}

const toggleClassesForPaths = paths => {
  Array.from(paths).forEach(path => {
    if (path.classList.contains('hidden')) {
      path.classList.remove('hidden')
      path.classList.add('inline-block')
    } else {
      path.classList.add('hidden')
      path.classList.remove('inline-block')
    }
  })
}
/**
 * 
 * @param {HTMLElement} likeButton 
 */
function animateButtonAfterClickOnLike(likeButton) {
  const svgHeartIcon = likeButton.querySelector('svg.heart-icon');
  const span = likeButton.parentElement.querySelector('span.likes-num')
  const paths = svgHeartIcon.querySelectorAll('path');
  let numOfLikes;

  if (svgHeartIcon.classList.contains('filled')) {
    svgHeartIcon.classList.remove('filled')
    svgHeartIcon.classList.remove('text-like-button-red')
    if (span) {
      span.classList.remove('text-like-button-red')
    }

    numOfLikes = Number(span.innerText) - 1;
    span.innerHTML = numOfLikes || '&nbsp;&nbsp;';
    toggleClassesForPaths(paths)

  } else {
    svgHeartIcon.classList.add('filled')
    svgHeartIcon.classList.add('animate__heartBeat')
    toggleClassesForPaths(paths)
    svgHeartIcon.classList.add('text-like-button-red')

    if (span) {
      span.classList.add('text-like-button-red')
    }

    numOfLikes = Number(span.innerText) + 1;
    span.innerHTML = numOfLikes || '&nbsp;&nbsp;';

    setTimeout(() => {
      svgHeartIcon.classList.remove('animate__heartBeat')
    }, 2000)
  }

}
/**
 * @param {HTMLElement} button 
 */
function animateButtonAfterClickOnRetweet(button) {
  const retweetIcon = button.querySelector('svg.retweet-icon');
  const span = button.parentElement.querySelector('span.retweet-num')
  let numOfRetweets;

  if (retweetIcon.classList.contains('filled')) {
    retweetIcon.classList.remove('filled')
    retweetIcon.classList.remove('text-retweet-button-green')

    if (span) {
      span.classList.remove('text-retweet-button-green')
    }
    numOfRetweets = Number(span.innerText) - 1;
    span.innerHTML = numOfRetweets || '&nbsp;&nbsp;';

  } else {
    retweetIcon.classList.add('filled')
    retweetIcon.classList.add('animate__swing')
    retweetIcon.classList.add('text-retweet-button-green')

    if (span) {
      span.classList.add('text-retweet-button-green')
    }

    numOfRetweets = Number(span.innerText) + 1;
    span.innerHTML = numOfRetweets || '&nbsp;&nbsp;';

    setTimeout(() => {
      retweetIcon.classList.remove('animate__swing')
    }, 2000)
  }

  span.innerHTML = numOfRetweets || '&nbsp;&nbsp;';
}

/** 
 * @param {HTMLElement} postBtn 
 * @param {Function} isAvailableFN 
 * @param {string} hoverClassToRemoveOrAdd 
 */
function toggleButtonAvailability(postBtn, isAvailableFN, hoverClassToRemoveOrAdd = 'hover:bg-comment-button-blue') {
  if (isAvailableFN()) {
    disableButton(postBtn, hoverClassToRemoveOrAdd)
  } else {
    enableButton(postBtn, hoverClassToRemoveOrAdd)
  }
}
/**
 * @param {Event} e 
 * @param {HTMLElement} postBtn 
 */
function toggleScrollForTextarea(e, postBtn) {
  e.target.style.height = 'auto';
  postBtn.disabled = e.target.value.trim().length == 0;

  if (e.target.scrollHeight > 150) {
    e.target.style.overflowY = 'scroll'
  } else {
    e.target.style.overflowY = 'hidden'
  }
  e.target.style.height = `${e.target.scrollHeight} `;
}

function setSeparatorHeightForAllReplies() {
  Array.from(
    document.querySelectorAll("div.posts-comment-wrapper")
  ).forEach(el => {
    const postWrapper = findPostWrapperElement(el, 'post-wrapper', true)
    const lineSeparator = postWrapper.querySelector('div.images-wrapper div.left-column__line-separator')
    const postOriginal = postWrapper.querySelector('div.original-post')
    lineSeparator.style.height = (postOriginal.offsetHeight - 70)
  })
}
/**
 * @param {Event} e 
 * @returns {string}
 */
function getProfileIdFromFollowButton(e) {
  const profileId = e.target.dataset.profileId

  if (!profileId) {
    console.error("Profile id is not defined");
    return
  }
  return profileId
}
/**
 * 
 * @param {Event} e 
 * @param {HTMLElement} label 
 * @param {HTMLElement} span 
 */
function toggleFollowButtons(e, label, span) {
  if (e.target.classList.contains('unfollow-button')) {
    e.target.classList.remove('unfollow-button')
    e.target.classList.add('follow-button')
    label.innerText = "Follow";
    const messageButton = document.querySelector('button.message-user-link')
    messageButton && messageButton.classList.add('hidden');
    if (span) span.innerText = Number(span.innerText) - 1;

  } else {
    e.target.classList.remove('follow-button')
    e.target.classList.add('unfollow-button')
    const messageButton = document.querySelector('button.message-user-link')
    messageButton && messageButton.classList.remove('hidden');
    label.innerText = "Following"
    if (span) span.innerText = Number(span.innerText) + 1;
  }
}

function clearPostPinnedArea() {
  document.querySelector("#profile-posts div.pinned-post-wrapper").innerHTML = '';
}
/**
 * 
 * @param {user} user 
 * @param {boolean} displayFollowButton 
 * @returns { HTMLElement }
 */
function createSearchResultRowElement(user, displayFollowButton = true) {
  const div = document.createElement('div');
  const row = createUserRowHTML(user)
  div.innerHTML = row
  const wrap = div.querySelector('div.follow-button-wrap')

  if (user.isFollowed) {
    displayFollowButton && wrap.appendChild(createFollowingButtonElement(user))
  } else {
    displayFollowButton && wrap.appendChild(createFollowButtonElement(user))
  }

  return div;
}
/**
 * @param {Array.<user>} selectedUsers 
 */
function displaySelectedUsers(selectedUsers) {
  const searchInputWrapper = document.querySelector("div#inbox div.user-list-wrapper span.users")
  if (selectedUsers.length > 0) {
    searchInputWrapper.classList.add('pr-2')
  } else {
    searchInputWrapper.classList.remove('pr-2')
  }
  searchInputWrapper.querySelectorAll('span.user-username').forEach(el => el.remove())

  selectedUsers.forEach(user => {
    const span = document.createElement('span')
    span.className = 'user-username px-2 py-1 mr-1 mb-1 inline-block text-brand-blue ';
    span.innerHTML = `${user.username}`
    searchInputWrapper.append(span)
  })
}
/**
 * Creates HTML div for every user in inbox search
 * @param {user} user 
 * @param {Array.<user>} selectedUsers 
 * @param {HTMLElement} searchInput 
 * @param {HTMLElement} contentWrapper 
 */
function createRowAndAddListener(user, selectedUsers, searchInput, contentWrapper) {
  const div = createSearchResultRowElement(user, false)
  const aTag = document.createElement("a");

  aTag.addEventListener('click', e => {
    e.stopPropagation();
    e.preventDefault();

    emptyTextboxAndContainer(searchInput, contentWrapper)
    selectedUsers.push(user);
    toggleButtonAvailability(createChatButton, () => selectedUsers.length == 0);
    displaySelectedUsers(selectedUsers)
  });
  aTag.appendChild(div)
  contentWrapper.append(aTag)
}
/**
 * @param {HTMLElement} searchInput 
 * @param {HTMLElement} contentWrapper 
 */
function emptyTextboxAndContainer(searchInput, contentWrapper) {
  searchInput.value = '';
  searchInput.focus();
  contentWrapper.innerHTML = '';
}
/**
 * Type can be sent or received
 * @param {message} message 
 * @param {string} type 
 * @param {Array.<String>} images 
 */
function addNewMessage(message, type, images) {
  const messagesContainer = document.querySelector('#inbox > div.chat-messages-wrapper div.chat-messages-container');
  const lastMessage = document.querySelector('#inbox > div.chat-messages-wrapper div.chat-messages-container div.message-container:last-child');

  const senderId = message.sender._id || message.sender;
  const lastMessageSenderId = lastMessage?.dataset['senderId'];

  var nameLabel = '';

  if (messagesContainer) {
    if (lastMessage && senderId != lastMessageSenderId) {
      nameLabel = createNewNameLabelHTML(message, type == 'sent')
    }
    const html = createNewMessageHTML(message, images, type == 'sent');
    messagesContainer.innerHTML += `${nameLabel} ${html}`
  }
}
/**
 * 
 * @param {HTMLElement} messagesContainer 
 */
function scrollMessagesToBottom(messagesContainer) {
  if (messagesContainer) {

    setTimeout(() => {
      messagesContainer.scrollTo({ top: messagesContainer.scrollHeight, behavior: 'smooth' });
    }, 300)
  }
}

function showTypingDots() {
  document.querySelector('div.chat-typing-container').classList.remove('hidden')
}

function hideTypingDots() {
  document.querySelector('div.chat-typing-container').classList.add('hidden')
}
/**
 * @param {notification} notification 
 * @returns HTMLElement
 */
function createNewNotification(notification) {
  const aTag = document.createElement('a');
  aTag.className = 'notification-link inline-block w-full active bg-comment-button-blue-background';
  aTag.setAttribute('notification-id', notification._id);

  if (notification.notificationType == 'follow') {
    aTag.href = `/profile/${notification.entity}`
  } else {
    aTag.href = `/post/${notification.entity}`
  }

  aTag.innerHTML = createNotificationRow(notification);

  return aTag;
}
/**
 * @param {String} chatId 
 * @param {HTMLElement} chatsContainer 
 * @returns {HTMLElement | null}
 */
function findChatElement(chatId, chatsContainer) {
  const chats = Array.from(chatsContainer.querySelectorAll('div[data-chat-id]'));
  const chat = chats.find(c => c.dataset.chatId == chatId);
  return chat
}
/**
 * @param {message} msg 
 * @returns { HTMLElement }
 */
function createChatRow(msg) {
  const chatContainer = document.createElement('div');
  chatContainer.className = `w-full px-6 py-2 border-b border-super-light-gray-border flex justify-between bg-comment-button-blue-background`;
  chatContainer.dataset.chatId = msg.chat._id || msg.chat;

  const chatContent = createChatRowContent(msg)
  chatContainer.innerHTML = chatContent
  return chatContainer;
}
/**
 * 
 * @param {HTMLElement} emojiButton 
 * @param {HTMLElement} tooltip 
 * @param {Function} onEmojiClick 
 */
function defineEmojiTooltip(emojiButton, tooltip, onEmojiClick) {
  if (emojiButton) {
    const emojiPicker = new Picker();

    emojiButton.addEventListener('click', (e) => {
      e.stopPropagation()
      tooltip.classList.toggle('hidden')
    })
    tooltip.appendChild(emojiPicker);

    emojiPicker.addEventListener('emoji-click', onEmojiClick)
    document.querySelector('body').addEventListener('click', () => tooltip.classList.add('hidden'))
    document.querySelector('emoji-picker').addEventListener('click', (e) => e.stopPropagation())
  }
}

function addEmojiToCommentModal() {
  const replyTa = document.querySelector('div#modal-container div.reply-aria textarea');
  const emojiButton = document.querySelector('#modal-container div.comment-modal__content div.modal-content__right-column div.reply-aria div.reply-icons-wrapper div.reply-icons button.emoji-modal-button');
  const commentPostButton = document.querySelector('div.reply-button-wrapper button.reply-comment-button')

  if (emojiButton) {
    defineEmojiTooltip(
      emojiButton,
      document.querySelector('#comment-emoji-tooltip'),
      (e) => {
        toggleButtonAvailability(
          commentPostButton,
          () => replyTa.value.trim() == 0,
          'hover:bg-comment-button-blue-background'
        )

        addEmojiToInput(e, replyTa)
      }
    )
  }
}
/**
 * 
 * @param {HTMLElement} uploadPreview 
 * @param {FileList} files 
 * @param {Function} onClickRemoveImage 
 */
function addSelectedImagesToPreview(uploadPreview, files, onClickRemoveImage) {
  Array.from(files).forEach(file => {
    const imgSrc = URL.createObjectURL(file);

    const div = document.createElement('div')
    const img = document.createElement('img')

    img.src = imgSrc;
    img.dataset['imageId'] = `${file.lastModified}-${file.name}`; //! ZAVRSI

    img.onload = function () {
      URL.revokeObjectURL(img.src) // free memory
    }

    div.className = 'image-wrapper relative ml-1 mt-1';
    const button = document.createElement('button');

    button.className = "absolute right-1 top-1 bg-white bg-opacity-50 rounded-full md:p-1"
    button.addEventListener('click', e => onClickRemoveImage(e, img))
    button.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true" class="w-4 pointer-events-none">
      <g>
        <path d="M13.414 12l5.793-5.793c.39-.39.39-1.023 0-1.414s-1.023-.39-1.414 0L12 10.586 6.207 4.793c-.39-.39-1.023-.39-1.414 0s-.39 1.023 0 1.414L10.586 12l-5.793 5.793c-.39.39-.39 1.023 0 1.414.195.195.45.293.707.293s.512-.098.707-.293L12 13.414l5.793 5.793c.195.195.45.293.707.293s.512-.098.707-.293c.39-.39.39-1.023 0-1.414L13.414 12z"></path>
      </g>
    </svg>`

    div.appendChild(button)
    div.appendChild(img)

    uploadPreview.appendChild(div);
  })
}
/**
 * 
 * @param {hashtag[]} hashtags 
 * @param {user[]} users 
 */
function createRowsAfterSearchInRightColumn(hashtags, users) {
  const hashtagsWrapper = document.querySelector('div.search-users-hastags-container > div.result-modal div.hashtags');
  const usersWrapper = document.querySelector('div.search-users-hastags-container > div.result-modal div.users');
  const wrapper = document.querySelector('div.search-users-hastags-container > div.result-modal');

  wrapper.classList.remove('hidden');

  if (!hashtags.length && !users.length) {
    hashtagsWrapper.innerHTML = 'No Results';
    return;
  }

  hashtagsWrapper.innerHTML = '';
  hashtags.forEach(h => {
    hashtagsWrapper.innerHTML += createRightColumnSearchRowForHashtag(h);
  })

  usersWrapper.innerHTML = '';
  users.forEach(u => {
    usersWrapper.innerHTML += createSmallRowForUser(u, `/profile/${u._id}`);
  })
}

export {
  enableButton,
  disableButton,
  addNewPost,
  showTypingDots,
  hideTypingDots,
  createSearchResultRowElement,
  addNewPostWithPredefinedButtons,
  hideSpinner,
  showSpinner,
  getProfileIdFromFollowButton,
  clearPostPinnedArea,
  findPostWrapperElement,
  animateButtonAfterClickOnLike,
  animateButtonAfterClickOnRetweet,
  toggleButtonAvailability,
  emptyImagePreviewContainer,
  emptyFileContainer,
  toggleScrollForTextarea,
  toggleFollowButtons,
  setSeparatorHeightForAllReplies,
  getPostIdForWrapper,
  openModal,
  displaySelectedUsers,
  createRowAndAddListener,
  addNewMessage,
  createNewNotification,
  scrollMessagesToBottom,
  findChatElement,
  defineEmojiTooltip,
  addEmojiToCommentModal,
  addSelectedImagesToPreview,
  createChatRow,
  createRowsAfterSearchInRightColumn
};

