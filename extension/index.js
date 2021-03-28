'use strict';

const fetch = require("node-fetch");
let oengusURL;
let oengusSandbox = false;

module.exports = function(nodecg) {
	setTimeout(() => { nodecg.log.info("All layouts loaded successfully.") }, 200);
	if (nodecg.bundleConfig.donation.useTiltify) {
		fetch(`https://tiltify.com/api/v3/campaigns/${nodecg.bundleConfig.donation.tiltifyCampaignID}`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${nodecg.bundleConfig.donation.tiltifyAuthToken}`
			},
			dataType: 'json',
		}).then(function(response) {
			if (response.status === 403) {
				nodecg.log.warn("Your Tiltify campaign ID or auth token is incorrect. (403 - Forbidden)")
				nodecg.log.warn("Tiltify features disabled.")
			}
			else if (response.status === 500) {
				nodecg.log.warn("There was error accessing Tiltify's servers. (500 - Internal Server Error)")
				nodecg.log.warn("Tiltify features disabled.")
			}
			else {
				nodecg.log.info(`Connected to campaign ID ${nodecg.bundleConfig.donation.tiltifyCampaignID}! Tiltify features enabled.`)
			}
		});
	}
	else if (nodecg.bundleConfig.donation.useOengus) {
		if (nodecg.bundleConfig.donation.oengusUseSandbox) {
			oengusURL = `https://sandbox.oengus.io/api/marathon/${nodecg.bundleConfig.donation.oengusMarathon}`;
			oengusSandbox = true;
			}
		else
			oengusURL = `https://oengus.io/api/marathon/${nodecg.bundleConfig.donation.oengusMarathon}`;
		fetch(oengusURL, {
			method: 'GET',
			dataType: 'json',
		}).then(function(response) {
			if (response.status === 404) {
				nodecg.log.warn("Your Oengus short name is incorrect. (404 - Not Found)")
				nodecg.log.warn("Oengus features disabled.")
			}
			else if (response.status === 500) {
				nodecg.log.warn("There was error accessing Oengus' servers. (500 - Internal Server Error)")
				nodecg.log.warn("Oengus features disabled.")
			}
			else {
				nodecg.log.info(`Connected to marathon ${nodecg.bundleConfig.donation.oengusMarathon}! Oengus features enabled.`)
				if (oengusSandbox)
				nodecg.log.warn("You are using a Oengus sandbox marathon! To disable, set oengusUseSandbox to false.");
				
			}
		});
	}
	else {
		nodecg.log.warn("Tiltify and Oengus features are disabled.")
	}
}
