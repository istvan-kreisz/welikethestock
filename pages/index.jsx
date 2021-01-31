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

	return (
		<div className={styles.container}>
			<Head>
				<title>Stonks</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className={styles.main}>
				{props.stocks.map((stock) => {
					return <h1 key={stock.ticker}>{stock.company}</h1>
				})}
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
