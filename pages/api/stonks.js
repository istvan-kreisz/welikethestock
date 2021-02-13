export default (req, res) => {
	const useMockData = false

	const { promisify } = require('util')

	var scraperapiClient = require('scraperapi-sdk')('1a00545940603ce151c91f38257ae468')
	var JSSoup = require('jssoup').default

	const parse = (html) => {
		const stocks = []

		const strippedHTML = html.trim().replace(/(\r\n|\n|\r)/gm, '')
		const table = new JSSoup(strippedHTML)
		const rows = table.findAll('tr')

		rows.forEach((row, index) => {
			if (
				row.contents &&
				row.contents.length &&
				row.contents[0].contents &&
				row.contents[0].contents.length &&
				row.contents[0].contents[0] &&
				row.contents[0].contents[0].attrs &&
				row.contents[0].contents[0].attrs.href &&
				row.contents[0].contents[0].attrs.href.includes('finance.yahoo.com') &&
				row.contents[1] &&
				row.contents[1].text &&
				row.contents[2] &&
				row.contents[2].text &&
				row.contents[3] &&
				row.contents[3].text &&
				row.contents[4] &&
				row.contents[4].text &&
				row.contents[5] &&
				row.contents[5].text
			) {
				stocks.push({
					ticker: row.contents[0].contents[0].text,
					link: row.contents[0].contents[0].attrs.href,
					company: row.contents[1].text,
					exchange: row.contents[2].text,
					shortInt: row.contents[3].text,
					float: row.contents[4].text,
					outstd: row.contents[5].text,
					industry: row.contents[6].text,
				})
			}
		})

		return {
			stocks: stocks,
		}
	}

	if (process.env.NODE_ENV === 'development' && useMockData) {
		const fs = require('fs')
		const html = fs.readFileSync('./public/page.html', 'utf8')
		const json = parse(html)
		res.status(200).json(json)
	} else {
		return new Promise((resolve, reject) => {
			const redis = require('redis')
			var client = redis.createClient({
				host: 'us1-pet-narwhal-31820.lambda.store',
				port: '31820',
				password: '11e636e00bf240d88eaccb40b6dcd2f4',
				tls: {},
			})
			const get = promisify(client.get).bind(client)
			const set = promisify(client.set).bind(client)

			const useScraper = () => {
				scraperapiClient
					.get('https://www.highshortinterest.com/')
					.then((html) => {
						const json = parse(html)

						set('updated', `${new Date().getTime()}`)
							.then((result) => {
								set('stocks', JSON.stringify(json))
									.then((result) => {
										client.quit()
										res.status(200).json(json)
										return resolve()
									})
									.catch((err) => {
										client.quit()
										res.status(200).json(json)
										return resolve()
									})
							})
							.catch((err) => {
								client.quit()
								res.status(200).json(json)
								return resolve()
							})
					})
					.catch((err) => {
						get('stocks')
							.then((result) => {
								const stocks = JSON.parse(result)
								if (stocks) {
									client.quit()
									res.status(200).json(stocks)
									return resolve()
								} else {
									client.quit()
									res.sendStatus(500)
									return resolve()
								}
							})
							.catch((err) => {
								console.log(err)
								client.quit()
								res.sendStatus(500)
								return resolve()
							})
					})
			}

			client.on('error', function (err) {
				console.log('shiiiiiit')
				useScraper()
			})

			get('updated')
				.then((result) => {
					const time = parseFloat(result)
					if (time && time > new Date().getTime() - 1800 * 1000) {
						get('stocks')
							.then((result) => {
								const stocks = JSON.parse(result)
								if (stocks) {
									client.quit()
									res.status(200).json(stocks)
									return resolve()
								} else {
									useScraper()
								}
							})
							.catch((err) => {
								console.log(err)
								useScraper()
							})
					} else {
						useScraper()
					}
				})
				.catch((err) => {
					console.log(err)
					useScraper()
				})
		})
	}
}
