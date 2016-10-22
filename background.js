chrome.contextMenus.create({
  id: 'Infinitweet',
  title: 'Create Infinitweet',
  contexts:['selection']
});

chrome.contextMenus.onClicked.addListener((data) => {
  const selectionText = data.selectionText;
  
  const w = 500;
  const h = 580;
  const top = (screen.height/2)-(h/2);
  const left = (screen.width/2)-(w/2);

  chrome.windows.create({
    url: '/popup.html?text=' + encodeURIComponent(selectionText),
    type: 'popup',
    width: 500,
    height: 580,
    top: top,
    left: left
  });
});

chrome.runtime.onInstalled.addListener((details) => {
  // Just installed.
  if(details.reason === 'installed') {
    isAuthenticated().then((isAuth) => {
      chrome.tabs.create({
        url: isAuth ? '/loggedIn.html' : '/loggedOut.html'
      });
    });
  }
  else if(details.reason === 'update' && previousVersion === '1.2') {
    
  }
});

function isAuthenticated() {
  return fetch('https://fantastic-hippo.appspot.com/authenticated', {
    credentials: 'include',
    headers: {  
      'Content-Type': 'application/json'
    } 
  }).then((response) => {
    return response.text();
  }).then((text) => {
    return text === 'true'
  });
}