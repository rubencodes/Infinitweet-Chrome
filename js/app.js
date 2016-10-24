const currentPadding = 30;
const currentFont = "Helvetica";
const currentFontSize = 12;
const currentFG = "#000000";
const currentBG = "#ffffff";

document.getElementById("trash").addEventListener("click", clearText);
document.getElementById("share").addEventListener("click", wrapText);
document.getElementById("container").addEventListener("click", focusTextbox);

const textbox = document.getElementById("textbox");
textbox.value = localStorage.getItem("backup"); //resets to last known state
textbox.addEventListener("input", textDidChange);
textDidChange();


function textDidChange() {
  //check if textbox is empty
  if (textbox.value.length > 0) {
    document.getElementById("share").removeAttribute("disabled");
    document.getElementById("trash").removeAttribute("disabled");
  } else {
    document.getElementById("share").setAttribute("disabled", true);
    document.getElementById("trash").setAttribute("disabled", true);
  }

  //backup contents
  localStorage.setItem("backup", textbox.value);
}

function setPlaceholder(override, value) {
  if(override) {
    textbox.placeholder = value;
    return;
  }
  
  if (Math.random() > 0.5) {
    textbox.placeholder = "Pro Tip: Hit the trash icon to empty this textbox when you're done.";
  } else {
    textbox.placeholder = "Pro Tip: Infinitweet Pro for iOS is now on the iOS App Store!";
  }
}

function clearText() {
  textbox.value = "";
  localStorage.setItem("backup", textbox.value);
  textDidChange();
  focusTextbox();
}

function focusTextbox() {
  textbox.focus();
}

function wrapText() {
  if (textbox.value.length == 0) {
    textbox.placeholder = "Uh-oh...your Infinitweet is empty! Please enter some text first."
    return;
  }

  const options = {
    text: textbox.value.trim(),
    fontSize: currentFontSize,
    fontFamily: currentFont,
    foregroundColor: currentFG,
    backgroundColor: currentBG,
    paddingSize: currentPadding
  };

  const infinitweet = createInfinitweet(options);
  postInfinitweet({ media_data: infinitweet.base64 }).then(() => {
    clearText();
    setPlaceholder(true, 'Thank you for sharing!');
  });
}

//Google Analytics
(function (i, s, o, g, r, a, m) {
	i['GoogleAnalyticsObject'] = r;
	i[r] = i[r] || function () {
		(i[r].q = i[r].q || []).push(arguments)
	}, i[r].l = 1 * new Date();
	a = s.createElement(o),
		m = s.getElementsByTagName(o)[0];
	a.async = 1;
	a.src = g;
	m.parentNode.insertBefore(a, m)
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

ga('create', 'UA-59172782-1', 'auto');
ga('send', 'pageview');