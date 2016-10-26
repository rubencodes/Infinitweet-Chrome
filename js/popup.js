$('textarea#tweetBox').on('input change keyup', handleTyping);
$('button#clickToTweet').on('click', tweet);

// Set preview source.
const queryStrings = decodeURIComponent(window.location.search.slice(1)).split('&');
const selectedText = queryStrings.find((string) => string.startsWith('text=')).slice('text='.length);
const originalUrl  = queryStrings.find((string) => string.startsWith('url=')).slice('url='.length);
previewInfinitweet(selectedText, originalUrl);

function previewInfinitweet(text, url) {
  const infinitweet = createInfinitweet({
    url,
    text,
    fontSize: '12',
    fontFamily: 'Helvetica',
    foregroundColor: '#000000',
    backgroundColor: '#ffffff',
    paddingSize: '20'
  });

  $('img#preview').attr('src', infinitweet.base64);
}

function tweet() {
  // Gather data.
  const status = $('textarea#tweetBox').val();
  const media_data = $('img#preview').attr('src');

  postInfinitweet({ status, media_data }).then((results) => {
    window.location = '/success.html';
  }).catch((error) => {
    alert(error);
  });
}

function handleTyping() {
  $(".counter").html(140 - $('textarea').val().length);
}

