import './../styles/tailwind.css';
import { connectClientSocket } from './client-socket';

if (
  window.location.pathname != '/login' &&
  window.location.pathname != '/registration'
) {
  const jwtUser = document.querySelector("input#test").value;
  connectClientSocket(jwtUser)

  const audioRingtone = document.querySelector("#ringtone");
  if (audioRingtone) {
    console.log("🚀 ~ file: script.js ~ line 13 ~ audioRingtone", audioRingtone)
    audioRingtone.load();
  }

  if (window.location.pathname.indexOf('/call_room') !== 0) {
    let deferredPrompt;
    const addBtn = document.getElementById('install-app-button')
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;

      addBtn.addEventListener('click', () => {
        document.querySelector("#install-button-wrapper").remove();
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            localStorage.setItem("installed", "true")
            console.log('User accepted the A2HS prompt');
          } else {
            console.log('User dismissed the A2HS prompt');
          }
          deferredPrompt = null;
        });
      });
    });

    document.querySelector('#close-install-popup').addEventListener('click', function () {
      document.querySelector("#install-button-wrapper").remove()
    })
  }
}

if (window.location.pathname.indexOf('/post') == 0) {
  import('./post').then(({ default: postJS }) => {
    postJS();
  })
}

if (window.location.pathname == '/') {
  if ('serviceWorker' in navigator) {
    // Use the window load event to keep the page load performant
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('service-worker.js').then(res => {
        console.log("Service worker registered")
        console.log(res)
      });

    });
  }
  import('./index').then(({ default: index }) => {
    index();
  })
}

if (window.location.pathname.indexOf('/profile') == 0) {
  import('./profile').then(({ default: profile }) => {
    profile();
  })
}

if (window.location.pathname.indexOf('/search') == 0) {
  import('./search').then(({ default: search }) => {
    search();
  })
}

if (window.location.pathname.indexOf('/messages') == 0) {
  import('./inbox').then(({ default: inbox }) => {
    inbox();
  })
}

if (window.location.pathname.indexOf('/notifications') == 0) {
  import('./notifications').then(({ default: notifications }) => {
    notifications();
  })
}

if (window.location.pathname.indexOf('/topic') == 0) {
  import('./topics').then(({ default: topics }) => {
    topics();
  })
}

if (window.location.pathname != '/login' && window.location.pathname != '/registration' && window.location.pathname.indexOf('/call_room') !== 0) {
  document.querySelector('#close_hamburger_overlay_btn').addEventListener('click', () => {
    const nav = document.getElementById("myNav");
    nav.style.height = "0%";
    nav.style.borderBottomWidth = '0px';
  })
  document.querySelector('#open_hamburger_overlay_btn').addEventListener('click', () => {
    const nav = document.getElementById("myNav");
    nav.style.height = "100%";
    nav.style.borderBottomWidth = '8px';
    // nav.style.borderWidth = '4px';
    nav.style.borderColor = 'rgb(67, 62, 144)';
  })
}

if (window.location.pathname == '/login') {
  import('./login').then(({ default: login }) => {
    login();
  })
}

if (window.location.pathname == '/registration') {
  import('./registration').then(({ default: registration }) => {
    registration();
  })
}

if (window.location.pathname.indexOf('/call_room') == 0) {
  import('./call_room').then(({ default: call_room }) => {
    call_room();
  })
}