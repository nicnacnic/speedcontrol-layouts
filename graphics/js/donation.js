'use strict';
$(() => {
	const TILTIFY_CAMPAIGN_ID = nodecg.bundleConfig.TILTIFY_CAMPAIGN_ID;
	const TILTIFY_AUTH_TOKEN = nodecg.bundleConfig.TILTIFY_AUTH_TOKEN;

	let countUp;
	let currentTotal;

	if (TILTIFY_CAMPAIGN_ID && TILTIFY_AUTH_TOKEN) {
		const pollInterval = setInterval(() => loadFromTiltifyApi(), nodecg.bundleConfig.TILTIFY_REFRESH_TIME);
		loadFromTiltifyApi();
	} else {
		alert('Cannot request Tiltify API - check TILTIFY_CAMPAIGN_ID and TILTIFY_AUTH_TOKEN in donation.js');
	}

	function loadFromTiltifyApi() {
		$.ajax({
			url: `https://tiltify.com/api/v3/campaigns/${TILTIFY_CAMPAIGN_ID}`,
			type: 'get',
			headers: {
				'Authorization': `Bearer ${TILTIFY_AUTH_TOKEN}`
			},
			dataType: 'json',
			success: (response) => {
				const newTotal = response.data.totalAmountRaised;

				// Only update if we get a new value from the API.
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