const fetch = require("node-fetch");
let oengusURL;

module.exports = function (nodecg) {

	// Declare replicants.
	const targetData = nodecg.Replicant('targetData', '');
	const pollData = nodecg.Replicant('pollData', '');
	const rewardData = nodecg.Replicant('rewardData', '');
	const campaignData = nodecg.Replicant('campaignData', '');
	const donationTotal = nodecg.Replicant('donationTotal', 0)

	campaignData.value = { currentAmount: 0, targetAmount: 0 }

	// Pull data from Tiltify/Oengus
	if (nodecg.bundleConfig.donation.useTiltify) {
		fetch(`https://tiltify.com/api/v3/campaigns/${nodecg.bundleConfig.donation.tiltifyCampaignID}`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${nodecg.bundleConfig.donation.tiltifyAuthToken}`
			},
			dataType: 'json',
		}).then(response => response.json())
			.then(data => {
				if (data.status === (403 || 500))
					nodecg.log.error("There was an issue retriving your Tiltify campaign information. Make sure your campaign ID and auth token are correct!")
				else {
					nodecg.log.info(`Connected to campaign ID ${nodecg.bundleConfig.donation.tiltifyCampaignID}!`)
					getTiltifyData()
					setInterval(() => {
						getTiltifyData()
					}, nodecg.bundleConfig.donation.refreshTime)
				}
			});
	}
	else if (nodecg.bundleConfig.donation.useOengus) {
		if (nodecg.bundleConfig.donation.oengusUseSandbox)
			oengusURL = `https://sandbox.oengus.io/api/marathons/${nodecg.bundleConfig.donation.oengusMarathon}`;
		else
			oengusURL = `https://oengus.io/api/marathons/${nodecg.bundleConfig.donation.oengusMarathon}`;
		fetch(oengusURL, {
			method: 'GET',
			dataType: 'json',
		}).then(response => response.json())
			.then(data => {
				if (data.status === (403 || 500))
					nodecg.log.error("There was an issue retriving your Oengus marathon information. Make sure your marathon short name is correct!")
				else {
					nodecg.log.info(`Connected to marathon ${nodecg.bundleConfig.donation.oengusMarathon}!`)
					if (nodecg.bundleConfig.donation.oengusUseSandbox)
						nodecg.log.warn("You are using a Oengus sandbox marathon! To disable, set oengusUseSandbox to false.");
					getOengusData();
					setInterval(() => {
						getOengusData()
					}, nodecg.bundleConfig.donation.refreshTime)
				}
			})
	}

	function getTiltifyData() {
		// Get campaign data.
		fetch(`https://tiltify.com/api/v3/campaigns/${nodecg.bundleConfig.donation.tiltifyCampaignID}`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${nodecg.bundleConfig.donation.tiltifyAuthToken}`
			},
			dataType: 'json',
		}).then(response => response.json())
			.then(data => {
				campaignData.value = { name: data.data.name, url: data.data.url, description: data.data.description, currentAmount: data.data.amountRaised, targetAmount: data.data.fundraiserGoalAmount }
				donationTotal.value = data.data.amountRaised;
			}).catch(error => {
				nodecg.log.warn('There was an error retrieving Tiltify campaign info.');
				nodecg.log.warn(error);
			});

		// Get targets.
		fetch(`https://tiltify.com/api/v3/campaigns/${nodecg.bundleConfig.donation.tiltifyCampaignID}/challenges`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${nodecg.bundleConfig.donation.tiltifyAuthToken}`
			},
			dataType: 'json',
		}).then(response => response.json())
			.then(targets => {
				let targetArray = [];
				if (targets.data !== '') {
					targets.data.forEach(element => {
						if ((element.endsAt > new Date().getTime() || element.endsAt === 0) && element.totalAmountRaised < element.amount && element.active) {
							if (element.endsAt === 0)
								element.endsAt = 9999999999999;
							targetArray.push({ name: element.name, currentAmount: element.amount, targetAmount: element.totalAmountRaised, endsAt: element.endsAt, id: element.id })
						}
					})
					targetArray.sort((a, b) => a.endsAt - b.endsAt);
					targetData.value = { dataLength: targetArray.length, data: targetArray };
				}
			}).catch(error => {
				nodecg.log.warn('There was an error retrieving Tiltify targets.');
				nodecg.log.warn(error);
			});

		// Get polls.
		fetch(`https://tiltify.com/api/v3/campaigns/${nodecg.bundleConfig.donation.tiltifyCampaignID}/polls`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${nodecg.bundleConfig.donation.tiltifyAuthToken}`
			},
			dataType: 'json',
		}).then(response => response.json())
			.then(polls => {
				let pollArray = [];
				if (polls.data !== '') {
					polls.data.forEach(element => {
						if (element.active) {
							let pollOptionArray = [];
							element.options.forEach(pollOption => {
								pollOptionArray.push({ name: pollOption.name, currentAmount: pollOption.totalAmountRaised })
							})
							pollOptionArray.sort((a, b) => b.currentAmount - a.currentAmount);
							pollArray.push({ name: element.name, options: pollOptionArray, id: element.id })
						}
					})
					pollData.value = { dataLength: pollArray.length, data: pollArray };
				}
			}).catch(error => {
				nodecg.log.warn('There was an error retrieving Tiltify polls.');
				nodecg.log.warn(error);
			});

		// Get rewards.
		fetch(`https://tiltify.com/api/v3/campaigns/${nodecg.bundleConfig.donation.tiltifyCampaignID}/rewards`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${nodecg.bundleConfig.donation.tiltifyAuthToken}`
			},
			dataType: 'json',
		}).then(response => response.json())
			.then(rewards => {
				let rewardArray = [];
				if (rewards.data !== '') {
					rewards.data.forEach(element => {
						if ((element.startsAt > new Date().getTime() || element.startsAt === 0) && (element.endsAt > new Date().getTime() || element.endsAt === 0) && element.active) {
							if (element.endsAt === 0)
								element.endsAt = 9999999999999;
							rewardArray.push({ name: element.name, description: element.description, minDonation: element.amount, endsAt: element.endsAt, img: element.image.src, id: element.id })
						}
					})
					rewardArray.sort((a, b) => a.endsAt - b.endsAt);
					rewardData.value = { dataLength: rewardArray.length, data: rewardArray };
				}
			}).catch(error => {
				nodecg.log.warn('There was an error retrieving Tiltify rewards.');
				nodecg.log.warn(error);
			});
	}

	function getOengusData() {
		fetch(oengusURL, {
			method: 'GET',
			dataType: 'json',
		}).then(response => response.json())
			.then(data => {
				campaignData.value = { name: data.name, url: 'https://oengus.fun/' + data.id, description: data.description, currentAmount: data.donationsTotal, targetAmount: 0 }
				donationTotal.value = data.donationsTotal;

				// Get incentive data.
				fetch(oengusURL + '/incentives', {
					method: 'GET',
					dataType: 'json',
				}).then(response => response.json())
					.then(incentives => {
						let targets = [];
						let polls = [];
						let rewards = [];
						if (incentives !== '' || incentives !== undefined)
							incentives.forEach(element => {
								if (!element.locked && !element.bidWar)
									targets.push({ name: element.name, currentAmount: element.currentAmount, targetAmount: element.goal, id: element.id })
								else if (!element.locked && element.bidWar) {
									let pollOptionArray = [];
									element.bids.forEach(pollOption => {
										pollOptionArray.push({ name: pollOption.name, currentAmount: pollOption.currentAmount })
									})
									pollOptionArray.sort((a, b) => b.currentAmount - a.currentAmount);
									polls.push({ name: element.name, options: pollOptionArray, id: element.id })
								}
							});
						targetData.value = { dataLength: targets.length, data: targets };
						pollData.value = { dataLength: polls.length, data: polls };
					})
			}).catch(error => {
				nodecg.log.warn('There was an error retrieving Oengus data.');
				nodecg.log.warn(error);
			});
	}
}