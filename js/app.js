var currentPadding = 30;
var currentFont = "Helvetica";
var currentFontSize = 18;
var currentFG = "#000000";
var currentBG = "#ffffff";

document.getElementById("trash").addEventListener("click", clearText);
document.getElementById("share").addEventListener("click", wrapText);
document.getElementById("settings").addEventListener("click", showMenu);
document.getElementById("container").addEventListener("click", focusTextbox);
document.getElementById("settings-bg").addEventListener("click", hideMenu);
document.getElementById("hide-settings").addEventListener("click", hideMenu);
document.getElementById("font-control").addEventListener("change", changeFont);
document.getElementById("font-size-control").addEventListener("input", changeFontSize);

var textbox = document.getElementById("textbox");
textbox.value = localStorage.getItem("backup"); //resets to last known state
textbox.addEventListener("input", textDidChange);
textDidChange();


function textDidChange() {
	//check if textbox is empty
	if (textbox.value.length > 0) {
		document.getElementById("share-image").setAttribute("class", "icon ion-ios-upload-outline");
	} else {
		document.getElementById("share-image").setAttribute("class", "icon ion-ios-upload-outline disabled");
		if (localStorage.getItem("shownMessage") == null) {
			localStorage.setItem("shownMessage", true);
		} else {
			setPlaceholder();
		}
	}

	//backup contents
	localStorage.setItem("backup", textbox.value);
}

function setPlaceholder() {
	if (Math.random() > 0.5) {
		textbox.placeholder = "Pro Tip: Hit the trash icon to empty this textbox when you're done.";
	} else {
		textbox.placeholder = "Pro Tip: Infinitweet Pro for iOS is now on the iOS App Store!";
	}
}

function showMenu() {
	var el = document.getElementById("settings-bg");
	el.style.display = "block";

	var el = document.getElementById("settings-fg");
	el.style.display = "block";
}

function hideMenu() {
	var el = document.getElementById("settings-fg");
	el.style.display = "none";

	var el = document.getElementById("settings-bg");
	el.style.display = "none";
}

function clearText() {
	textbox.value = "";
	localStorage.setItem("backup", textbox.value);
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
  
    const dataURL = createInfinitweet(options);
    exportInfinitweet(dataURL);
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