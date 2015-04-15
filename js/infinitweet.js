var currentPadding = 30;
var currentFont = "Helvetica";
var currentFontSize = 18;
var currentFG = "#000000";
var currentBG = "#ffffff";

var textbox = document.getElementById("textbox");
textbox.value = localStorage.getItem("backup"); //resets to last known state

currentFont = localStorage.getItem("font") || "Helvetica";
document.getElementById("font-control").value = currentFont;
changeFont();

currentFontSize = localStorage.getItem("font-size") || 18;
document.getElementById("font-size-control").value = currentFontSize;
changeFontSize();

currentFG = localStorage.getItem("fg-color") || "#000000";
document.getElementById("fg-color").value = currentFG;
changeForeground(currentFG);

currentBG = localStorage.getItem("bg-color") || "#ffffff";
document.getElementById("bg-color").value = currentBG;
changeBackground(currentBG);

document.getElementById("trash").addEventListener("click", clearText);
document.getElementById("share").addEventListener("click", wrapText);
document.getElementById("settings").addEventListener("click", showMenu);
document.getElementById("container").addEventListener("click", focusTextbox);
document.getElementById("settings-bg").addEventListener("click", hideMenu);
document.getElementById("hide-settings").addEventListener("click", hideMenu);
document.getElementById("font-control").addEventListener("change", changeFont);
document.getElementById("font-size-control").addEventListener("input", changeFontSize);

$("#fg-color").minicolors({
	control: 'hue',
	defaultValue: currentFG,
	inline: $(this).attr('data-inline') === 'true',
	letterCase: 'lowercase',
	position: 'bottom right',
	change: function (hex, opacity) {
		if (!hex) return;
		if (opacity) hex += ', ' + opacity;
		if (typeof console === 'object') {
			currentFG = hex;
			changeForeground(currentFG);
		}
	},
	theme: 'bootstrap'
});

$("#bg-color").minicolors({
	control: 'hue',
	defaultValue: currentBG,
	inline: $(this).attr('data-inline') === 'true',
	letterCase: 'lowercase',
	position: 'bottom right',
	change: function (hex, opacity) {
		if (!hex) return;
		if (opacity) hex += ', ' + opacity;
		if (typeof console === 'object') {
			currentBG = hex;
			changeBackground(currentBG);
		}
	},
	theme: 'bootstrap'
});

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
	if (Math.random() > 0.3) {
		textbox.placeholder = "Pro Tip: Hit the settings button below to modify font, color scheme, or padding!";
	} else if (Math.random() > 0.5) {
		textbox.placeholder = "Pro Tip: Hit the trash icon to empty this textbox when you're done.";
	} else {
		textbox.placeholder = "Pro Tip: Infinitweet Pro for iOS is now live in the App Store!";
	}
}

function changeFont() {
	var e = document.getElementById("font-control");
	currentFont = e.options[e.selectedIndex].value;
	textbox.style.fontFamily = currentFont;
	localStorage.setItem("font", currentFont);
}

function changeFontSize() {
	currentFontSize = parseInt(document.getElementById("font-size-control").value, 10);
	document.getElementById("font-size-val").innerHTML = currentFontSize;
	textbox.style.fontSize = currentFontSize + "pt";
	textbox.style.lineHeight = (currentFontSize * 1.3) + "pt";
	localStorage.setItem("font-size", currentFontSize);
}

function changeBackground(color) {
	document.body.style.background = color;
	localStorage.setItem("bg-color", color);
}

