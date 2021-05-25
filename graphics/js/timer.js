
var speedcontrolBundle = 'nodecg-speedcontrol';
var timerElem = $('#timer');
var timer = nodecg.Replicant('timer', speedcontrolBundle);
timer.on('change', (newVal, oldVal) => {
	if (newVal)
		updateTimer(newVal, oldVal);
});

function updateTimer(newVal, oldVal) {
	if (oldVal) timerElem.toggleClass('timer_' + oldVal.state, false);
	timerElem.toggleClass('timer_' + newVal.state, true);
	timerElem.html(newVal.time);
}
