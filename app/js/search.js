import { searchTermByType } from './utils/api'
import { addNewPostWithPredefinedButtons, createSearchResultRowElement, setSeparatorHeightForAllReplies } from "./utils/dom-manipulation"
import imageCommentPreview from './utils/image-comment-preview'
import { onClickToggleOnlineUsersWrapper, onFollowOrUnfollowClick, onSearchTopicsAndUsers } from "./utils/listeners"
export default function search() {
  imageCommentPreview()

  Array.from(
    document.querySelectorAll('div#profile div.profile-follow-buttons button.following-unfollowing')
  ).forEach(el => {
    el.addEventListener('click', e => onFollowOrUnfollowClick(e, e.target.classList.contains('follow-button') ? 'follow' : 'unfollow'))
  })

  document.querySelector("div.right_column #topics-users-search")
    .addEventListener("keyup", onSearchTopicsAndUsers())

  document.querySelector("div.online-users-container div.online-users-header button.open-online-users")
    .addEventListener("click", e => onClickToggleOnlineUsersWrapper(e))

  document.querySelector("div.online-users-container div.online-users-header button.close-online-users")
    .addEventListener("click", e => onClickToggleOnlineUsersWrapper(e))

  /** @type { HTMLElement } */
  const searchResults = document.querySelector('div#search-results')

  var timer = null;
  document.querySelector('input#search').addEventListener('keyup', function (e) {
    clearTimeout(timer);
    const value = e.target.value;
    const searchType = e.target.dataset.type;

    timer = setTimeout(() => {
      searchResults.innerHTML = ''
      if (value === '') {
        searchResults.innerHTML = ''
      } else {

        searchTermByType(searchType, value)
          .then(({ data }) => {
            data.forEach(elem => {
              if (searchType == 'posts') {
                addNewPostWithPredefinedButtons(searchResults, elem)
              }
              else if (searchType === 'users') {
                const div = createSearchResultRowElement(elem, true)
                searchResults.append(div);
              }
            })
          })
          .catch(err => {
            console.error(err)
          })
      }

    }, 1000)
  });

  setSeparatorHeightForAllReplies()
}