function changeForeground(color) {
	textbox.style.color = color;
	localStorage.setItem("fg-color", color);
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

	var text  = textbox.value.trim()+"\n";
	var lines = text.split('\n');

	var canvas  = document.createElement("canvas");
	var context = canvas.getContext('2d');
	canvas.width  = 180;
	canvas.height = 10000;

	var lineHeight = 1.5 * currentFontSize;
	var cycleCount = 0; //counter to interrupt infinite loops
	var maxCycles  = 1000;

	var ratio = 1.90;
	var lastRatio  = 10000000;
	var lastHeight = 0;
	var delta = 10;
	var increased = false;

	while (cycleCount++ < maxCycles) {
		if (lastRatio >= ratio) {
			canvas.width -= delta;
			increased = false;
		} else {
			canvas.width += delta;
			increased = true;
		}

		//reset properties after canvas size change
		context.font = currentFontSize + "pt " + currentFont;
		context.fillStyle = currentFG;
		context.textBaseline = 'bottom';

		var currentHeight = getHeightForTextFromWidth(lines, canvas.width, lineHeight, context);
		var currentRatio  = (canvas.width + (2 * currentPadding)) / (currentHeight + (2*currentPadding - (lineHeight - currentFontSize)));
		
		if (Math.abs(ratio - lastRatio) < Math.abs(ratio - currentRatio)) {
			canvas.width  = increased ? canvas.width - delta : canvas.width + delta;
			currentHeight = lastHeight;
			break;
		} 
		
		if (Math.abs(ratio - currentRatio) < 0.05) {
			break;	
		} else {
			lastRatio  = currentRatio;
			lastHeight = currentHeight;
		}
	}

	//gets height, then calculates proportional width
	var minSize   = { width: 390.5, height: 220 };
	canvas.height = Math.max(currentHeight, minSize.height - (2*currentPadding - (lineHeight - currentFontSize)));
	canvas.width  = Math.max(canvas.width,  minSize.width  - (2 * currentPadding));
	
	//reset properties after canvas size change
	context.font = currentFontSize + "pt " + currentFont;
	context.fillStyle = currentFG;
	context.textBaseline = 'bottom';
	
	var x = 0;
	var y = lineHeight;

	for (var i = 0; i < lines.length; i++) {
		var words = lines[i].split(' ');
		var line  = '';

		for (var n = 0; n < words.length; n++) {
			var testLine  = line + words[n] + ' ';
			var metrics   = context.measureText(testLine);
			var testWidth = metrics.width;

			if (testWidth > canvas.width && n > 0) {
				context.fillText(line, x, y);
				line = words[n] + ' ';
				y += lineHeight;
			} else {
				line = testLine;
			}
		}
		context.fillText(line, x, y);
		if (i < lines.length-1) y += lineHeight;
	}

	// create a temporary canvas obj to transfer the pixel data
	var temp = document.createElement('canvas');
	var temp_context = temp.getContext('2d');

	//prepare wordmark
	temp_context.font = "10pt Helvetica";
	var wordmark = "Infinitweet Chrome";
	var wordmarkSize = temp_context.measureText(wordmark).width;

	//set temp canvas to correct size
	temp.height = canvas.height + (2 * currentPadding - (lineHeight - currentFontSize));
	temp.width  = canvas.width  + (2 * currentPadding);

	//draw Infinitweet to canvas
	temp_context.rect(0, 0, temp.width, temp.height);
	temp_context.fillStyle = currentBG;
	temp_context.fill();
	temp_context.font = context.font;
	temp_context.fillStyle = currentFG;
	temp_context.textBaseline = 'bottom';
	temp_context.drawImage(canvas, currentPadding, currentPadding - (lineHeight - currentFontSize));

	//draw wordmark
	temp_context.font = "10pt Helvetica";
	temp_context.textAlign = 'right';
	temp_context.fillStyle = "#888888";
	temp_context.fillText(wordmark, temp.width - currentPadding, temp.height - currentPadding);

	var link = document.getElementById("share");
	link.href = temp.toDataURL();
	link.download = "InfinitweetExport.png";
}

function getHeightForTextFromWidth(lines, width, lineHeight, context) {
	var y = lineHeight;
	
	//try to fit the text
	for (var i = 0; i < lines.length; i++) {
		var words = lines[i].split(' ');
		var line  = '';

		for (var n = 0; n < words.length; n++) {
			var testLine  = line + words[n] + ' ';
			var metrics   = context.measureText(testLine);
			var testWidth = metrics.width;

			if (testWidth > width && n > 0) {
				line = words[n] + ' ';
				y += lineHeight;
			} else {
				line = testLine;
			}
		}

		if (i < lines.length-1) y += lineHeight;
	}
	return y;
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