const sponsorImgs = nodecg.Replicant('assets:sponsorContainer');

NodeCG.waitForReplicants(sponsorImgs).then(() => runImages());

function updateSponsorImage(imgSrc) {
	$('#sponsor-img').fadeOut(nodecg.bundleConfig.sponsor.fadeOutTime, () => {
		setTimeout(() => {
			$('#sponsor-img').attr('src', imgSrc);
		}, 500);
		$('#sponsor-img').on('load', () => {
			$('#sponsor-img').fadeIn(nodecg.bundleConfig.sponsor.fadeInTime);
		});
	});
}

function runImages() {
	let index = 1;
	updateSponsorImage(sponsorImgs.value[0].url)
	setInterval(() => {
		if (index === sponsorImgs.value.length)
			index = 0;
		updateSponsorImage(sponsorImgs.value[index].url)
		index++;
	}, nodecg.bundleConfig.sponsor.dwellTime)
}