function createInfinitweet(options) {
	const url   = options.url;
	const text  = options.text + '\n';
	const lines = text.split('\n');

	const canvas  = document.createElement('canvas');
	const context = canvas.getContext('2d', {alpha: false});
	canvas.width  = 180;
	canvas.height = 10000;

	//calculate ideal canvas height
	const lineHeight = 1.5 * options.fontSize;
	const ratio = 1.90;
	const delta = 10;
	const maxCycles  = 1000;

	let cycleCount = 0;
	let increased = false;
	let lastRatio  = 10000000;
	let lastHeight = 0;
	let currentHeight;
	while (cycleCount++ < maxCycles) {
		if (lastRatio >= ratio) {
			canvas.width -= delta;
			increased = false;
		} else {
			canvas.width += delta;
			increased = true;
		}

		//reset properties after canvas size change
		context.font = options.fontSize + 'pt ' + options.fontFamily;
		context.fillStyle = options.foregroundColor;
		context.textBaseline = 'bottom';

		currentHeight = getHeightForTextFromWidth(lines, canvas.width, lineHeight, context);
		const currentRatio  = (canvas.width + (2 * options.paddingSize)) / (currentHeight + (2*options.paddingSize - (lineHeight - options.fontSize)));

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
	const minSize   = { width: 390.5, height: 220 };
	canvas.height = Math.max(currentHeight, minSize.height - (2 * options.paddingSize - (lineHeight - options.fontSize)));
	canvas.width  = Math.max(canvas.width,  minSize.width  - (2 * options.paddingSize));

	//reset properties after canvas size change
	context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, canvas.width, canvas.height);
	context.font = options.fontSize + 'pt ' + options.fontFamily;
	context.fillStyle = options.foregroundColor;
	context.textBaseline = 'bottom';

    //write to canvas
	const x = 0;
	let y = lineHeight;
	for (let i = 0; i < lines.length; i++) {
		const words = lines[i].split(' ');
		let line  = '';

		for (let n = 0; n < words.length; n++) {
			const testLine  = line + words[n] + ' ';
			const metrics   = context.measureText(testLine);
			const testWidth = metrics.width;

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

	//create a temporary canvas obj to transfer the pixel data
	const temp = document.createElement('canvas');
	const temp_context = temp.getContext('2d', {alpha: false});

	//prepare wordmark
	temp_context.font = '10pt Helvetica';
	const wordmark = 'Infinitweet';
	const wordmarkSize = temp_context.measureText(wordmark).width;

	//set temp canvas to correct size
	temp.height = canvas.height + (2 * options.paddingSize - (lineHeight - options.fontSize));
	temp.width  = canvas.width  + (2 * options.paddingSize);

	//draw Infinitweet to canvas
	temp_context.rect(0, 0, temp.width, temp.height);
	temp_context.fillStyle = options.backgroundColor;
	temp_context.fill();
	temp_context.font = context.font;
	temp_context.fillStyle = options.foregroundColor;
	temp_context.textBaseline = 'bottom';
	temp_context.drawImage(canvas, options.paddingSize, options.paddingSize - (lineHeight - options.fontSize));

	//draw wordmark
	temp_context.font = '10pt Helvetica';
	temp_context.textAlign = 'right';
	temp_context.fillStyle = '#888888';
	temp_context.fillText(wordmark, temp.width - options.paddingSize, temp.height - options.paddingSize);
  
    //draw source url
	temp_context.textAlign = 'left';
	temp_context.fillText('Source: ' + extractDomain(url), options.paddingSize, temp.height - options.paddingSize);

    return {
      text: options.text,
      canvas: temp,
      base64: temp.toDataURL()
    };
}

function exportInfinitweet(dataURL) {
  const link = document.getElementById('share');
  link.href = dataURL;
  link.download = 'InfinitweetExport.png';
}

function getHeightForTextFromWidth(lines, width, lineHeight, context) {
	let y = lineHeight;

	//try to fit the text
	for (let i = 0; i < lines.length; i++) {
		const words = lines[i].split(' ');
		let line  = '';

		for (let n = 0; n < words.length; n++) {
			const testLine  = line + words[n] + ' ';
			const metrics   = context.measureText(testLine);
			const testWidth = metrics.width;

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
function extractDomain(url) {
    let domain;
    //find & remove protocol (http, ftp, etc.) and get domain
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    }
    else {
        domain = url.split('/')[0];
    }

    //find & remove port number
    domain = domain.split(':')[0];

    return domain;
}

function postInfinitweet(params) {
  const base64Prefix = 'data:image/jpeg;base64,';
  params.media_data = params.media_data.slice(base64Prefix.length - 1);
  
  return fetch('https://server.infinitweet.com/postInfinitweet', {
    method: 'POST',
    credentials: 'include',
    headers: {  
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  });
}