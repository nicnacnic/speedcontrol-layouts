'use strict';

// Set static text.
const OMNIBAR_STATIC = [
	`<p class="is-single-line is-text-centered">
		Horror(ible) Games 2021 - Refresh benefits the
		<span style="color: #F2779D;">Heartland Animal Shelter</span>
	</p>`,
	`<p class="is-single-line is-text-centered">Donate at <span style="color: #F2779D;">https://tiltify.com/@gamesible/hig-2021-refresh</span></p>`
];

$(() => {
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

	function displayActiveTargets(target) {

		// Set target text for Tiltify.
		if (nodecg.bundleConfig.donation.useTiltify) {
			if (targetIndex === 0)
				setOmnibarHtml(`<p class="is-multiline is-text-centered">NEXT INCENTIVE: ${target.name}</p>
						<p class="is-multiline is-text-centered">$${target.totalAmountRaised} / $${target.amount}</p>`);
			else
				setOmnibarHtml(`<p class="is-multiline is-text-centered">LATER INCENTIVE: ${target.name}</p>
						<p class="is-multiline is-text-centered">$${target.totalAmountRaised} / $${target.amount}</p>`);
		}

		// Set target text for Oengus.
		else if (nodecg.bundleConfig.donation.useOengus) {
			if (targetIndex === 0)
				setOmnibarHtml(`<p class="is-multiline is-text-centered">NEXT INCENTIVE: ${target.name}</p>
						<p class="is-multiline is-text-centered">$${target.currentAmount} / $${target.goal}</p>`);
			else
				setOmnibarHtml(`<p class="is-multiline is-text-centered">LATER INCENTIVE: ${target.name}</p>
						<p class="is-multiline is-text-centered">$${target.currentAmount} / $${target.goal}</p>`);
		}
	}

	function displayActivePolls(poll) {

		// Set poll text for Tiltify. Note that the omnibar will only show the top 3 options to reduce clutter.
		if (nodecg.bundleConfig.donation.useTiltify) {

			// Set poll text with 3 options or more.
			if (poll.options.length >= 3) {
				const THREE_OPTIONS = [`<p class="is-multiline is-text-centered">NEXT POLL: ${poll.name}</p>
								<p class="is-multiline is-text-centered">${poll.options[0].name}: $${poll.options[0].totalAmountRaised} vs. ${poll.options[1].name}: $${poll.options[1].totalAmountRaised}  vs. ${poll.options[2].name}: $${poll.options[2].totalAmountRaised}</p>`,
				`<p class="is-multiline is-text-centered">LATER POLL: ${poll.name}</p>
								<p class="is-multiline is-text-centered">${poll.options[0].name}: $${poll.options[0].totalAmountRaised} vs. ${poll.options[1].name}: $${poll.options[1].totalAmountRaised}  vs. ${poll.options[2].name}: $${poll.options[2].totalAmountRaised}</p>`];

				if (pollIndex === 0)
					setOmnibarHtml(THREE_OPTIONS[0]);
				else
					setOmnibarHtml(THREE_OPTIONS[1]);

				// Set poll text with 2 options.
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

		// Set poll text for Oengus. Note that the omnibar will only show the top 3 options to reduce clutter.
		else if (nodecg.bundleConfig.donation.useOengus) {

			// Set poll text with 3 bids or more.
			if (poll.bids.length >= 3) {
				const THREE_bids = [`<p class="is-multiline is-text-centered">NEXT POLL: ${poll.name}</p>
								<p class="is-multiline is-text-centered">${poll.bids[0].name}: $${poll.bids[0].currentAmount} vs. ${poll.bids[1].name}: $${poll.bids[1].currentAmount}  vs. ${poll.bids[2].name}: $${poll.bids[2].currentAmount}</p>`,
				`<p class="is-multiline is-text-centered">LATER POLL: ${poll.name}</p>
								<p class="is-multiline is-text-centered">${poll.bids[0].name}: $${poll.bids[0].currentAmount} vs. ${poll.bids[1].name}: $${poll.bids[1].currentAmount}  vs. ${poll.bids[2].name}: $${poll.bids[2].currentAmount}</p>`];

				if (pollIndex === 0)
					setOmnibarHtml(THREE_bids[0]);
				else
					setOmnibarHtml(THREE_bids[1]);

				// Set poll text with 2 bids.
			} else {
				const TWO_bids = [`<p class="is-multiline is-text-centered">NEXT POLL: ${poll.name}</p>
								<p class="is-multiline is-text-centered">${poll.bids[0].name}: $${poll.bids[0].currentAmount} vs. ${poll.bids[1].name}: $${poll.bids[1].currentAmount}</p>`,
				`<p class="is-multiline is-text-centered">LATER POLL: ${poll.name}</p>
								<p class="is-multiline is-text-centered">${poll.bids[0].name}: $${poll.bids[0].currentAmount} vs. ${poll.bids[1].name}: $${poll.bids[1].currentAmount}</p>`];

				if (pollIndex === 0)
					setOmnibarHtml(TWO_bids[0]);
				else
					setOmnibarHtml(TWO_bids[1]);
			}
		}
	}

	function displayActiveRewards(reward) {

		// Set rewards text for Tiltify.
		if (nodecg.bundleConfig.donation.useTiltify) {
			if (rewardIndex === 0)
				setOmnibarHtml(`<p class="is-multiline is-text-centered">LATEST PRIZE: ${reward.name}</p>
		<p class="is-multiline is-text-centered">Min. Donation: $${reward.amount}</p>`);
			else
				setOmnibarHtml(`<p class="is-multiline is-text-centered">LATEST PRIZE: ${reward.name}</p>
		<p class="is-multiline is-text-centered">Min. Donation: $${reward.amount}</p>`);
		}

		// Set rewards text for Oengus.
		else if (nodecg.bundleConfig.donation.useOengus) {
			if (rewardIndex === 0)
				setOmnibarHtml(`<p class="is-multiline is-text-centered">LATEST PRIZE: ${reward.name}</p>
		<p class="is-multiline is-text-centered">Min. Donation: $${reward.amount}</p>`);
			else
				setOmnibarHtml(`<p class="is-multiline is-text-centered">LATEST PRIZE: ${reward.name}</p>
		<p class="is-multiline is-text-centered">Min. Donation: $${reward.amount}</p>`);
		}
	}


	// Set milestone text.
	function displayActiveMilestone(milestone) {

		setOmnibarHtml(`<p class="is-multiline is-text-centered">EVENT GOAL: $${milestone}</p>`);
	}

	// Do not edit below this line (unless you know what you're doing!)
	let URL;
	if (nodecg.bundleConfig.donation.useOengus) {
		if (nodecg.bundleConfig.donation.oengusUseSandbox)
			URL = `https://sandbox.oengus.io/api/marathon/${nodecg.bundleConfig.donation.oengusMarathon}/incentive?withLocked=true&withUnapproved=false`;
		else
			URL = `https://oengus.io/api/marathon/${nodecg.bundleConfig.donation.oengusMarathon}/incentive?withLocked=true&withUnapproved=false`
	}

	let activeRun, activeTarget, activePoll, activeReward, activeMilestone, activeHost;
	activeRun = activeTarget = activePoll = activeReward = activeMilestone = activeHost = [];

	let staticIndex, runIndex, targetIndex, pollIndex, rewardIndex, omnibarText;
	rewardIndex = pollIndex = targetIndex = runIndex = 100;
	staticIndex = omnibarText = 0;

	let showHost = true;
	let showGoal = false;

	let runDataActiveRun = nodecg.Replicant('runDataActiveRun', speedcontrolBundle);
	let runDataArray = nodecg.Replicant('runDataArray', speedcontrolBundle);

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

	function loadDataFromApi() {
		let j = 0;
		activeTarget = [];
		activePoll = [];
		activeReward = [];
		if (nodecg.bundleConfig.omnibar.showTargets && omnibarText < 3 && nodecg.bundleConfig.donation.useTiltify) {
			$.ajax({
				url: `https://tiltify.com/api/v3/campaigns/${nodecg.bundleConfig.donation.tiltifyCampaignID}/challenges`,
				type: 'get',
				headers: {
					'Authorization': `Bearer ${nodecg.bundleConfig.donation.tiltifyAuthToken}`
				},
				dataType: 'json',
				success: (response) => {
					for (let i = 0; i < response.data.length; i++) {
						if (response.data[i].active && response.data[i].totalAmountRaised < response.data[i].amount) {
							activeTarget[j] = response.data[i];
							j++;
						}
					}
					if (activeTarget.length > 0)
						activeTarget.sort((a, b) => a.endsAt - b.endsAt);
					else {
						omnibarText++;
						loadDataFromApi();
					}
				}
			});
		}
		else if (nodecg.bundleConfig.omnibar.showTargets && omnibarText < 3 && nodecg.bundleConfig.donation.useOengus) {
			$.ajax({
				url: URL,
				type: 'get',
				dataType: 'json',
				success: (response) => {
					for (let i = 0; i < response.length; i++) {
						if (!response[i].locked && response[i].currentAmount < response[i].goal) {
							activeTarget[j] = response[i];
							j++;
						}
					}
					if (activeTarget.length > 0) { }
					else {
						omnibarText++;
						loadDataFromApi();
					}
				}
			});
		}
		else if (nodecg.bundleConfig.omnibar.showPolls && omnibarText < 4 && nodecg.bundleConfig.donation.useTiltify) {
			$.ajax({
				url: `https://tiltify.com/api/v3/campaigns/${nodecg.bundleConfig.donation.tiltifyCampaignID}/polls`,
				type: 'get',
				headers: {
					'Authorization': `Bearer ${nodecg.bundleConfig.donation.tiltifyAuthToken}`
				},
				dataType: 'json',
				success: (response) => {
					for (let i = 0; i < response.data.length; i++) {
						if (response.data[i].active) {
							activePoll[j] = response.data[i];
							j++;
						}
					}
					if (activePoll.length > 0) {
						for (let i = 0; i <= activePoll.length - 1; i++) {
							let pollToSort = activePoll[i].options;
							pollToSort.sort((a, b) => b.totalAmountRaised - a.totalAmountRaised);
							activePoll[i].options = pollToSort;
						}
					}
					else {
						omnibarText++;
						loadDataFromApi();
					}
				}
			});
		}
		else if (nodecg.bundleConfig.omnibar.showPolls && omnibarText < 4 && nodecg.bundleConfig.donation.useOengus) {
			$.ajax({
				url: URL,
				type: 'get',
				dataType: 'json',
				success: (response) => {
					for (let i = 0; i < response.length; i++) {
						if (!response[i].locked && response[i].bidWar && response[i].currentAmount < response[i].goal) {
							activePoll[j] = response[i];
							j++;
						}
					}
					if (activePoll.length > 0) {
						for (let i = 0; i <= activePoll.length - 1; i++) {
							let pollToSort = activePoll[i].bids;
							pollToSort.sort((a, b) => b.currentAmount - a.currentAmount);
							activePoll[i].bids = pollToSort;
						}
					}
					else {
						omnibarText++;
						loadDataFromApi();
					}
				}
			});
		}
		else if (nodecg.bundleConfig.omnibar.showRewards && omnibarText < 5 && nodecg.bundleConfig.donation.useTiltify) {
			$.ajax({
				url: `https://tiltify.com/api/v3/campaigns/${nodecg.bundleConfig.donation.tiltifyCampaignID}/rewards`,
				type: 'get',
				headers: {
					'Authorization': `Bearer ${nodecg.bundleConfig.donation.tiltifyAuthToken}`
				},
				dataType: 'json',
				success: (response) => {
					for (let i = 0; i < response.data.length; i++) {
						if (response.data[i].active) {
							activeReward[j] = response.data[i];
							j++;
						}
					}
					if (activeReward.length > 0)
						activeReward.sort((a, b) => a.endsAt - b.endsAt);
					else {
						omnibarText++;
						loadDataFromApi();
					}
				}
			});
		}
		// Will be enabled when Oengus supports prizes.
		/* else if (nodecg.bundleConfig.omnibar.showRewards && omnibarText < 5 && nodecg.bundleConfig.donation.useOengus) {
			$.ajax({
				url: URL,
				type: 'get',
				dataType: 'json',
				success: (response) => {
					for (let i = 0; i < response.length; i++) {
						if (!response[i].locked && response[i].currentAmount < response[i].goal) {
							activeReward[j] = response[i];
							j++;
						}
					}
					if (activeReward.length > 0) {}
					else {
						omnibarText++;
						loadDataFromApi();
					}
				}
			});
		} */
		else if (nodecg.bundleConfig.omnibar.showGoal && omnibarText < 6 && nodecg.bundleConfig.donation.useTiltify) {
			$.ajax({
				url: `https://tiltify.com/api/v3/campaigns/${nodecg.bundleConfig.donation.tiltifyCampaignID}`,
				type: 'get',
				headers: {
					'Authorization': `Bearer ${nodecg.bundleConfig.donation.tiltifyAuthToken}`
				},
				dataType: 'json',
				success: (response) => {
					console.log(response.data);
					activeMilestone = response.data.fundraiserGoalAmount;
				}
			});
		}
	}

	function runTickerText() {
		runDataActiveRun.on('change', (newVal, oldVal) => {
			activeRun = loadRuns(newVal);
		});

		runDataArray.on('change', (newVal, oldVal) => {
			activeRun = loadRuns(runDataActiveRun.value);
		});

		if (nodecg.bundleConfig.omnibar.dwellTime < 2000) {
			setOmnibarHtml(`<p class="is-single-line is-text-centered">Dwell time is too fast! Minimum 2000.</p>`);
			exit();
		}
		else
			setOmnibarHtml(`<p class="is-single-line is-text-centered">Omnibar is starting...</p>`);

		setInterval(() => {
			if (nodecg.bundleConfig.omnibar.showHost && activeHost.customData.host !== undefined && showHost) {
				omnibarText = 1;
				displayActiveHost(activeHost);
				showHost = false;
			}
			else if (runIndex < (nodecg.bundleConfig.omnibar.numRuns && activeRun.length)) {
				omnibarText = 2;
				displayActiveRuns(activeRun[runIndex]);
				runIndex++;
				if (runIndex === (nodecg.bundleConfig.omnibar.numRuns || activeRun.length)) {
					loadDataFromApi();
				}
			}
			else if (targetIndex < (nodecg.bundleConfig.omnibar.numTargets && activeTarget.length)) {
				omnibarText = 3;
				displayActiveTargets(activeTarget[targetIndex]);
				targetIndex++;
				if (targetIndex === (nodecg.bundleConfig.omnibar.numTargets || activeTarget.length)) {
					loadDataFromApi();
				}
			}
			else if (pollIndex < (nodecg.bundleConfig.omnibar.numPolls && activePoll.length)) {
				omnibarText = 4;
				displayActivePolls(activePoll[pollIndex]);
				pollIndex++;
				if (pollIndex === (nodecg.bundleConfig.omnibar.numPolls || activePoll.length)) {
					loadDataFromApi();
				}
			}
			else if (rewardIndex < (nodecg.bundleConfig.omnibar.numRewards && activeReward.length)) {
				omnibarText = 5;
				displayActiveRewards(activeReward[rewardIndex]);
				rewardIndex++;
				if (rewardtIndex === (nodecg.bundleConfig.omnibar.numRewards || activeReward.length)) {
					loadDataFromApi();
				}
			}
			else if (nodecg.bundleConfig.omnibar.showGoal && nodecg.bundleConfig.donation.useTiltify && showGoal && activeMilestone !== undefined) {
				omnibarText = 6;
				displayActiveMilestone(activeMilestone);
				showGoal = false;
			}
			else {
				omnibarText = 0;
				setOmnibarHtml(OMNIBAR_STATIC[staticIndex]);
				staticIndex++;

				if (staticIndex >= OMNIBAR_STATIC.length) {
					rewardIndex = pollIndex = targetIndex = runIndex = staticIndex = 0;
					showHost = true;
					showGoal = true;
				}
			}
		}, nodecg.bundleConfig.omnibar.dwellTime);
	}
});