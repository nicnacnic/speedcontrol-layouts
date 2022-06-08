const charityLogo = nodecg.Replicant('assets:omnibarCharityLogo');
const marathonLogo = nodecg.Replicant('assets:omnibarMarathonLogo');
const runDataArray = nodecg.Replicant('runDataArray', 'nodecg-speedcontrol');
const runDataActiveRun = nodecg.Replicant('runDataActiveRun', 'nodecg-speedcontrol');

let text = {};
let counter = 0;
let dataVal = {};

NodeCG.waitForReplicants(data, charityLogo, marathonLogo, runDataArray, runDataActiveRun).then(() => {
	try { document.querySelector('#charityLogo img').setAttribute('src', charityLogo.value[0].url) } catch {}
	try { document.querySelector('#marathonLogo img').setAttribute('src', marathonLogo.value[0].url) } catch {}
	runDataActiveRun.on('change', (newVal) => data.value.host = (newVal.customData && newVal.customData.host) ? newVal.customData.host : undefined)
	data.on('change', (newVal, oldVal) => { 
		if (!oldVal) setText('message', 0, data.value)
		dataVal = newVal;
	})
	changeOmnibarText()
});

async function setText(type, index, value) {
	let players;
	if (type === "run") players = await getPlayerNames(value.runs[index]);

	// Omnibar Text
	try {
		if (type === "message") {
			text.message = [
				`<p class="singleLine">Indiethon 2022 is benefiting <span class="singleLine secondary">Puppies Behind Bars</span></p>`,
				`<p class="singleLine">Donate at <span class="singleLine secondary">donate.indiethon.live</span></p>`,
				`<p class="singleLine">Check out our merchandise at<span class="singleLine secondary"> store.indiethon.live</span></p>`,
			];
		}

		else if (type === "host") {
			text.host = [
				`<p class="singleLine">Your current host is <span class="singleLine secondary">${value.host}</span></p>`
			];
		}

		else if (type === "run") {
			text.run = [
				`<p class="multiLine">Up Next: ${value.runs[index].game}</p> <p class="multiLine">${value.runs[index].category} by ${players}</p>`,
				`<p class="multiLine">On Deck: ${value.runs[index].game}</p> <p class="multiLine">${value.runs[index].category} by ${players}</p>`,
			];
		}

		else if (type === "target") {
			text.target = [
				`<p class="multiLine">Upcoming Incentive: ${value.targets[index].name}</p> <p class="multiLine">$${value.targets[index].total} / $${value.targets[index].goal}</p>`,
				`<p class="multiLine">Upcoming Incentive: ${value.targets[index].name}</p> <p class="multiLine">$${value.targets[index].total} / $${value.targets[index].goal}</p>`,
			]
		}

		else if (type === "bidwar") {
			text.bidwar = [
				`<p class="multiLine">Upcoming Bidwar: ${value.bidwars[index].name}</p>`,
				`<p class="multiLine">Upcoming Bidwar: ${value.bidwars[index].name}</p>`,
			]
			text.bidwar[index] += `<p class="multiLine">`;
			for (let i = 0; i < value.bidwars[index].options.length; i++) {
				let option = value.bidwars[index].options[i];
				text.bidwar[index] += `${option.name}: $${option.total}`;
				if (i === value.bidwars[index].options.length - 1 || i >= 2) break;
				else text.bidwar[index] += ` vs `;
			}
			text.bidwar[index] += `</p>`
		}

		else if (type === "prize") {
			let prizeIndex = Math.floor(Math.random() * value.prizes.length);
			text.prize = [
				`<p class="multiLine">Latest Prize: ${value.prizes[prizeIndex].name}</p> <p class="multiLine">Minimum Donation: $${value.prizes[prizeIndex].minDonation}</p>`,
				`<p class="multiLine">Latest Prize: ${value.prizes[prizeIndex].name}</p> <p class="multiLine">Minimum Donation: $${value.prizes[prizeIndex].minDonation}</p>`,
			]
		}

		else if (type === "goal") {
			text.goal = [
				`<p class="singleLine">Event Goal: $${value.event.goal}</p>`,
			]
		}

		return text[type][index];

	} catch { return false }
}

