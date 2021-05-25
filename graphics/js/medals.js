const medalImgs = [
	'img/common/medal_gold.png',
	'img/common/medal_silver.png',
	'img/common/medal_bronze.png',
	'img/common/medal_none.png'
];

let i = 0;
let completedID = [];

NodeCG.waitForReplicants(runDataActiveRun, timer).then(() => {
	runDataActiveRun.on('change', (newVal, oldVal) => {
			resetMedals();
	});
})

function resetMedals() {
	for (let k = 1; k < 5; k++) {
		$('#medals' + (k) + '-img').attr('src', medalImgs[3]);
	}
	completedID = [];
	trackTimer();
}

function trackTimer() {
	i = 0;
	timer.on('change', (newVal, oldVal) => {
		for (let team of runDataActiveRun.value.teams) {
			try {
				if (runDataActiveRun.value.teams.length > 1 && newVal.teamFinishTimes[team.id].state === 'completed' && !completedID.includes(team.id)) {
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
		for (let k = 0; k < runDataActiveRun.value.teams.length; k++) {
			if (runDataActiveRun.value.teams[k].id === completedID[i]) {
				$('#medals' + (k + 1) + '-img').attr('src', medalImgs[n]);
				n++;
			}
		}
	}
}

function removeMedal(id) {
	let n = completedID.indexOf(id);
	completedID.splice(n, 1);
	for (let k = 1; k < 5; k++) {
		$('#medals' + (k) + '-img').attr('src', medalImgs[3]);
	}
	setMedal(completedID[0]);
}