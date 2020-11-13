import RegoScraper from '../../../RegoScraper/RegoScraper';

export default function rego(req, res) {
	const {
		query: {input}
	} = req;

    (async () => {
		try {
			var regoScraper = await RegoScraper.build();
    
			res.json({content: await regoScraper.ByRegoNumber(input)});
		}
		catch (err) {
			res.json({error: err.message});
		}
    })();
}