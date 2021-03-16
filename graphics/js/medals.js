'use strict';

const speedcontrolBundle = 'nodecg-speedcontrol';

const MEDAL_IMGS = [
	'img/common/medal_gold.png',
	'img/common/medal_silver.png',
	'img/common/medal_bronze.png',
	'img/common/medal_none.png'
];

let i = 0;
let runData;
let completedID = [];
$(() => {
	loadFromSpeedControl();

	function loadFromSpeedControl() {
		let runDataActiveRun = nodecg.Replicant('runDataActiveRun', speedcontrolBundle);
		runDataActiveRun.on('change', (newVal, oldVal) => {
			if (newVal) {
				runData = newVal;
				resetMedals();
			}
		});
	}

	function resetMedals() {
		for (let k = 1; k < 5; k++) {
			$('#medals' + (k) + '-img').attr('src', MEDAL_IMGS[3]);
		}
		completedID = [];
		trackTimer();
	}

	function trackTimer() {
		i = 0;
		let timer = nodecg.Replicant('timer', speedcontrolBundle);
		timer.on('change', (newVal, oldVal) => {
			for (let team of runData.teams) {
				try {
					if (runData.teams.length > 1 && newVal.teamFinishTimes[team.id].state === 'completed' && !completedID.includes(team.id)) {
						completedID.push(team.id);
						setMedal(team.id)
					}
					if (newVal.milliseconds < oldVal.milliseconds && newVal.milliseconds === 0)
						resetMedals();
				}
				catch {
					if (completedID.includes(team.id))
						removeMedal(team.id);
				}
			}
		});
	}

	function setMedal(id) {
		let n = 0;
		for (let i = 0; i < completedID.length; i++) {
			for (let k = 0; k < runData.teams.length; k++) {
				if (runData.teams[k].id === completedID[i]) {
					console.log(n);
					$('#medals' + (k + 1) + '-img').attr('src', MEDAL_IMGS[n]);
					n++;
				}
			}
		}
	}

	function removeMedal(id) {
		console.log(completedID);
		let n = completedID.indexOf(id);
		completedID.splice(n, 1);
		console.log(completedID);
		for (let k = 1; k < 5; k++) {
			$('#medals' + (k) + '-img').attr('src', MEDAL_IMGS[3]);
		}
		setMedal(completedID[0]);
	}
});