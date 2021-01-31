import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home(props) {
	// company: 'GameStop Corp.'
	// exchange: 'NYSE'
	// float: '51.03M'
	// industry: 'Retail (Technology)'
	// link: 'https://finance.yahoo.com/q?s=GME'
	// outstd: '69.75M'
	// shortInt: '121.07%'
	// ticker: 'GME'

	const colors = [
		'red',
		'yellow',
		'cyan',
		'gold',
		'deeppink',
		'orange',
		'brown',
		'green',
		'pink',
		'silver',
		'blue',
		'purple',
		'tomato',
	]

	const blocks = props.stocks

	return (
		<div className={styles.container}>
			<Head>
				<title>Stonks</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<header className={styles.header}>
				<h1>Top 50 stocks with the highest short interest.</h1>
				<h3>Not sure what that means or whether you should invest.</h3>
			</header>

			<main className={styles.main}>
				<section className={styles.stonks}>
					{blocks.map((stock) => {
						const height = Math.random() * 250 + 180
						const width = Math.random() * 250 + 180
						const color = colors[Math.floor(Math.random() * colors.length)]

						return (
							<a
								style={{ height: height, width: width, backgroundColor: color }}
								className={styles.stonk}
								href={stock.link}
								key={stock.ticker}
							>
								<h2 className={styles.stonkTitle}>
									{stock.company + ' (' + stock.ticker + ')'}
								</h2>
								<p className={styles.stonkShort}>{`${stock.shortInt}`}</p>
								<p className={styles.stonkExchange}>{`${stock.exchange}`}</p>
							</a>
						)
					})}
				</section>
			</main>
		</div>
	)
}

export async function getServerSideProps(context) {
	const res = await fetch(`http://localhost:3000/api/stonks`)
	const data = await res.json()

	if (!data) {
		return {
			notFound: true,
		}
	}

	return {
		props: data,
	}
}
