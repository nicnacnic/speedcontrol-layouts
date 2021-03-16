'use strict';

let index = 0;

$(() => {
	let SPONSOR_IMGS = [];
	for (let i = 0; i < nodecg.bundleConfig.sponsor.sponsorImages.length; i++)
	{
		SPONSOR_IMGS.push(nodecg.bundleConfig.sponsor.sponsorImages[i]);
	}
	runImages();

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

	function incrementIndex() {
		if (index < SPONSOR_IMGS.length - 1) {
			index += 1;
		} else {
			index = 0;
		}
	}

	function runImages() {
		updateSponsorImage(SPONSOR_IMGS[index]);

		setInterval(() => {
			incrementIndex();
			updateSponsorImage(SPONSOR_IMGS[index]);
		}, nodecg.bundleConfig.sponsor.dwellTime);
	}
});