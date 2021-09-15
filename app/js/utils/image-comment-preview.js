import { replyToPost } from "./api";
import { addSelectedImagesToPreview, hideSpinner, showSpinner, toggleButtonAvailability } from "./dom-manipulation";
import { addAllListenersToPosts } from "./listeners";
import { validateNumberOfImages } from "./validation";

export default function imageCommentPreview() {
  var selectedImagesForComment = [];

  document.querySelector('div.reply-button-wrapper button.reply-comment-button')
    .addEventListener('click', onClickCommentButton)

  addAllListenersToPosts((e) => {
    const uploadPreview = document.querySelector('#modal-container div.upload-images-preview-wrapper');
    const taReply = document.querySelector("#modal-container div.reply-aria textarea")
    const submitCommentBtn = document.querySelector('div.reply-button-wrapper button.reply-comment-button')

    if (validateNumberOfImages(e)) {
      uploadPreview.innerHTML = '';
      uploadPreview.classList.remove('hidden')
      selectedImagesForComment = Array.from(e.target.files)
      addSelectedImagesToPreview(uploadPreview, e.target.files, (e, img) => {
        const imageId = img.dataset.imageId;
        const deletedImage = selectedImagesForComment.find(file => imageId == `${file.lastModified}-${file.name}`)

        selectedImagesForComment = selectedImagesForComment.filter(file => file != deletedImage)
        const imageWrapper = document.querySelector(`.image-wrapper img[data-image-id="${deletedImage.lastModified}-${deletedImage.name}"]`).parentElement;
        imageWrapper.remove()

        if (selectedImagesForComment.length == 0) {
          uploadPreview.classList.add('hidden')
        }
      })

      toggleButtonAvailability(
        submitCommentBtn,
        () => taReply.value.trim() == 0 && selectedImagesForComment.length == 0,
        'bg-opacity-100'
      )

    } else {
      uploadPreview.classList.add('hidden')
      selectedImagesForComment = []
    }
  })

  /**
   * @param {Event} e 
   */
  function onClickCommentButton(e) {
    e.stopPropagation();
    const pid = e.target.dataset.pid;
    const content = document.querySelector("div#modal-container div.reply-aria textarea").value;

    const commentButtonLabel = document.querySelector('div#modal-container div.reply-button-wrapper span.comment-button__label')
    const commentButtonSpinner = document.querySelector('div#modal-container div.reply-button-wrapper .comment-button__spinner')
    showSpinner(commentButtonLabel, commentButtonSpinner)
    const modal = document.querySelector('#modal-container')

    replyToPost(pid, content, selectedImagesForComment)
      .then(res => res.json())
      .then(({ status }) => {
        if (status == 201) {
          hideSpinner(commentButtonLabel, commentButtonSpinner);
          location.reload()
        }
        modal.classList.add('hidden')
      })
      .catch(err => {
        hideSpinner(commentButtonLabel, commentButtonSpinner)
        console.error(err)
        modal.classList.add('hidden')
      });
  }
}