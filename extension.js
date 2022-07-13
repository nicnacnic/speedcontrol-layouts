const fetch = require("node-fetch");
const EventSource = require('eventsource')

module.exports = (nodecg) => {

	// Declare replicants.
	const data = nodecg.Replicant('data', { defaultValue: {} });
	const runDataArray = nodecg.Replicant('runDataArray', 'nodecg-speedcontrol');
	const runDataActiveRun = nodecg.Replicant('runDataActiveRun', 'nodecg-speedcontrol');

	runDataActiveRun.on('change', (newVal, oldVal) => {
		if (oldVal) {
			let index = runDataArray.value.findIndex(x => x.id === newVal.id);
			data.value.runs = JSON.parse(JSON.stringify(runDataArray.value.slice(index + 1, index + 6)))
		}
	})

	// Pull data from Tiltify/Oengus
	switch (true) {
		case (nodecg.bundleConfig.tiltify.active): useTiltify(); break;
		case (nodecg.bundleConfig.oengus.active): useOengus(); break;
		case (nodecg.bundleConfig.indiethonTracker.active): useTracker(); break;
		default: nodecg.log.error('No data source selected! Please select a data source in the config.'); process.exit();
	}

	async function useTiltify() {
		let res = await fetch(`https://tiltify.com/api/v3/campaigns/${nodecg.bundleConfig.tiltify.campaignID}`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${nodecg.bundleConfig.donation.tiltifyAuthToken}`
			},
			dataType: 'json',
		});
		let data = await res.json();
		if (res.status === (403 || 500)) {
			nodecg.log.error("There was an issue retriving your Tiltify campaign information. Make sure your campaign ID and auth token are correct!")
			return process.exit();
		}
		nodecg.log.info(`Connected to campaign ID ${nodecg.bundleConfig.donation.tiltifyCampaignID}!`)
		getTiltifyData()
		setInterval(() => {
			getTiltifyData()
		}, nodecg.bundleConfig.tiltify.refreshTime)
	}

	async function useOengus() {
		let res = await fetch(`https://${(nodecg.bundleConfig.oengus.useSandbox) ? 'sandbox' : ''}oengus.io/api/marathons/${nodecg.bundleConfig.oengus.marathonShort}`, {
			method: 'GET',
			dataType: 'json',
		});
		let data = await res.json();
		if (res.status === (403 || 500)) {
			nodecg.log.error("There was an issue retriving your Oengus marathon information. Make sure your marathon short is correct!")
			return process.exit();
		}
		nodecg.log.info(`Connected to marathon ${nodecg.bundleConfig.oengus.marathonShort}!`)
		if (nodecg.bundleConfig.oengus.useSandbox) nodecg.log.warn("You are using a Oengus sandbox marathon! To disable, set useSandbox to false.");
		setInterval(() => {
			getOengusData()
		}, nodecg.bundleConfig.oengus.refreshTime);
		getOengusData();
	}

	async function useTracker() {
		let res = await fetch(`${nodecg.bundleConfig.indiethonTracker.apiUrl}/events/${nodecg.bundleConfig.indiethonTracker.eventShort}`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${nodecg.bundleConfig.indiethonTracker.token}`
			},
			dataType: 'json',
		});
		let data = await res.json();
		if (res.status === (401 || 403 || 500)) {
			nodecg.log.error("There was an issue connecting to the tracker. Make sure your API URL and token are correct!")
			return process.exit();
		}
		setInterval(() => {
			getTrackerData();
		}, 30000)
		getTrackerData();
	}

	async function getTrackerData() {
		// Get general details.
		let detailRes = await fetch(`${nodecg.bundleConfig.indiethonTracker.apiUrl}/details`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${nodecg.bundleConfig.indiethonTracker.token}`
			},
			dataType: 'json',
		});
		let details = await detailRes.json();

		// Get event data.
		let eventRes = await fetch(`${nodecg.bundleConfig.indiethonTracker.apiUrl}/events/${nodecg.bundleConfig.indiethonTracker.eventShort}`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${nodecg.bundleConfig.indiethonTracker.token}`
			},
			dataType: 'json',
		});
		let eventData = await eventRes.json();

		// Get incentive data.
		let incentiveRes = await fetch(`${nodecg.bundleConfig.indiethonTracker.apiUrl}/incentives/event/${nodecg.bundleConfig.indiethonTracker.eventShort}`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${nodecg.bundleConfig.indiethonTracker.token}`
			},
			dataType: 'json',
		});
		const incentiveData = await incentiveRes.json();

		let targetArray = [];
		let bidwarArray = [];
		for (const incentive of incentiveData) {
			let name = `${incentive.run.game} ${incentive.name}`;
			if (incentive.type === 'target' && incentive.active && new Date(incentive.endTime) > new Date()) targetArray.push({ name: name, total: incentive.total, goal: incentive.goal, endTime: incentive.endTime });
			else if (incentive.type === 'bidwar' && incentive.active && new Date(incentive.endTime) > new Date()) bidwarArray.push({ name: name, options: incentive.options, endTime: incentive.endTime });
		}

		targetArray = targetArray.sort((a, b) => { new Date(a.endTime) - new Date(b.endTime) });

		for (const bidwar of bidwarArray) {
			bidwar.options.sort((a, b) => b.total - a.total);
		}

		bidwarArray = bidwarArray.sort((a, b) => { new Date(a.endTime) - new Date(b.endTime) });

		// Get prize data.
		let prizeRes = await fetch(`${nodecg.bundleConfig.indiethonTracker.apiUrl}/prizes/event/${nodecg.bundleConfig.indiethonTracker.eventShort}`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${nodecg.bundleConfig.indiethonTracker.token}`
			},
			dataType: 'json',
		});
		let prizeData = await prizeRes.json();

		let prizeArray = [];
		for (const prize of prizeData) {
			if (prize.active && new Date(prize.endTime) > new Date()) prizeArray.push({ name: prize.name, minDonation: prize.minDonation, endTime: prize.endTime })
		}

		prizeArray = prizeArray.sort((a, b) => { new Date(a.endTime) - new Date(b.endTime) });

		data.value = {
			event: {
				name: eventData.name,
				charity: eventData.charity.name,
				url: nodecg.bundleConfig.indiethonTracker.apiUrl,
				total: eventData.stats.total,
				goal: eventData.targetAmount,
				currency: details.currencySymbol,
				timestamp: Date.now(),
			},
			targets: targetArray,
			bidwars: bidwarArray,
			prizes: prizeArray,
			runs: [],
		};

		if (runDataArray.value.length > 0 && runDataActiveRun.value !== undefined) {
			let index = runDataArray.value.findIndex(x => x.id === runDataActiveRun.value.id);
			data.value.runs = JSON.parse(JSON.stringify(runDataArray.value.slice(index + 1, index + 6)));
		}
	};

	async function getOengusData() {

		// Get general details.
		let detailRes = await fetch(`https://oengus.io/api/marathons/${nodecg.bundleConfig.oengus.marathonShort}`, {
			method: 'GET',
			dataType: 'json',
		});
		let details = await detailRes.json();

		// Get incentive data.
		// Currently disabled because they don't work in Oengus :(

		// let incentiveRes = await fetch(`${nodecg.bundleConfig.indiethonTracker.apiUrl}/incentives/event/${nodecg.bundleConfig.indiethonTracker.eventShort}`, {
		// 	method: 'GET',
		// 	headers: {
		// 		'Authorization': `Bearer ${nodecg.bundleConfig.indiethonTracker.token}`
		// 	},
		// 	dataType: 'json',
		// });
		// const incentiveData = await incentiveRes.json();

		// let targetArray = [];
		// let bidwarArray = [];
		// for (const incentive of incentiveData) {
		// 	let name = `${incentive.run.game} ${incentive.name}`;
		// 	if (incentive.type === 'target' && incentive.active && new Date(incentive.endTime) > new Date()) targetArray.push({ name: name, total: incentive.total, goal: incentive.goal, endTime: incentive.endTime });
		// 	else if (incentive.type === 'bidwar' && incentive.active && new Date(incentive.endTime) > new Date()) bidwarArray.push({ name: name, options: incentive.options, endTime: incentive.endTime });
		// }

		// targetArray = targetArray.sort((a, b) => { new Date(a.endTime) - new Date(b.endTime) });

		// for (const bidwar of bidwarArray) {
		// 	bidwar.options.sort((a, b) => b.total - a.total);
		// }

		// bidwarArray = bidwarArray.sort((a, b) => { new Date(a.endTime) - new Date(b.endTime) });

		// // Get prize data.
		// let prizeRes = await fetch(`${nodecg.bundleConfig.indiethonTracker.apiUrl}/prizes/event/${nodecg.bundleConfig.indiethonTracker.eventShort}`, {
		// 	method: 'GET',
		// 	headers: {
		// 		'Authorization': `Bearer ${nodecg.bundleConfig.indiethonTracker.token}`
		// 	},
		// 	dataType: 'json',
		// });
		// let prizeData = await prizeRes.json();

		// let prizeArray = [];
		// for (const prize of prizeData) {
		// 	if (prize.active && new Date(prize.endTime) > new Date()) prizeArray.push({ name: prize.name, minDonation: prize.minDonation, endTime: prize.endTime })
		// }

		// prizeArray = prizeArray.sort((a, b) => { new Date(a.endTime) - new Date(b.endTime) });

		data.value = {
			event: {
				name: details.name,
				charity: details.supportedCharity,
				url: '',
				total: details.donationsTotal,
				goal: 0,
				currency: currencies[details.donationCurrency],
				timestamp: Date.now(),
			},
			targets: [],
			bidwars: [],
			prizes: [],
			runs: [],
		};

		if (runDataArray.value.length > 0 && runDataActiveRun.value !== undefined) {
			let index = runDataArray.value.findIndex(x => x.id === runDataActiveRun.value.id);
			data.value.runs = JSON.parse(JSON.stringify(runDataArray.value.slice(index + 1, index + 6)));
		}
	}
}

