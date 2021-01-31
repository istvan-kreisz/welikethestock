import Head from 'next/head'
import styles from '../styles/Home.module.css'
import 'firebase/functions'

export default function Home({ functions, ...props }) {
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

	if (process.env.NODE_ENV === 'development') {
		functions.useEmulator('http://localhost', '5001')
	}
	const getStonks = functions?.httpsCallable('getStonks')

	getStonks()
		.then((result) => {
			console.log('-----')
			console.log(data)
		})
		.catch((err) => {
			console.log(err)
		})

	const blocks = props.stocks

	return (
		<div className={styles.container}>
			<Head>
				<title>Stonks</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<h1 className={styles.title} style={{ fontFamily: 'the_king_of_wallregular' }}>
				We Like The Stock!
			</h1>

			<header className={styles.header}>
				<img className={styles.memeMan} src="stonks.png" alt="" />
				<div className={styles.headerText}>
					<h1 className={styles.headerTitle}>
						Top 50 stocks with the highest short interest
					</h1>
					<h3 className={styles.headerSubtitle}>
						PS: Not sure what that means or whether you should invest
					</h3>
				</div>
				<img className={styles.doge} src="doge.png" alt="" />
			</header>

			<main className={styles.main}>
				<section className={styles.stonks}>
					{blocks.map((stock) => {
						const height = Math.random() * 250 + 180
						const width = Math.random() * 250 + 180
						const color = colors[Math.floor(Math.random() * colors.length)]

						return (
							<a
								style={{
									height: height,
									width: `min(${width}, 100%)`,
									backgroundColor: color,
								}}
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
	if (process.env.NODE_ENV === 'development') {
		functions.useEmulator('http://localhost', '5001')
	}
	const getStonks = functions?.httpsCallable('getStonks')

	const data = await getStonks()
	console.log(data)

	if (!data) {
		return {
			notFound: true,
		}
	}

	return {
		props: data,
	}
}