function getPlayerNames(run) {
	let playerArray = [];
	for (const team of run.teams) {
		for (const player of team.players) {
			playerArray.push(player.name);
		}
	}
	return playerArray.join(', ');
}


async function changeOmnibarText() {
	switch (counter) {
		case 0: showMessages(); return;
		case 1: showHost(); return;
		case 2: showRuns(); return;
		case 3: showTargets(); return;
		case 4: showBidwars(); return;
		case 5: showPrizes(); return;
		case 6: showGoal(); return;
	}
}

async function showMessages() {
	await new Promise(async (resolve, reject) => {
		for (let i = 0; i < 100; i++) {
			await new Promise(async (loopResolve, loopReject) => {
				let htmlText = await setText('message', i, dataVal)
				if (htmlText) setOmnibarHtml(htmlText);
				setTimeout(() => loopResolve(), nodecg.bundleConfig.omnibar.dwellTime)
			});
			if (i >= text.message.length - 1) resolve();
		}
	})
	counter++;
	return changeOmnibarText();
}

async function showHost() {
	await new Promise(async (resolve, reject) => {
		if (!data.value.host || !nodecg.bundleConfig.omnibar.showHost) resolve();
		setOmnibarHtml(await setText('host', 0, dataVal));
		setTimeout(() => resolve(), nodecg.bundleConfig.omnibar.dwellTime)
	});

	counter++;
	return changeOmnibarText();
}

async function showRuns() {
	await new Promise(async (resolve, reject) => {
		for (let i = 0; i < 100; i++) {
			await new Promise(async (loopResolve, loopReject) => {
				let htmlText = await setText('run', i, dataVal)
				if (htmlText && i <= nodecg.bundleConfig.omnibar.numRuns - 1) setOmnibarHtml(htmlText);
				else { resolve(); return; }
				setTimeout(() => loopResolve(), nodecg.bundleConfig.omnibar.dwellTime)
			});
		}
	})
	counter++;
	return changeOmnibarText();
}

async function showTargets() {
	await new Promise(async (resolve, reject) => {
		for (let i = 0; i < 100; i++) {
			await new Promise(async (loopResolve, loopReject) => {
				let htmlText = await setText('target', i, dataVal)
				if (htmlText && i <= nodecg.bundleConfig.omnibar.numTargets - 1) setOmnibarHtml(htmlText);
				else { resolve(); return; }
				setTimeout(() => loopResolve(), nodecg.bundleConfig.omnibar.dwellTime)
			});
		}
	})
	counter++;
	return changeOmnibarText();
}

async function showBidwars() {
	await new Promise(async (resolve, reject) => {
		for (let i = 0; i < 100; i++) {
			await new Promise(async (loopResolve, loopReject) => {
				let htmlText = await setText('bidwar', i, dataVal)
				if (htmlText && i <= nodecg.bundleConfig.omnibar.numBidwars - 1) setOmnibarHtml(htmlText);
				else { resolve(); return; }
				setTimeout(() => loopResolve(), nodecg.bundleConfig.omnibar.dwellTime)
			});
		}
	})
	counter++;
	return changeOmnibarText();
}

async function showPrizes() {
	await new Promise(async (resolve, reject) => {
		for (let i = 0; i < 100; i++) {
			await new Promise(async (loopResolve, loopReject) => {
				let htmlText = await setText('prize', i, dataVal)
				if (htmlText && i <= nodecg.bundleConfig.omnibar.numPrizes - 1) setOmnibarHtml(htmlText);
				else { resolve(); return; }
				setTimeout(() => loopResolve(), nodecg.bundleConfig.omnibar.dwellTime)
			});
		}
	})
	counter++;
	return changeOmnibarText();
}

async function showGoal() {
	await new Promise(async (resolve, reject) => {
		if (!nodecg.bundleConfig.omnibar.showGoal) resolve();
		setOmnibarHtml(await setText('goal', 0, dataVal));
		setTimeout(() => resolve(), nodecg.bundleConfig.omnibar.dwellTime)
	});

	counter = 0;
	return changeOmnibarText();
}

function setOmnibarHtml(html) {
	$('#omnibarContent').fadeOut(nodecg.bundleConfig.omnibar.fadeOutTime, () => {
		$('#omnibarContent').html(html).fadeIn(nodecg.bundleConfig.omnibar.fadeInTime);
	});
}