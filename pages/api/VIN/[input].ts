import RegoScraper from '../../../RegoScraper';

export default function VIN(req, res) {
	const {
		query: {input}
	} = req;


    (async () => {
		try {
			var regoScraper = await RegoScraper.build();
    
			res.json({content: await regoScraper.ByVIN(input)});
		}
		catch (err) {
			res.json({error: err.message});
		}
    })();
}