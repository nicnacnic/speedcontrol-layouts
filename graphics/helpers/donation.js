const data = nodecg.Replicant('data');

let countUp;

NodeCG.waitForReplicants(data).then(() => {

	data.on('change', (newVal) => handleCountUp(newVal.event.total, newVal.event.currency));

	function handleCountUp(amount, currency) {
		if (!countUp) {
			countUp = new CountUp('donationTotal', amount, amount, 0, 0.75, {
				prefix: currency,
			});
			countUp.start();
		} else countUp.update(amount);
	}
});