// rewards.data.forEach(element => {
// 	if ((element.startsAt > new Date().getTime() || element.startsAt === 0) && (element.endsAt > new Date().getTime() || element.endsAt === 0) && element.active) {
// 		if (element.endsAt === 0)
// 			element.endsAt = 9999999999999;
// 		rewardArray.push({ name: element.name, description: element.description, minDonation: element.amount, endsAt: element.endsAt, img: element.image.src, id: element.id })
// 	}
// })
// rewardArray.sort((a, b) => a.endsAt - b.endsAt);
// rewardData.value = { dataLength: rewardArray.length, data: rewardArray };

// polls.data.forEach(element => {
// 	if (element.active) {
// 		let pollOptionArray = [];
// 		element.options.forEach(pollOption => {
// 			pollOptionArray.push({ name: pollOption.name, currentAmount: pollOption.totalAmountRaised })
// 		})
// 		pollOptionArray.sort((a, b) => b.currentAmount - a.currentAmount);
// 		pollArray.push({ name: element.name, options: pollOptionArray, id: element.id })
// 	}
// })
// pollData.value = { dataLength: pollArray.length, data: pollArray };

// function test() {
// 	if (nodecg.bundleConfig.tiltify.active) {
// 		fetch(`https://tiltify.com/api/v3/campaigns/${nodecg.bundleConfig.donation.tiltifyCampaignID}`, {
// 			method: 'GET',
// 			headers: {
// 				'Authorization': `Bearer ${nodecg.bundleConfig.donation.tiltifyAuthToken}`
// 			},
// 			dataType: 'json',
// 		}).then(response => response.json())
// 			.then(data => {
// 				if (data.status === (403 || 500))
// 					nodecg.log.error("There was an issue retriving your Tiltify campaign information. Make sure your campaign ID and auth token are correct!")
// 				else {
// 					nodecg.log.info(`Connected to campaign ID ${nodecg.bundleConfig.donation.tiltifyCampaignID}!`)
// 					getTiltifyData()
// 					setInterval(() => {
// 						getTiltifyData()
// 					}, nodecg.bundleConfig.donation.refreshTime)
// 				}
// 			});
// 	}
// 	else if (nodecg.bundleConfig.oengus.active) {
// 		if (nodecg.bundleConfig.oengus.useSandbox)
// 			oengusURL = `https://sandbox.oengus.io/api/marathons/${nodecg.bundleConfig.donation.oengusMarathon}`;
// 		else
// 			oengusURL = `https://oengus.io/api/marathons/${nodecg.bundleConfig.donation.oengusMarathon}`;
// 		fetch(oengusURL, {
// 			method: 'GET',
// 			dataType: 'json',
// 		}).then(response => response.json())
// 			.then(data => {
// 				if (data.status === (403 || 500))
// 					nodecg.log.error("There was an issue retriving your Oengus marathon information. Make sure your marathon short name is correct!")
// 				else {
// 					nodecg.log.info(`Connected to marathon ${nodecg.bundleConfig.donation.oengusMarathon}!`)
// 					if (nodecg.bundleConfig.donation.oengusUseSandbox)
// 						nodecg.log.warn("You are using a Oengus sandbox marathon! To disable, set oengusUseSandbox to false.");
// 					getOengusData();
// 					setInterval(() => {
// 						getOengusData()
// 					}, nodecg.bundleConfig.donation.refreshTime)
// 				}
// 			})
// 	}
// }

