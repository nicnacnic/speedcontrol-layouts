'use strict';
const speedcontrolBundle = 'nodecg-speedcontrol';
$(() => {
	let runDataActiveRun = nodecg.Replicant('runDataActiveRun', speedcontrolBundle);
	let runDataArray = nodecg.Replicant('runDataArray', speedcontrolBundle);

	function getNextRuns(runData, amount) {
		let nextRuns = [];
		let indexOfCurrentRun = findIndexInRunDataArray(runData);
		for (let i = 1; i <= amount; i++) {
			if (!runDataArray.value[indexOfCurrentRun + i]) {
				break;
			}
			nextRuns.push(runDataArray.value[indexOfCurrentRun + i]);
		}
		return nextRuns;
	}

	function findIndexInRunDataArray(run) {
		let indexOfRun = -1;
		if (run) {
			for (let i = 0; i < runDataArray.value.length; i++) {
				if (run.id === runDataArray.value[i].id) {
					indexOfRun = i; break;
				}
			}
		}
		return indexOfRun;
	}
	
	NodeCG.waitForReplicants(runDataActiveRun, runDataArray).then(loadFromSpeedControl);

	function loadFromSpeedControl() {
		runDataActiveRun.on('change', (newVal, oldVal) => {
			refreshNextRunsData(newVal);
		});

		runDataArray.on('change', (newVal, oldVal) => {
			refreshNextRunsData(runDataActiveRun.value);
		});

	}

	function refreshNextRunsData(currentRun) {
		let nextRuns = getNextRuns(currentRun, 2);

		let upNextGame = '#up-next-game';
		let upNextInfo = '#up-next-info';
		let upNextEstimate = '#up-next-estimate';
		fadeHtml(upNextGame, currentRun.game, true);
		fadeHtml(upNextInfo, getNamesForRun(runDataActiveRun.value).join(', '), true);
		fadeHtml(upNextEstimate, currentRun.estimate, true);
		if (nodecg.bundleConfig.customData.useCustomHost && currentRun.customData.host !== undefined)
			fadeHtml('#host', "Host: " + currentRun.customData.host);
		else
			fadeHtml('#host', '');

		let i = 0;
		for (let run of nextRuns) {
			if (i >= 2) {
				break;
			}
			let onDeckGame = '#on-deck-game' + (i + 1);
			let onDeckRunner = '#on-deck-info' + (i + 1);
			let onDeckEstimate = '#on-deck-estimate' + (i + 1);
			fadeHtml(onDeckGame, run.game, true);
			fadeHtml(onDeckRunner, getNamesForRun(run).join(', '), true);
			fadeHtml(onDeckEstimate, run.estimate, true);
			i += 1;
		}
	}
});
