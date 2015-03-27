var currentPadding = 20;
var currentFont = "Calibri";
var currentFontSize = 18;
var currentFG = "#000000";
var currentBG = "#ffffff";
var textbox = document.getElementById("textbox");

document.getElementById("trash").addEventListener("click", clearText);
document.getElementById("share").addEventListener("click", wrapText);
document.getElementById("settings").addEventListener("click", showMenu);
document.getElementById("container").addEventListener("click", focusTextbox);
document.getElementById("settings-bg").addEventListener("click", hideMenu);
document.getElementById("hide-settings").addEventListener("click", hideMenu);
document.getElementById("font-control").addEventListener("change", changeFont);
document.getElementById("font-size-control").addEventListener("input", changeFontSize);
document.getElementById("padding-control").addEventListener("input", changePadding);
textbox.addEventListener("input", checkIfEmpty);
checkIfEmpty();

function checkIfEmpty() {
	if (textbox.value.length > 0) {	
		document.getElementById("share-image").setAttribute("class", "icon");
	} else {
		document.getElementById("share-image").setAttribute("class", "icon disabled");
		if(localStorage.getItem("shownMessage") == null) {
			localStorage.setItem("shownMessage", true);
		} else {
			setPlaceholder();
		}
	}
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
}

function changeFontSize() {
	currentFontSize = parseInt(document.getElementById("font-size-control").value);
	document.getElementById("font-size-val").innerHTML = currentFontSize;
	textbox.style.fontSize = currentFontSize+"pt";
	textbox.style.lineHeight = (currentFontSize * 1.3)+"pt";
}

function changePadding() {
	currentPadding = parseInt(document.getElementById("padding-control").value);
	document.getElementById("padding-val").innerHTML = currentPadding;
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
	focusTextbox();
}

function focusTextbox() {
	textbox.focus();
}

function wrapText() {
	if(textbox.value.length == 0) {
		textbox.placeholder = "Uh-oh...your Infinitweet is empty! Please enter some text first."
		return;
	}
	
	var link = document.getElementById("share");
	var text = textbox.value;

	var canvas = document.createElement("canvas");
	var context = canvas.getContext('2d');
	canvas.width = 180;
	canvas.height = 10000;

	var lineHeight = 1.3*currentFontSize;
	var attempts = 0; //counter to interrupt infinite loops
	
//	do {
//		attempts++;
//		var x = 0;
//		var y = lineHeight;
//
//		//adjust canvas size
//		if(y*1.8 > canvas.width) 
//			canvas.width -= 20;
//		else 
//			canvas.width += 20;
//
//		//reset properties after canvas size change
//		context.font = currentFontSize+"pt "+currentFont;
//		context.fillStyle = currentFG;
//		context.textBaseline = 'bottom';
//
//		//try to fit the text
//		var lines = text.split('\n');
//		for (var i = 0; i < lines.length; i++) {
//			var words = lines[i].split(' ');
//			var line = '';
//
//			for (var n = 0; n < words.length; n++) {
//				var testLine = line + words[n] + ' ';
//				var metrics = context.measureText(testLine);
//				var testWidth = metrics.width;
//
//				if (testWidth > canvas.width && n > 0) {
//					line = words[n] + ' ';
//					y += lineHeight;
//				} else {
//					line = testLine;
//				}
//			}
//
//			if (i < lines.length-1)
//				y += lineHeight;
//		}
//		console.log(y/canvas.width);
//	} while((y*2.1 < canvas.width || y*1.9 > canvas.width) && attempts < 1000);
	
	var previousRatio = 10000000;
	var delta = 10;
	var increased = false;
	
	do {
		attempts++;
		var x = 0;
		var y = lineHeight;
		
		if(previousRatio >= 2) {
			canvas.width -= delta;
			increased = false;
		} else {
			canvas.width += delta;
			increased = true;
		}
		
		//reset properties after canvas size change
		context.font = currentFontSize+"pt "+currentFont;
		context.fillStyle = currentFG;
		context.textBaseline = 'bottom';

		//try to fit the text
		var lines = text.split('\n');
		for (var i = 0; i < lines.length; i++) {
			var words = lines[i].split(' ');
			var line = '';

			for (var n = 0; n < words.length; n++) {
				var testLine = line + words[n] + ' ';
				var metrics = context.measureText(testLine);
				var testWidth = metrics.width;

				if (testWidth > canvas.width && n > 0) {
					line = words[n] + ' ';
					y += lineHeight;
				} else {
					line = testLine;
				}
			}

			if (i < lines.length-1)
				y += lineHeight;
		}
		
		var currentRatio = canvas.width/y;
		console.log(currentRatio+": "+canvas.width+"/"+y);
		if (Math.abs(2-previousRatio) < Math.abs(2-currentRatio)) {
			canvas.width = increased ? canvas.width - delta : canvas.width + delta;
			
			//reset properties after canvas size change
			context.font = currentFontSize+"pt "+currentFont;
			context.fillStyle = currentFG;
			context.textBaseline = 'bottom';
			break;
		} else {
			previousRatio = currentRatio;
		}
	} while (attempts < 1000);

//	//if we hit the attempt limit, deal with it
//	if(attempts == 1000) {
//		canvas.width = 320;
//
//		//reset properties after canvas size change
//		context.font = currentFontSize+"pt "+currentFont;
//		context.fillStyle = currentFG;
//		context.textBaseline = 'bottom';
//	}

	x = 0;
	y = lineHeight;

	for (var i = 0; i < lines.length; i++) {
		var words = lines[i].split(' ');
		var line = '';

		for (var n = 0; n < words.length; n++) {
			var testLine = line + words[n] + ' ';
			var metrics = context.measureText(testLine);
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
		if (i < lines.length-1)
			y += lineHeight;
	}

	// create a temporary canvas obj to transfer the pixel data
	var temp = document.createElement('canvas');
	var temp_context = temp.getContext('2d');
	temp.width = canvas.width + 2*currentPadding;
	temp.height = y + currentPadding + (currentPadding - (lineHeight-currentFontSize));
	temp_context.rect(0, 0, temp.width, temp.height);
	temp_context.fillStyle = currentBG;
	temp_context.fill();
	temp_context.font = context.font;
	temp_context.fillStyle = currentFG;
	temp_context.textBaseline = 'bottom';
	temp_context.drawImage(canvas, currentPadding, currentPadding - (lineHeight-currentFontSize));

	link.href = temp.toDataURL();
	link.download = "InfinitweetExport.png";
}

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
			document.getElementById("textbox").style.color = currentFG;
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
			document.body.style.background = currentBG;
		}
	},
	theme: 'bootstrap'
});


//Google Analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-59172782-1', 'auto');
ga('send', 'pageview');
