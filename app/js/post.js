import imageCommentPreview from "./utils/image-comment-preview";
import { onClickToggleOnlineUsersWrapper, onSearchTopicsAndUsers } from "./utils/listeners";

export default function postJS() {
  imageCommentPreview()

  document.querySelector("div.right_column #topics-users-search")
    .addEventListener("keyup", onSearchTopicsAndUsers())

  document.querySelector("div.online-users-container div.online-users-header button.open-online-users")
    .addEventListener("click", e => onClickToggleOnlineUsersWrapper(e))

  document.querySelector("div.online-users-container div.online-users-header button.close-online-users")
    .addEventListener("click", e => onClickToggleOnlineUsersWrapper(e))
}