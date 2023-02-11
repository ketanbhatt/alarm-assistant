document.body.onload = async () => {
	const initialized = await easySpeechInit();
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

function setAlarm(countdown, timeStr) {
	var bot = document.getElementById("bot").value;

	setTimeout(function () {
		console.log("Invoking assistant: " + bot)
		EasySpeech.speak({
			text: bot,
			rate: 0.8,
		})
	}, countdown + 1000);

	setTimeout(function () {
		console.log("Setting alarm for " + timeStr)
		EasySpeech.speak({
			text: "Set alarm for " + timeStr,
			rate: 0.8,
		})
	}, countdown + 3000);

	return countdown + 3000
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

function setAllAlarms(event) {
	event.preventDefault();
	document.getElementById("submitBtn").disabled = true;

	let times = getTimeStrs();
	let countdown = 0
	times.forEach((timeStr) => {
		countdown = setAlarm(countdown, timeStr);
		countdown += 9000
	})

	setTimeout(function () {
		document.getElementById("submitBtn").disabled = false;		
	}, countdown);
}