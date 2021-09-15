import { onClickCommentPost, onClickDeletePost, onClickLikePost, onClickRetweetPost, onFollowOrUnfollowClick } from './listeners';

/** @returns String */
const getDeleteButtonContent = () => `<svg viewBox="0 0 24 24" aria-hidden="true" class="fill-current pointer-events-none text-mid-gray-for-text post-icon">
    <g><path class='' d="M13.414 12l5.793-5.793c.39-.39.39-1.023 0-1.414s-1.023-.39-1.414 0L12 10.586 6.207 4.793c-.39-.39-1.023-.39-1.414 0s-.39 1.023 0 1.414L10.586 12l-5.793 5.793c-.39.39-.39 1.023 0 1.414.195.195.45.293.707.293s.512-.098.707-.293L12 13.414l5.793 5.793c.195.195.45.293.707.293s.512-.098.707-.293c.39-.39.39-1.023 0-1.414L13.414 12z"></path></g>
</svg>`;

/** @returns String */
const getFollowButtonContent = text => `<span class='follow-button__label pointer-events-none text-xs sm:text-sm md:text-base'>${text}</span>
<i class="follow-button__spinner hidden fas fa-spinner fa-pulse"></i>`;

/** @returns String */
const getCommentButtonContent = () => `<svg viewBox="0 0 24 24" aria-hidden="true" class="inline-block fill-current post-icon align-text-bottom"><g><path d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.335-.75-.75-.75h-.396c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z"></path></g></svg>`;

/** @returns String */
const getRetweetButtonContent = (post = null) => `<svg viewBox="0 0 24 24" aria-hidden="true" class="retweet-icon animate__animated pointer-events-none inline-block fill-current post-icon align-text-bottom ${post && post.isRetweeted ? 'text-retweet-button-green filled' : ''}">
<g>
  <path d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z"></path>
</g>
</svg>`;

/** @returns String */
const getLikeButtonContent = (post = null) => `<svg viewBox="0 0 24 24" aria-hidden="true" class="animate__animated heart-icon pointer-events-none inline-block fill-current post-icon align-text-bottom ${post?.isLiked ? 'text-like-button-red filled' : ''}">
<g>
 
    <path class="${post?.isLiked ? 'inline-block' : 'hidden'}" d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z"></path>
  
    <path class="${post?.isLiked ? 'hidden' : 'inline-block'}" d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.823-4.255-3.903-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z"></path>
  
</g>
</svg>`;

/**
 * Creates html string for post.  
 * @param { String } content 
 * @param { user } user  
 * @param { Timestamp } createdAt 
 * @returns String
 */
function createPostHTML(content, user, createdAt) {
  const {
    _id,
    profilePic,
    username,
    fullName
  } = user;

  return `<div class="post__image-container w-10 sm:w-12 md:w-14">
    <a href="/profile/${user.username}" class='cursor-pointer'>
      <img
        class="rounded-full bg-white"
        src="${profilePic}"
        alt="${username} profile pic"
      />
    </a>
  </div>

  <div class='post-content-container flex flex-col w-full'>
    <div class='post-content__info flex flex-row items-center w-full'>
      <div class='w-10/12 sm:w-8/12 flex flex-row items-center'>
        <div class="post-content-info__username-container">
          <p class="name">
            <a href="/profile/${user.username}">${fullName} -
            </a>
          </p>
        </div>

        <div class="post-content-info__email-container">
          <a class="username text-brand-blue font-medium" href="/profile/${user.username}">@${username} </a>
        </div>

        <div class="post-content-info__time-container ml-1">
          <p class="time font-normal">- ${createdAt}</p>
        </div>
      </div>

      <div class='w-2/12 sm:w-4/12'>
        <div class="delete-post-button-wrapper flex items-start justify-end pr-2">

        </div>
      </div>
    </div>

    <div class="post-content__text w-full mt-1 cursor-pointer">
      <p class='text-sm md:text-base whitespace-pre-line'>${content}</p>
    </div>

    <div class='w-full flex flex-row justify-end mt-2'>
      <div class="w-full post-content__buttons justify-between flex flex-row">
        <div class="flex justify-start button-comment-wrapper">

        </div>

        <div class="flex justify-end button-retweet-wrapper">

        </div>

        <div class="flex justify-end button-like-wrapper">

        </div>
      </div>
    </div>
  </div>`
}

