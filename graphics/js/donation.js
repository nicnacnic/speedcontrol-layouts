const donationTotal = nodecg.Replicant('donationTotal')
let countUp;

NodeCG.waitForReplicants(donationTotal).then(() => {

	donationTotal.on('change', (newVal, oldVal) => {
		handleCountUp(newVal)
	});
	
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