import { onClickOnNotification, onClickToggleOnlineUsersWrapper, onSearchTopicsAndUsers } from "./utils/listeners"

export default function notifications() {
  Array.from(
    document.querySelectorAll('#notifications > div.content-wrapper > a.notification-link')
  ).forEach(el => {
    el.addEventListener('click', onClickOnNotification)
  })

  document.querySelector("div.right_column #topics-users-search")
    .addEventListener("keyup", onSearchTopicsAndUsers())

  document.querySelector("div.online-users-container div.online-users-header button.open-online-users")
    .addEventListener("click", e => onClickToggleOnlineUsersWrapper(e))

  document.querySelector("div.online-users-container div.online-users-header button.close-online-users")
    .addEventListener("click", e => onClickToggleOnlineUsersWrapper(e))
}