// function getTiltifyData() {
// 	// Get campaign data.
// 	fetch(`https://tiltify.com/api/v3/campaigns/${nodecg.bundleConfig.tiltify.campaignID}`, {
// 		method: 'GET',
// 		headers: {
// 			'Authorization': `Bearer ${nodecg.bundleConfig.tiltify.authToken}`
// 		},
// 		dataType: 'json',
// 	}).then(response => response.json())
// 		.then(data => {
// 			campaignData.value = { name: data.data.name, url: data.data.url, description: data.data.description, currentAmount: data.data.amountRaised, targetAmount: data.data.fundraiserGoalAmount }
// 			donationTotal.value = data.data.amountRaised;
// 		}).catch(error => {
// 			nodecg.log.warn('There was an error retrieving Tiltify campaign info.');
// 			nodecg.log.warn(error);
// 		});

// 	// Get targets.
// 	fetch(`https://tiltify.com/api/v3/campaigns/${nodecg.bundleConfig.donation.tiltifyCampaignID}/challenges`, {
// 		method: 'GET',
// 		headers: {
// 			'Authorization': `Bearer ${nodecg.bundleConfig.donation.tiltifyAuthToken}`
// 		},
// 		dataType: 'json',
// 	}).then(response => response.json())
// 		.then(targets => {
// 			let targetArray = [];
// 			if (targets.data !== '') {
// 				targets.data.forEach(element => {
// 					if ((element.endsAt > new Date().getTime() || element.endsAt === 0) && element.totalAmountRaised < element.amount && element.active) {
// 						if (element.endsAt === 0)
// 							element.endsAt = 9999999999999;
// 						targetArray.push({ name: element.name, currentAmount: element.amount, targetAmount: element.totalAmountRaised, endsAt: element.endsAt, id: element.id })
// 					}
// 				})
// 				targetArray.sort((a, b) => a.endsAt - b.endsAt);
// 				targetData.value = { dataLength: targetArray.length, data: targetArray };
// 			}
// 		}).catch(error => {
// 			nodecg.log.warn('There was an error retrieving Tiltify targets.');
// 			nodecg.log.warn(error);
// 		});

