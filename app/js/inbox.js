import { emitJoinRoom } from './client-socket';
import { searchUsers } from "./utils/api";
import { addSelectedImagesToPreview, createRowAndAddListener, defineEmojiTooltip, disableButton, displaySelectedUsers, scrollMessagesToBottom, toggleButtonAvailability } from "./utils/dom-manipulation";
import { addEmojiToInput, onClickCreateChat, onClickSaveChatNameButton, onClickToggleOnlineUsersWrapper, onSearchTopicsAndUsers, onSendMessage, updateTyping } from "./utils/listeners";
import { validateNumberOfImages } from "./utils/validation";

export default function inbox() {
  var timer = null;
  var selectedImages = [];

  const selectedUsers = [];
  const contentWrapper = document.querySelector('div#inbox div.content-wrapper');
  const searchInput = document.querySelector('input#search-user')
  const createChatButton = document.querySelector('button#createChatButton')
  const chatNameHeader = document.querySelector('div#inbox div.header-chat-name')
  const chatMessageInput = document.querySelector('div#inbox textarea.chat-message-ta')
  const emojiButton = document.querySelector('#emoji-button');
  const sendMessageButton = document.querySelector('#send-message-button');
  const chatMessagesContainer = document.querySelector('#inbox div.chat-messages-container');
  const urlParts = window.location.pathname.split('/')
  const chatId = urlParts[urlParts.length - 1]

  document.querySelector("div.right_column #topics-users-search")
    .addEventListener("keyup", onSearchTopicsAndUsers())

  document.querySelector("div.online-users-container div.online-users-header button.open-online-users")
    .addEventListener("click", e => onClickToggleOnlineUsersWrapper(e))

  document.querySelector("div.online-users-container div.online-users-header button.close-online-users")
    .addEventListener("click", e => onClickToggleOnlineUsersWrapper(e))

  if (chatMessagesContainer) {
    scrollMessagesToBottom(chatMessagesContainer)
  }

  if (sendMessageButton) {
    const inputFileImages = document.querySelector('#message-images-for-upload');
    var uploadPreview = document.querySelector('#inbox > div.chat-messages-wrapper div.upload-images-preview-wrapper');

    emitJoinRoom(chatId);

    disableButton(sendMessageButton, 'hover:bg-comment-button-blue-background')
    sendMessageButton.addEventListener('click', (e) => {
      onSendMessage(e, chatMessageInput, chatMessagesContainer, selectedImages).then(clearImagePreview)
    })

    chatMessageInput.addEventListener('keyup', e => {
      updateTyping(chatId)
      toggleButtonAvailability(
        sendMessageButton,
        () => e.target.value.trim() == 0 && selectedImages.length == 0,
        'hover:bg-comment-button-blue-background'
      )
      if (e.keyCode == 13 || e.which == 13) {
        onSendMessage(e, e.target, chatMessagesContainer, selectedImages).then(clearImagePreview)
        // scrollMessagesToBottom(chatMessagesContainer)
      }
    })

    document.querySelector('#inbox button.message-image-button')
      .addEventListener('click', () => {
        inputFileImages.click()
        inputFileImages.removeEventListener('change', validateAndPreviewImages)
        inputFileImages.addEventListener('change', validateAndPreviewImages)
      })
  }

  if (emojiButton) {
    defineEmojiTooltip(
      emojiButton,
      document.querySelector('#chat-emojis-tooltip'),
      (e) => {
        toggleButtonAvailability(
          sendMessageButton,
          () => chatMessageInput.value.trim() == 0 && selectedImages.length == 0,
          'hover:bg-comment-button-blue-background'
        )

        updateTyping(chatId)
        addEmojiToInput(e, chatMessageInput)
      }
    );
  }

  if (chatNameHeader) {
    chatNameHeader.addEventListener('click', function (e) {
      const chatId = e.target.dataset.chatId;
      const currentChatName = chatNameHeader.innerText;

      const modal = document.querySelector('#modal-container')
      modal.classList.remove('hidden')
      const chatName = modal.querySelector('input#chat-name');
      chatName.setAttribute('value', currentChatName)
      const saveButton = modal.querySelector('.save-modal-button')
      saveButton.addEventListener(
        'click',
        e => onClickSaveChatNameButton(e, modal, chatId)
      )

      if (chatName.value.trim().length == 0) {
        disableButton(saveButton, 'hover:bg-comment-button-blue')
      }

      const closebutton = modal.querySelector('.close-modal-button')
      closebutton.addEventListener('click', () => {
        modal.classList.add('hidden')
        chatName.value = ''
      })

      const cancelButton = modal.querySelector('.cancel-modal-button')
      cancelButton.addEventListener('click', () => {
        modal.classList.add('hidden')
        chatName.value = ''
      })

      chatName.addEventListener('keyup', function (e) {
        toggleButtonAvailability(saveButton, () => chatName.value.trim().length == 0);
      })

    })
  }

  if (searchInput) {
    searchInput.addEventListener('keyup', function (e) {
      clearTimeout(timer)
      const value = e.target.value.trim()

      //* This means that users wants to delete some of the users that are already selected
      if (value == '' && e.keyCode == 8) {
        deleteUserFromSelectedUsers(selectedUsers, createChatButton, contentWrapper)
      }

      timer = setTimeout(function () {
        contentWrapper.innerHTML = "";

        if (value != '' && value.length > 2) {
          searchUsers(value)
            .then(({ data, status, msg }) => {
              if (status == 200) {
                data.forEach(user => {
                  if (selectedUsers.some(u => u._id == user._id)) {
                    console.log("ALREADY SELECTED")
                    return;
                  }

                  createRowAndAddListener(user, selectedUsers, searchInput, contentWrapper)
                })
              }
            })
            .catch(err => {
              console.error(err);
            })
        }
      }, 1000)
    })
  }

  createChatButton && createChatButton.addEventListener('click', e => onClickCreateChat(e, selectedUsers))

  function deleteUserFromSelectedUsers(selectedUsers, createChatButton, contentWrapper) {
    selectedUsers.pop();
    toggleButtonAvailability(createChatButton, () => selectedUsers.length == 0)
    displaySelectedUsers(selectedUsers)
    contentWrapper.innerHTML = '';
  }

  function clearImagePreview() {
    uploadPreview.innerHTML = '';
    uploadPreview.classList.add('hidden')
    selectedImages = []
  };

  function validateAndPreviewImages(e) {
    if (validateNumberOfImages(e)) {
      uploadPreview.innerHTML = '';
      uploadPreview.classList.remove('hidden')
      selectedImages = Array.from(e.target.files)
      addSelectedImagesToPreview(uploadPreview, e.target.files, (e, img) => {
        const imageId = img.dataset.imageId;
        const deletedImage = selectedImages.find(file => imageId == `${file.lastModified}-${file.name}`)

        selectedImages = selectedImages.filter(file => file != deletedImage)
        const imageWrapper = document.querySelector(`.image-wrapper img[data-image-id="${deletedImage.lastModified}-${deletedImage.name}"]`).parentElement;
        imageWrapper.remove()

        if (selectedImages.length == 0) {
          uploadPreview.classList.add('hidden')
        }
      })

      toggleButtonAvailability(
        sendMessageButton,
        () => chatMessageInput.value.trim() == 0 && selectedImages.length == 0,
        'hover:bg-comment-button-blue-background'
      )

    } else {
      uploadPreview.classList.add('hidden')
      selectedImages = []
    }
  }
}