$('textarea#tweetBox').on('input change keyup', handleTyping);
$('button#clickToTweet').on('click', postInfinitweet);

// Set preview source.
const selectedText = decodeURIComponent(window.location.search.slice('?text='.length));
previewInfinitweet(selectedText);

function previewInfinitweet(text) {
  const infinitweet = createInfinitweet({
    text,
    fontSize: '12',
    fontFamily: 'Helvetica',
    foregroundColor: '#000000',
    backgroundColor: '#ffffff',
    paddingSize: '20'
  });

  $('img#preview').attr('src', infinitweet.base64);
}

function postInfinitweet() {
  // Gather data.
  const status = $('textarea#tweetBox').val();
  const media_data = $('img#preview').attr('src').slice('data:image/jpeg;base64,'.length - 1);

  // Post the infinitweet.
  fetch('http://localhost:8080/postInfinitweet', {
    method: 'POST',
    credentials: 'include',
    headers: {  
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status, media_data })
  }).then((results) => {
    window.location = '/success.html';
  }).catch((error) => {
    alert(error);
  });
}

function handleTyping() {
  $(".counter").html(140 - $('textarea').val().length);
}

