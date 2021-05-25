$(() => {
	const timer = nodecg.Replicant('timer', 'nodecg-speedcontrol');
	let timerElem = $('#timer');

	NodeCG.waitForReplicants(timer).then(() => {
		timer.on('change', (newVal, oldVal) => {
			console.log(timer);
			updateTimer(newVal, oldVal);
		});
	})

	function updateTimer(newVal, oldVal) {
		if (oldVal) timerElem.toggleClass('timer_' + oldVal.state, false);
		timerElem.toggleClass('timer_' + newVal.state, true);
		timerElem.html(newVal.time);
	}
});
