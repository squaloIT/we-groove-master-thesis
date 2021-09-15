import { setSeparatorHeightForAllReplies } from './utils/dom-manipulation';
import imageCommentPreview from './utils/image-comment-preview';
import { onSearchTopicsAndUsers } from './utils/listeners';

export default function topics() {
  imageCommentPreview()

  const taReply = document.querySelector("div.reply-aria textarea")
  taReply.addEventListener('keyup', function (e) {
    if (e.target.scrollHeight > 110) {
      e.target.style.overflowY = 'scroll'
    } else {
      e.target.style.overflowY = 'hidden'
      e.target.style.height = `${e.target.scrollHeight}`;
    }

  });

  setSeparatorHeightForAllReplies()

  document.querySelector("div.right_column #topics-users-search")
    .addEventListener("keyup", onSearchTopicsAndUsers())

  document.querySelector("div.online-users-container div.online-users-header button.open-online-users")
    .addEventListener("click", e => onClickToggleOnlineUsersWrapper(e))

  document.querySelector("div.online-users-container div.online-users-header button.close-online-users")
    .addEventListener("click", e => onClickToggleOnlineUsersWrapper(e))
}