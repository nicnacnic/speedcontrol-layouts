const data = nodecg.Replicant('data');

let countUp;

NodeCG.waitForReplicants(data).then(() => {

	data.on('change', (newVal) => handleCountUp(newVal.event.total));

	function handleCountUp(amount) {
		if (!countUp) {
			countUp = new CountUp('donationTotal', amount, amount, 0, 0.75, {
				prefix: '$'
			});
			countUp.start();
		} else countUp.update(amount);
	}
});