/**
 * @param { String } postId 
 * @param { String } content 
 * @param { user } user 
 * @param { Timestamp } createdAt 
 * @returns { HTMLElement }
 */
function createPostElement(postId, content, user, createdAt) {
  const postElement = document.createElement('div')
  const contentWithHashTags = colorHashtagsInText(content)

  postElement.className = `post-wrapper w-full border-b border-super-light-gray-border flex flex-row space-x-5 py-2 lg:py-3 px-2 sm:px-4 lg:px-8 justify-between animate__animated`;
  postElement.dataset.pid = postId;
  postElement.innerHTML = createPostHTML(contentWithHashTags, user, createdAt)
  return postElement;
}

function createHashtag(text) {
  var repl = text.replace(/#(\w+)/g, '<span class="text-brand-blue pointer-events-none">#$1</span>');
  return repl;
}

function colorHashtagsInText(content) {
  const contentArr = content.split(" ");
  const hashtags = contentArr.filter(v => v.startsWith('#'))
  return contentArr.map(txt => hashtags.includes(txt) ? createHashtag(txt) : txt).join(" ");
}
/**
 * @param { HTMLElement } postElement 
 * @param { String } wrapperClass 
 * @param { Function } fnToCreateElements 
 */
function createElementForButtonWrapper(postElement, wrapperClass, fnToCreateElements) {
  const wrapper = postElement.querySelector(wrapperClass)
  const { span, button } = fnToCreateElements()
  wrapper.appendChild(button)
  if (span) {
    wrapper.appendChild(span)
  }
}

/** @returns { buttonWrapperElements } */
function createCommentButtonElements(post = null) {
  const button = document.createElement('button')
  // button.className = 'comment-button -ml-2 hover:bg-comment-button-blue-background hover:text-comment-button-blue p-2 rounded-full'
  button.className = 'comment-button -ml-2 hover:bg-comment-button-blue-background hover:text-comment-button-blue p-2 rounded-full transparent-borderless-spinneles-element'
  button.addEventListener('click', onClickCommentPost);
  button.innerHTML = getCommentButtonContent()

  const span = document.createElement('span')
  span.className = 'comment-num  text-sm sm:text-base flex items-center font-normal text-gray-700 ml-1';
  span.innerHTML = post && post.numOfComments > 0 ? post.numOfComments : '&nbsp;&nbsp;';

  return { button, span }
}

/** @returns { buttonWrapperElements } */
function createRetweetButtonElements(post = null) {
  const button = document.createElement('button')
  // button.className = 'retweet-post hover:bg-retweet-button-green-background hover:text-retweet-button-green p-2 rounded-full'
  button.className = 'retweet-post hover:bg-retweet-button-green-background hover:text-retweet-button-green p-2 rounded-full transparent-borderless-spinneles-element'
  button.addEventListener('click', onClickRetweetPost);
  button.innerHTML = getRetweetButtonContent(post)

  const span = document.createElement('span')
  span.className = 'retweet-num text-sm sm:text-base flex items-center font-normal ml-1';

  if (post && post.isRetweeted) {
    span.classList.add('text-retweet-button-green')
  } else {
    span.classList.add('text-gray-700')
  }
  span.innerHTML = post && post.isRetweeted ? post.retweetUsers.length : '&nbsp;&nbsp;';

  return { button, span }
}

/** @returns { buttonWrapperElements } */
function createLikeButtonElements(post = null) {
  const button = document.createElement('button')
  button.className = 'post-like hover:bg-like-button-red-background hover:text-like-button-red p-2 rounded-full transparent-borderless-spinneles-element'
  button.addEventListener('click', onClickLikePost);
  button.innerHTML = getLikeButtonContent(post)

  const span = document.createElement('span')
  span.className = 'likes-num text-sm sm:text-base flex items-center font-normal';
  if (post && post.isLiked) {
    span.classList.add('text-like-button-red')
    span.classList.add('filled')
  } else {
    span.classList.add('text-gray-700')
  }
  span.innerHTML = post && post.isLiked ? post.likes.length : '&nbsp;&nbsp;';

  return { span, button }
}

/** @returns { buttonWrapperElements } */
function createDeleteButtonElements() {
  const button = document.createElement('button')
  button.className = 'cursor-pointer delete-post-button focus:outline-none p-2 rounded-full'
  button.addEventListener('click', onClickDeletePost);
  button.innerHTML = getDeleteButtonContent()

  return { span: null, button }
}

/** @returns { HTMLElement } */
function createFollowButtonElement(user) {
  const button = document.createElement('button')
  button.dataset.profileId = user._id;

  button.className = 'following-unfollowing follow-button following-unfollowing-button'
  button.addEventListener('click', e => onFollowOrUnfollowClick(e, 'follow'));
  button.innerHTML = getFollowButtonContent("Follow")

  return button
}

/** @returns { HTMLElement } */
function createFollowingButtonElement(user) {
  const button = document.createElement('button')
  button.dataset.profileId = user._id;

  button.className = 'following-unfollowing unfollow-button cursor-pointer following-unfollowing-button'
  button.addEventListener('click', e => onFollowOrUnfollowClick(e, 'unfollow'));
  button.innerHTML = getFollowButtonContent("Following")

  return button
}
/**
 * 
 * @param {user} user 
 * @returns 
 */
function createUserRowHTML(user) {
  return `<div class='follow-user-row'>
  <div class='w-4/5 flex'>
    <div class="image-container w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14">
      <a href="/profile/${user.username}">
        <img class='w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white' src="${user.profilePic}" alt="${user.username}" />
      </a>
    </div>

    <div class='info ml-3 sm:ml-4 md:ml-6 mr-1 font-roboto w-[85%]'>
      <a href="/profile/${user.username}">
        <p class='full-name text-sm sm:text-base font-bold'>${user.fullName}</p>
        <p class='username text-sm sm:text-base text-brand-dark-gray'>@${user.username}</p>
        <p class='description text-sm sm:text-base'>${user.description}</p>
      </a>
    </div>
  </div>
  
  <div class='w-1/5 flex flex-col justify-start follow-button-wrap'>

   
  </div>
</div>`
}
/**
 * 
 * @param {message} message 
 * @param {Array.<String>} images 
 * @param {Boolean} isSent 
 * @returns 
 */
function createNewMessageHTML(message, images, isSent) {
  return `
  <div class='message-container ${isSent ? 'sent' : 'received'} flex w-full px-4 mb-2' data-sender-id="${message.sender._id || message.sender}">
    <div class='incoming-message max-w-[75%] sm:max-w-[65%] md:max-w-[55%]'>
      <span class='inline-block px-4 py-2 rounded-2xl  text-sm sm:text-base'>
        ${message.content}
        
        ${images.length > 0 ? `
          <div class='mt-2'>
            ${images.map(src => `<img src='${src}' class='max-h-60 max-w-full mb-2' />`).join('')}
          </div>
        ` : ''}
      </span>

    </div>
  </div>
  `
}
/**
 * 
 * @param {message} message 
 * @param {Boolean} isSent 
 * @returns 
 */
function createNewNameLabelHTML(message, isSent) {
  return `
  <div class='message-container ${isSent ? 'justify-end' : 'justify-start'} flex w-full px-4 mb-2' data-sender-id="${message.sender._id || message.sender}">
    <div class=' max-w-[55%]'>

      <span class='sender-username  ${isSent ? 'text-brand-blue' : 'text-brand-purple'}  font-semibold'>
        ${message.sender.fullName}
      </span>

    </div>
  </div>
  `
}
/**
 * 
 * @param {notification} notification 
 */
function createNotificationRow(notification) {
  let div = `<div class='notification-container w-full p-3 flex flex-1 items-center font-roboto pointer-events-none'>
      <div class="image-container  w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14">
        <img class='w-10 sm:w-12 md:w-14 rounded-full bg-white' src='${notification.userFrom.profilePic}' alt="${notification.userFrom.username}" title='${notification.userFrom.username}' />
      </div>

      <div class='flex items-center justify-between w-full space-x-1 ml-3 pointer-events-none'>
          <div class='pointer-events-none'>
              <span class='notification-user-fullName text-dark-gray-for-text  pointer-events-none'>
                ${notification.userFrom.fullName}
              </span>
                  `
  let notificationText = '';

  if (notification.notificationType == 'follow') {
    notificationText = "<span class='notification-text text-dark-gray-for-text  pointer-events-none'> has started following you</span>"
  }
  else if (notification.notificationType == 'retweet') {
    notificationText = "<span class='notification-text text-dark-gray-for-text  pointer-events-none'> has re-posted one of your posts</span>"
  }
  else if (notification.notificationType == 'like') {
    notificationText = "<span class='notification-text text-dark-gray-for-text  pointer-events-none'> liked one of your posts</span>"
  }
  else if (notification.notificationType == 'comment') {
    notificationText = "<span class='notification-text text-dark-gray-for-text  pointer-events-none'> replied to one of your posts</span>"
  }
  else {
    notificationText = "<span class='notification-text text-dark-gray-for-text  pointer-events-none'> SHOULD NOT HAPPEN</span>"
  }

  div += `
                ${notificationText}
              </div>

            ${!notification.read ? "<div class='p-1 rounded-full bg-brand-purple pointer-events-none'></div>" : ""}
          </div>
        </div>
  `
  return div;
}
/**
 * 
 * @param {message} msg
 * @returns {String} 
 */
function createChatRowContent(msg) {
  return `
    <div class='chat-image-rounded w-1/12'>
      <a href="/messages/${msg.chat._id || msg.chat}">
        ${createImagesForChatRow(msg.chat, msg.sender)}
      </a>
    </div>

    <div class='chat-info-messages w-11/12 ml-3'>
      <a href="/messages/${msg.chat._id}">
        <h4 class='text-xl overflow-hidden whitespace-nowrap overflow-ellipsis font-semibold'>
          ${msg.chat.users.length > 1 ? (msg.chat.chatName || msg.chat.users.map(u => u.fullName).join(", ")) : msg.sender.fullName}
        </h4>

        <p class='text-brand-dark-gray text-lg overflow-hidden whitespace-nowrap overflow-ellipsis font-medium'>
          ${msg.sender.fullName}: ${msg.content}
        </p>
      </a>
    </div>
  </div>
  `
}
/**
 * @param {message} chat 
 * @param {user} sender 
 * @returns { String }
 */
function createImagesForChatRow(chat, sender) {
  if (chat.users.length > 1) {
    return `<div class="image-container  w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 relative">
    <img 
      class='w-6 sm:w-8 md:w-10 h-6 sm:h-8 md:h-10  rounded-full bg-white absolute bottom-0 left-0 z-20' 
      src="${chat.users[0].profilePic}" 
      alt="${chat.users[0].username}" 
      title=${chat.users[0].username}
    />
    <img 
      class='w-6 sm:w-8 md:w-10 h-6 sm:h-8 md:h-10  rounded-full bg-white absolute right-0 top-0 z-10' 
      src="${chat.users[1].profilePic}" 
      alt="${chat.users[1].username}" 
      title=${chat.users[1].username}
    />
  </div>`

  } else {
    return `
      <div class="image-container  w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14">
        <img class='w-10 sm:w-12 md:w-14 rounded-full bg-white' src="${sender.profilePic}" alt="${sender.username}" title="${sender.username}" />
      </div>`
  }
}
/**
 * 
 * @param {hashtag} hashtag 
 * @returns { string }
 */
const createRightColumnSearchRowForHashtag = (hashtag) => {
  return `<a href='/topic/${hashtag._id}'>
    <div class='hash-row py-2 px-3 border-t border-light-gray-for-text border-opacity-20 hover:bg-light-gray-for-text hover:bg-opacity-20'>
      <p class='font-bold text-dark-gray-for-text'>${hashtag.hashtag}</p>
    </div>
  </a>`
}

/**
 * 
 * @param {user} user 
 * @param {string} href 
 * @returns { string }
 */
const createSmallRowForUser = (user, href) => {
  return `
      <a href='${href}' data-user-id='${user._id}'>
        <div class='user-row flex justify-between p-2 items-center border-b border-light-gray-for-text border-opacity-20 hover:bg-light-gray-for-text hover:bg-opacity-20'>
          <div class='image-container flex items-center'>
            <div class="image-container  w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14">
              <img class='w-10 sm:w-12 md:w-14 rounded-full bg-white' src="${user.profilePic}" alt="${user.username}" title='${user.username}' />
            </div>
          </div>

          <div class='content-container flex flex-col justify-between w-full pl-2'>
            <h6 class='font-bold'>${user.fullName}</h6>
            <p class='font-light text-sm text-light-gray-for-text'>@${user.username}</p>
          </div>
        </div>
      </a>`
}
function createAudioBlock(user) {
  return `
    <div data-uid="${user._id}" class='call-user-wrapper flex flex-col items-center py-8 justify-evenly border-2 border-gray-200 rounded-md'>
      <h4 class='text-2xl text-gray-200 uppercase tracking-wider'>${user.username}</h4>
      <div class="image-container mt-10 w-32 h-32">
        <img class='w-32 h-32 rounded-full bg-white' src="${user.profilePic}" alt="${user.username}" title=${user.username} />
      </div> 
    </div> `
}
/**
 * 
 * @param {HTMLElement} video 
 * @param {user} user 
 * @returns HTMLElement
 */
function createVideoCallBlock(video, user) {
  const divVideoWrapper = document.createElement('div')

  video.classList.add("object-fill")
  video.classList.add("cursor-pointer")
  video.classList.add("w-full")
  video.classList.add("h-full")

  divVideoWrapper.classList.add("video-wrapper")
  divVideoWrapper.classList.add("hover:border")
  divVideoWrapper.classList.add("hover:border-white")
  divVideoWrapper.classList.add("lg:max-h-80")
  divVideoWrapper.classList.add("lg:max-w-none")
  divVideoWrapper.classList.add("max-w-[200px]")
  divVideoWrapper.classList.add("lg:mb-4")
  divVideoWrapper.classList.add("relative")

  divVideoWrapper.append(video);
  // divVideoWrapper.append(h2);

  return divVideoWrapper
}

export {
  createPostHTML,
  getCommentButtonContent,
  getDeleteButtonContent,
  getLikeButtonContent,
  createFollowingButtonElement,
  createFollowButtonElement,
  createUserRowHTML,
  getRetweetButtonContent,
  createDeleteButtonElements,
  createCommentButtonElements,
  createElementForButtonWrapper,
  createLikeButtonElements,
  createPostElement,
  createRetweetButtonElements,
  createNotificationRow,
  createNewMessageHTML,
  createChatRowContent,
  createNewNameLabelHTML,
  createRightColumnSearchRowForHashtag,
  createSmallRowForUser,
  createAudioBlock,
  createVideoCallBlock
};