// 	// Get polls.
// 	fetch(`https://tiltify.com/api/v3/campaigns/${nodecg.bundleConfig.donation.tiltifyCampaignID}/polls`, {
// 		method: 'GET',
// 		headers: {
// 			'Authorization': `Bearer ${nodecg.bundleConfig.donation.tiltifyAuthToken}`
// 		},
// 		dataType: 'json',
// 	}).then(response => response.json())
// 		.then(polls => {
// 			let pollArray = [];
// 			if (polls.data !== '') {
// 				polls.data.forEach(element => {
// 					if (element.active) {
// 						let pollOptionArray = [];
// 						element.options.forEach(pollOption => {
// 							pollOptionArray.push({ name: pollOption.name, currentAmount: pollOption.totalAmountRaised })
// 						})
// 						pollOptionArray.sort((a, b) => b.currentAmount - a.currentAmount);
// 						pollArray.push({ name: element.name, options: pollOptionArray, id: element.id })
// 					}
// 				})
// 				pollData.value = { dataLength: pollArray.length, data: pollArray };
// 			}
// 		}).catch(error => {
// 			nodecg.log.warn('There was an error retrieving Tiltify polls.');
// 			nodecg.log.warn(error);
// 		});

// 	// Get rewards.
// 	fetch(`https://tiltify.com/api/v3/campaigns/${nodecg.bundleConfig.donation.tiltifyCampaignID}/rewards`, {
// 		method: 'GET',
// 		headers: {
// 			'Authorization': `Bearer ${nodecg.bundleConfig.donation.tiltifyAuthToken}`
// 		},
// 		dataType: 'json',
// 	}).then(response => response.json())
// 		.then(rewards => {
// 			let rewardArray = [];
// 			if (rewards.data !== '') {
// 				rewards.data.forEach(element => {
// 					if ((element.startsAt > new Date().getTime() || element.startsAt === 0) && (element.endsAt > new Date().getTime() || element.endsAt === 0) && element.active) {
// 						if (element.endsAt === 0)
// 							element.endsAt = 9999999999999;
// 						rewardArray.push({ name: element.name, description: element.description, minDonation: element.amount, endsAt: element.endsAt, img: element.image.src, id: element.id })
// 					}
// 				})
// 				rewardArray.sort((a, b) => a.endsAt - b.endsAt);
// 				rewardData.value = { dataLength: rewardArray.length, data: rewardArray };
// 			}
// 		}).catch(error => {
// 			nodecg.log.warn('There was an error retrieving Tiltify rewards.');
// 			nodecg.log.warn(error);
// 		});
// }

