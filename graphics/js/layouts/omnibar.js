'use strict';

const speedcontrolBundle = 'nodecg-speedcontrol';

// Set static text. To add more text, add an entry to the array. It will display text from top to bottom.
const OMNIBAR_STATIC = [
	`<p class="is-single-line is-text-centered">
		Horror(ible) Games 2021 - Heartbreak benefits the
		<span style="color: #F2779D;">Heartland Animal Shelter</span>
	</p>`,
	`<p class="is-single-line is-text-centered">Donate at <span style="color: #F2779D;">https://tiltify.com/@gamesible/hig21-winter-wasteland</span></p>`
];

$(() => {
	// To see valid values, check out the Tiltify v3 API at https://tiltify.github.io/api/entities/campaign.html
	// For more information, check out the wiki at https://github.com/nicnacnic/speedcontrol-layouts/wiki

	// Set host text.
	function displayActiveHost(host) {
		setOmnibarHtml(`<p class='is-single-line is-text-centered'>Your current host is <span style="color: #F2779D;">${host.customData.host}</span></p>`);
	}

	// Set run text.
	function displayActiveRuns(run) {
		const players = getNamesForRun(run).join(', ');

		if (runIndex === 0)
			setOmnibarHtml(`<p class='is-multiline is-text-centered'>UP NEXT: ${run.game}</p>
			<p class='is-multiline is-text-centered'>${run.category} by ${players}</p>`);
		else
			setOmnibarHtml(`<p class="is-multiline is-text-centered">ON DECK: ${run.game}</p>
		<p class="is-multiline is-text-centered">${run.category} by ${players}</p>`);
	}

	// Set target text.
	function displayActiveTargets(target) {

		if (targetIndex === 0)
			setOmnibarHtml(`<p class="is-multiline is-text-centered">NEXT INCENTIVE: ${target.name}</p>
						<p class="is-multiline is-text-centered">$${target.totalAmountRaised} / $${target.amount}</p>`);
		else
			setOmnibarHtml(`<p class="is-multiline is-text-centered">LATER INCENTIVE: ${target.name}</p>
						<p class="is-multiline is-text-centered">$${target.totalAmountRaised} / $${target.amount}</p>`);
	}

	// Set polls text.
	function displayActivePolls(poll) {

		// First value of array is used for the next poll, second value are for the subsequent polls.
		// Will display the top 3 options, even if there are more. This is so the omnibar is not clogged up with poll data :D
		if (poll.options.length >= 3) {

			const THREE_OPTIONS = [`<p class="is-multiline is-text-centered">NEXT POLL: ${poll.name}</p>
								<p class="is-multiline is-text-centered">${poll.options[0].name}: $${poll.options[0].totalAmountRaised} vs. ${poll.options[1].name}: $${poll.options[1].totalAmountRaised}  vs. ${poll.options[2].name}: $${poll.options[2].totalAmountRaised}</p>`,
			`<p class="is-multiline is-text-centered">LATER POLL: ${poll.name}</p>
								<p class="is-multiline is-text-centered">${poll.options[0].name}: $${poll.options[0].totalAmountRaised} vs. ${poll.options[1].name}: $${poll.options[1].totalAmountRaised}  vs. ${poll.options[2].name}: $${poll.options[2].totalAmountRaised}</p>`];

			if (pollIndex === 0)
				setOmnibarHtml(THREE_OPTIONS[0]);
			else
				setOmnibarHtml(THREE_OPTIONS[1]);

		} else {

			const TWO_OPTIONS = [`<p class="is-multiline is-text-centered">NEXT POLL: ${poll.name}</p>
								<p class="is-multiline is-text-centered">${poll.options[0].name}: $${poll.options[0].totalAmountRaised} vs. ${poll.options[1].name}: $${poll.options[1].totalAmountRaised}</p>`,
			`<p class="is-multiline is-text-centered">LATER POLL: ${poll.name}</p>
								<p class="is-multiline is-text-centered">${poll.options[0].name}: $${poll.options[0].totalAmountRaised} vs. ${poll.options[1].name}: $${poll.options[1].totalAmountRaised}</p>`];

			if (pollIndex === 0)
				setOmnibarHtml(TWO_OPTIONS[0]);
			else
				setOmnibarHtml(TWO_OPTIONS[1]);
		}
	}

	// Set rewards text.
	function displayActiveRewards(reward) {

		if (rewardIndex === 0)
			setOmnibarHtml(`<p class="is-multiline is-text-centered">LATEST PRIZE: ${reward.name}</p>
		<p class="is-multiline is-text-centered">Min. Donation: $${reward.amount}</p>`);
		else
			setOmnibarHtml(`<p class="is-multiline is-text-centered">LATEST PRIZE: ${reward.name}</p>
		<p class="is-multiline is-text-centered">Min. Donation: $${reward.amount}</p>`);
	}

	// Set milestone text.
	function displayActiveMilestone(milestone) {

		setOmnibarHtml(`<p class="is-multiline is-text-centered">EVENT GOAL: $${milestone}</p>`);
	}

	// Do not edit below this line (unless you know what you're doing!)

	let USE_TILTIFY = nodecg.bundleConfig.USE_TILTIFY;

	let activeRun = [];
	let activeTarget = [];
	let activePoll = [];
	let activeReward = [];
	let activeMilestone;
	let activeHost;

	let runDataActiveRun = nodecg.Replicant('runDataActiveRun', speedcontrolBundle);
	let runDataArray = nodecg.Replicant('runDataArray', speedcontrolBundle);

	let staticIndex = 0;
	let runIndex = 0;
	let targetIndex = 0;
	let pollIndex = 0;
	let rewardIndex = 0;
	let numCycles = 0;

	let forceDisplayStatic = true;
	let forceDisplayHost = true;
	let forceDisplayRuns = true;
	let forceDisplayTargets = true;
	let forceDisplayPolls = true;
	let forceDisplayRewards = true;
	let forceDisplayMilestone = true;

	NodeCG.waitForReplicants(runDataActiveRun, runDataArray).then(runTickerText);

	function setOmnibarHtml(html) {
		$('#omnibar-content').fadeOut(nodecg.bundleConfig.omnibar.fadeOutTime, () => {
			$('#omnibar-content').html(html).fadeIn(nodecg.bundleConfig.omnibar.fadeInTime);
		});
	}

	function loadRuns(run) {
		let nextRuns = [];

		if (run && runDataArray) {
			let currentRunIndex = runDataArray.value.findIndex(runData => runData.id === run.id);

			if (nodecg.bundleConfig.omnibar.showHost)
				activeHost = runDataArray.value[currentRunIndex];

			for (let i = 1; i <= nodecg.bundleConfig.omnibar.numRuns; i++) {
				if (!runDataArray.value[currentRunIndex + i]) {
					break;
				}
				nextRuns.push(runDataArray.value[currentRunIndex + i]);
			}
		}
		return nextRuns;
	}

	function loadTargets() {
		activeTarget = [];
		targetIndex = 0;
		let j = 0;
		$.ajax({
			url: `https://tiltify.com/api/v3/campaigns/${nodecg.bundleConfig.TILTIFY_CAMPAIGN_ID}/challenges`,
			type: 'get',
			headers: {
				'Authorization': `Bearer ${nodecg.bundleConfig.TILTIFY_AUTH_TOKEN}`
			},
			dataType: 'json',
			success: (response) => {
				for (let i = 0; i < response.data.length; i++) {
					if (response.data[i].active && response.data[i].totalAmountRaised < response.data[i].amount) {
						activeTarget[j] = response.data[i];
						j++
					}
				}
				if (!nodecg.bundleConfig.omnibar.showTargets) {
					console.warn('Targets have been deactivated!');
					loadPolls();
				}
				else if (activeTarget.length === 0) {
					console.warn('No active targets to show!');
					loadPolls();
				}
				else {
					console.log('Targets loaded. (' + activeTarget.length + ' total)');
					activeTarget.sort((a, b) => a.endsAt - b.endsAt);
				}
			}
		});
	}

	function loadPolls() {
		activePoll = [];
		pollIndex = 0;
		let j = 0;
		$.ajax({
			url: `https://tiltify.com/api/v3/campaigns/${nodecg.bundleConfig.TILTIFY_CAMPAIGN_ID}/polls`,
			type: 'get',
			headers: {
				'Authorization': `Bearer ${nodecg.bundleConfig.TILTIFY_AUTH_TOKEN}`
			},
			dataType: 'json',
			success: (response) => {
				for (let i = 0; i < response.data.length; i++) {
					if (response.data[i].active) {
						activePoll[j] = response.data[i];
						j++;
					}
				}
				if (!nodecg.bundleConfig.omnibar.showPolls) {
					console.warn('Polls have been deactivated!');
					loadRewards();
				}
				else if (activePoll.length === 0) {
					console.warn('No active polls to show!');
					loadRewards();
				}
				else {
					activePoll[0].options[3].totalAmountRaised = 10;
					console.log('Polls loaded. (' + activePoll.length + ' total)');
					for (let i = 0; i <= activePoll.length - 1; i++) {
						let pollToSort = activePoll[i].options;
						pollToSort.sort((a, b) => b.totalAmountRaised - a.totalAmountRaised);
						activePoll[i].options = pollToSort;
					}
				}
			}
		});
	}

	function loadRewards() {
		activeReward = [];
		rewardIndex = 0;
		let j = 0;
		$.ajax({
			url: `https://tiltify.com/api/v3/campaigns/${nodecg.bundleConfig.TILTIFY_CAMPAIGN_ID}/rewards`,
			type: 'get',
			headers: {
				'Authorization': `Bearer ${nodecg.bundleConfig.TILTIFY_AUTH_TOKEN}`
			},
			dataType: 'json',
			success: (response) => {
				for (let i = 0; i < response.data.length; i++) {
					if (response.data[i].active) {
						activeReward[j] = response.data[i];
						j++;
					}
				}
				if (!nodecg.bundleConfig.omnibar.showRewards) {
					console.warn('Rewards have been deactivated!');
					loadMilestones();
				}
				else if (activeReward.length === 0) {
					console.warn('No active rewards to show!');
					loadMilestones();
				}
				else {
					console.log('Rewards loaded. (' + activeReward.length + ' total)');
					activeReward.sort((a, b) => a.endsAt - b.endsAt);
				}
			}
		});
	}

	function loadMilestones() {
		$.ajax({
			url: `https://tiltify.com/api/v3/campaigns/${nodecg.bundleConfig.TILTIFY_CAMPAIGN_ID}`,
			type: 'get',
			headers: {
				'Authorization': `Bearer ${nodecg.bundleConfig.TILTIFY_AUTH_TOKEN}`
			},
			dataType: 'json',
			success: (response) => {
				activeMilestone = response.data.fundraiserGoalAmount;
			}
		});
		console.log('Milestones loaded. (1 total)');

	}

	function checkTiltifyAPI() {
		if (USE_TILTIFY) {
			$.ajax({
				url: `https://tiltify.com/api/v3/campaigns/${nodecg.bundleConfig.TILTIFY_CAMPAIGN_ID}/rewards`,
				type: 'get',
				headers: {
					'Authorization': `Bearer ${nodecg.bundleConfig.TILTIFY_AUTH_TOKEN}`
				},
				dataType: 'json',
				error: (error) => {
					console.log(error);
					if (error.status !== null) {
						USE_TILTIFY = false;
						alert('Cannot connect to Tiltify API. Make sure TILTIFY_CAMPAIGN_ID and TILTIFY_AUTH_TOKEN are correct in omnibar.js. Tiltify features disabled.');
						console.log('Tiltify features disabled.')
					}
				}
			})
		}
		if (USE_TILTIFY) {
			console.log('Tiltify features enabled.');
		}
		else
			console.log('Tiltify features disabled.');
	}

	function resetOmnibar() {
		staticIndex = 0;
		runIndex = 0;
		forceDisplayStatic = true;
		forceDisplayHost = true;
		forceDisplayRuns = true;
		numCycles++;
		console.info('\nCycles: ' + numCycles);
	}

	function runTickerText() {
		console.log('\nCycles: 0');
		runDataActiveRun.on('change', (newVal, oldVal) => {
			activeRun = loadRuns(newVal);
		});

		runDataArray.on('change', (newVal, oldVal) => {
			activeRun = loadRuns(runDataActiveRun.value);
		});

		if (nodecg.bundleConfig.omnibar.dwellTime < 2000) {
			setOmnibarHtml(`<p class="is-single-line is-text-centered">Dwell time is too fast! Minimum 2000.</p>`);
			console.warn('Dwell time is too fast! Minimum 2000.');
			exit();
		}
		else
			setOmnibarHtml(`<p class="is-single-line is-text-centered">Omnibar is starting...</p>`);

		checkTiltifyAPI();
		console.log('Start up check complete!');

		setInterval(() => {
			if (activeRun.length === 0) {
				if (!forceDisplayStatic && !forceDisplayHost && nodecg.bundleConfig.omnibar.showHost)
					resetOmnibar();

				else if (!forceDisplayStatic && !nodecg.bundleConfig.omnibar.showHost)
					resetOmnibar();
			}
			if (forceDisplayStatic) {
				setOmnibarHtml(OMNIBAR_STATIC[staticIndex]);
				staticIndex++;

				if (staticIndex >= OMNIBAR_STATIC.length) {
					forceDisplayStatic = false;
					staticIndex = 0;
				}
			}
			else if (forceDisplayHost && nodecg.bundleConfig.omnibar.showHost && activeHost.customData.host !== undefined) {
				displayActiveHost(activeHost);
				forceDisplayHost = false;
			}
			else if (forceDisplayRuns && activeRun.length > 0) {
				displayActiveRuns(activeRun[runIndex]);
				forceDisplayHost = false;
				runIndex++;

				if (runIndex >= nodecg.bundleConfig.omnibar.numRuns || runIndex >= activeRun.length) {
					forceDisplayRuns = false;
					runIndex = 0;

					if (USE_TILTIFY)
						loadTargets();
					else
						resetOmnibar();
				}
			}
			else if (forceDisplayTargets && activeTarget.length > 0) {
				displayActiveTargets(activeTarget[targetIndex]);
				targetIndex++;

				if (targetIndex >= nodecg.bundleConfig.omnibar.numTargets || targetIndex >= activeTarget.length) {
					forceDisplayTargets = false;
					loadPolls();
				}
			}
			else if (forceDisplayPolls && activePoll.length > 0) {
				displayActivePolls(activePoll[pollIndex])
				pollIndex++;

				if (pollIndex >= nodecg.bundleConfig.omnibar.numPolls || pollIndex >= activePoll.length) {
					forceDisplayPolls = false;
					loadRewards();
				}
			}
			else if (forceDisplayRewards && activeReward.length > 0) {
				displayActiveRewards(activeReward[rewardIndex])
				rewardIndex++;

				if (rewardIndex >= nodecg.bundleConfig.omnibar.numRewards || rewardIndex >= activeReward.length) {
					forceDisplayRewards = false;
					loadMilestones();
				}
			}
			else {
				if (forceDisplayMilestone && nodecg.bundleConfig.omnibar.showGoal) {
					displayActiveMilestone(activeMilestone)
				}
				staticIndex = 0;
				runIndex = 0;

				forceDisplayStatic = true;
				forceDisplayHost = true;
				forceDisplayRuns = true;
				forceDisplayTargets = true;
				forceDisplayPolls = true;
				forceDisplayRewards = true;

				numCycles++;
				console.info('\nCycles: ' + numCycles);
			}
		}, nodecg.bundleConfig.omnibar.dwellTime);
	}
});