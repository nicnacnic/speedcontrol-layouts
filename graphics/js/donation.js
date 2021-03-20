'use strict';

const speedcontrolBundle = 'nodecg-speedcontrol';

$(() => {

	let countUp;
	let currentTotal;
	let URL;

	if (nodecg.bundleConfig.donation.tiltifyCampaignID && nodecg.bundleConfig.donation.tiltifyAuthToken && nodecg.bundleConfig.donation.useTiltify) {
		URL = `https://tiltify.com/api/v3/campaigns/${nodecg.bundleConfig.donation.tiltifyCampaignID}`;
		const pollInterval = setInterval(() => loadFromTiltifyApi(), nodecg.bundleConfig.donation.refreshTime);
		loadFromTiltifyApi();
	}
	else if (nodecg.bundleConfig.donation.oengusMarathon && nodecg.bundleConfig.donation.useOengus) {
		if (nodecg.bundleConfig.donation.oengusUseSandbox)
			URL = `https://sandbox.oengus.io/api/marathon/${nodecg.bundleConfig.donation.oengusMarathon}/donation/stats`;
		else
			URL = `https://oengus.io/api/marathon/${nodecg.bundleConfig.donation.oengusMarathon}/donation/stats`;
		const pollInterval = setInterval(() => loadFromOengusApi(), nodecg.bundleConfig.donation.refreshTime);
		loadFromOengusApi();
	}

	function loadFromTiltifyApi() {
		$.ajax({
			url: URL,
			type: 'get',
			headers: {
				'Authorization': `Bearer ${nodecg.bundleConfig.donation.tiltifyAuthToken}`
			},
			dataType: 'json',
			success: (response) => {
				const newTotal = response.data.totalAmountRaised;

				if (currentTotal !== newTotal) {
					currentTotal = newTotal;
					handleCountUp(currentTotal);
				}
			}
		});
	}

	function loadFromOengusApi() {
		$.ajax({
			url: URL,
			type: 'get',
			dataType: 'json',
			success: (response) => {
				const newTotal = response.total;

				if (currentTotal !== newTotal) {
					currentTotal = newTotal;
					handleCountUp(currentTotal);
				}
			}
		});
	}

	function handleCountUp(amount) {
		if (!countUp) {
			countUp = new CountUp('donation-total', amount, amount, 0, 0.75, {
				prefix: '$'
			});
			countUp.start();
		} else {
			countUp.update(amount);
		}
	}
});