// function getOengusData() {
// 	fetch(oengusURL, {
// 		method: 'GET',
// 		dataType: 'json',
// 	}).then(response => response.json())
// 		.then(data => {
// 			campaignData.value = { name: data.name, url: 'https://oengus.fun/' + data.id, description: data.description, currentAmount: data.donationsTotal, targetAmount: 0 }
// 			donationTotal.value = data.donationsTotal;

// 			// Get incentive data.
// 			fetch(oengusURL + '/incentives', {
// 				method: 'GET',
// 				dataType: 'json',
// 			}).then(response => response.json())
// 				.then(incentives => {
// 					let targets = [];
// 					let polls = [];
// 					let rewards = [];
// 					if (incentives !== '' || incentives !== undefined)
// 						incentives.forEach(element => {
// 							if (!element.locked && !element.bidWar)
// 								targets.push({ name: element.name, currentAmount: element.currentAmount, targetAmount: element.goal, id: element.id })
// 							else if (!element.locked && element.bidWar) {
// 								let pollOptionArray = [];
// 								element.bids.forEach(pollOption => {
// 									pollOptionArray.push({ name: pollOption.name, currentAmount: pollOption.currentAmount })
// 								})
// 								pollOptionArray.sort((a, b) => b.currentAmount - a.currentAmount);
// 								polls.push({ name: element.name, options: pollOptionArray, id: element.id })
// 							}
// 						});
// 					targetData.value = { dataLength: targets.length, data: targets };
// 					pollData.value = { dataLength: polls.length, data: polls };
// 				})
// 		}).catch(error => {
// 			nodecg.log.warn('There was an error retrieving Oengus data.');
// 			nodecg.log.warn(error);
// 		});

const currencies = {
	'AUD': 'A$',
	'BRL': 'R$',
	'CAD': 'CA$',
	'CNY': 'CNY',
	'CZK': 'Kč',
	'DKK': 'kr',
	'EUR': '€',
	'HKD': 'HK$',
	'HUF': 'Ft',
	'ILS': '₪',
	'JPY': '¥',
	'MYR': 'RM',
	'MXN': 'MX$',
	'TWD': 'NT$',
	'NZD': 'NZ$',
	'NOK': 'kr',
	'PHP': '₱',
	'PLN': 'zł',
	'GBP': '£',
	'RUB': '₽',
	'SGD': 'S$',
	'SEK': 'kr',
	'CHF': 'CHF',
	'THB': '฿',
	'USD': '$',
}
