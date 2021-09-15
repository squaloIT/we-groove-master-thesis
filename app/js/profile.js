import { setSeparatorHeightForAllReplies } from "./utils/dom-manipulation";
import imageCommentPreview from "./utils/image-comment-preview";
import { onClickToggleOnlineUsersWrapper, onClickUploadImageToServer, onClosePhotoModal, onFollowOrUnfollowClick, onSearchTopicsAndUsers, openPhotoEditModal } from "./utils/listeners";

export default function profile() {
  const cropper = {
    instance: null
  };
  imageCommentPreview()

  Array.from(
    document.querySelectorAll('div#profile div.profile-follow-buttons button.following-unfollowing')
  ).forEach(el => {
    el.addEventListener('click', e => onFollowOrUnfollowClick(e, e.target.classList.contains('follow-button') ? 'follow' : 'unfollow'))
  })

  const profilePhotoIcon = document.querySelector('div.profile-picture-container i.fa-camera-retro')
  const coverPhotoIcon = document.querySelector('div.profile-cover-picture i.fa-camera-retro')

  if (profilePhotoIcon && coverPhotoIcon) {
    profilePhotoIcon.addEventListener('click', e => openPhotoEditModal(e, 'profile', cropper))
    coverPhotoIcon.addEventListener('click', e => openPhotoEditModal(e, 'cover', cropper))

    document.querySelector("button#choose-file-button").addEventListener('click', e => {
      document.querySelector("#file-preview-wrapper input#photo").click()
    })
    document.querySelector("button.save-modal-button").addEventListener('click', e => onClickUploadImageToServer(e, cropper))
    document.querySelector("button.cancel-modal-button").addEventListener('click', e => onClosePhotoModal(e, cropper))
  }

  document.querySelector("div.right_column #topics-users-search")
    .addEventListener("keyup", onSearchTopicsAndUsers())

  document.querySelector("div.online-users-container div.online-users-header button.open-online-users")
    .addEventListener("click", e => onClickToggleOnlineUsersWrapper(e))

  document.querySelector("div.online-users-container div.online-users-header button.close-online-users")
    .addEventListener("click", e => onClickToggleOnlineUsersWrapper(e))

  setSeparatorHeightForAllReplies()
}
