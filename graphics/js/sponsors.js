let index = 0;
let SPONSOR_IMGS;

$(() => {
	SPONSOR_IMGS = nodecg.Replicant('assets:sponsorContainer');
	
	NodeCG.waitForReplicants(SPONSOR_IMGS).then(() => runImages());

	$('#sponsor-img').on('load', () => {
		$('#sponsor-img').fadeIn(nodecg.bundleConfig.sponsor.fadeInTime);
	});

	function updateSponsorImage(imgSrc) {
		$('#sponsor-img').fadeOut(nodecg.bundleConfig.sponsor.fadeOutTime, () => {
			setTimeout(() => {
				$('#sponsor-img').attr('src', imgSrc);
			}, 500);
		});
	}
	
	function runImages() {
		let index = 1;
		updateSponsorImage(SPONSOR_IMGS.value[0].url)
		setInterval(() => {
			if (index === SPONSOR_IMGS.value.length)
				index = 0;
			updateSponsorImage(SPONSOR_IMGS.value[index].url)
			index++;
		}, nodecg.bundleConfig.sponsor.dwellTime)
	}
});