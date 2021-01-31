// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default (req, res) => {
	const useMockData = true

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
		scraperapiClient
			.get('https://www.highshortinterest.com/')
			.then((html) => {
				const json = parse(html)
				res.status(200).json(json)
			})
			.catch((err) => {
				res.status(400)
			})
	}
}
