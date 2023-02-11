document.body.onload = async () => {
	const initialized = await easySpeechInit()
	await initSpeak();
}

async function easySpeechInit () {
	const errorDiv = document.querySelector('#errorDiv')

	let success
	try {
		success = await EasySpeech.init()
	} catch (e) {
		success = false
		errorDiv.hidden = false
	}

	return success
}

function initSpeak() {
	const speakButton = document.querySelector('#speakbtn')

	speakButton.addEventListener('click', async event => {
		speakButton.disabled = true

		let times = getTimeStrs();
		const bot = document.getElementById("bot").value;
		const samantha = EasySpeech.voices().filter(voice => {
			return voice.lang.split(/[-_]/)[0] == "en" && voice.name.includes("Samantha") 
		})[0] // Because samantha seems available on phone and desktop


		try {
			for (const timeStr of times) {
				await EasySpeech.speak({
					text: bot,
					rate: 0.8,
					voice: samantha
				})
				await sleep(1000);

				await EasySpeech.speak({
					text: "Set alarm for " + timeStr,
					rate: 0.8,
					voice: samantha
				})
				await sleep(9000);
			}
		} catch (e) {
			console.log(e.message)
		} finally {
			speakButton.disabled = false
		}
		
	})
}

function getTimeStrs() {
	var DateTime = luxon.DateTime;
	let startTimeStr = document.getElementById("startTime").value;
	let endTimeStr = document.getElementById("endTime").value;
	let interval = Number(document.getElementById("interval").value);

	let startTime = DateTime.fromFormat(startTimeStr, "h mm a")
	let endTime = DateTime.fromFormat(endTimeStr, "h mm a")

	if (startTime.invalid != null) {
		alert("Woops! There is some problem with the start time: " + startTime.invalid.toMessage())
	}

	if (endTime.invalid != null) {
		alert("Woops! There is some problem with the end time: " + endTime.invalid.toMessage())
	}

	var timeStrs = [];
	var alarmTime = startTime;
	while (alarmTime <= endTime) {
		timeStrs.push(alarmTime.toFormat("h mm a"));
		alarmTime = alarmTime.plus({minutes: interval})
	}

	if (timeStrs.length < 1) { 
		alert("Woops, check your times. We couldn't find any times to set the alarms") 
	}

	if (timeStrs.length > 10) {
		alert("More than 10 alarms are not good for your mental health. Are you okay bruh!?")
	}

	return timeStrs
}

const sleep = ms => new Promise(r => setTimeout(r, ms));