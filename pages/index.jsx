import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { InlineShareButtons } from 'sharethis-reactjs'
import { useState, useEffect } from 'react'

export default function Home(props) {
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

	const [config, setConfig] = useState()

	useEffect(() => {
		if (blocks.length) {
			setConfig(
				blocks.map((element, index) => {
					const height = Math.random() * 250 + 180
					const width = Math.random() * 250 + 180
					const color = colors[Math.floor(Math.random() * colors.length)]

					return { width: width, height: height, color: color }
				})
			)
		}
	}, [blocks])

	return (
		<div className={styles.container}>
			<Head>
				<title>We Like The Stock!</title>
				<link rel="icon" href="/favicon.ico" />

				<meta name="description" content="Top 50 most shorted stocks" />
				{/* og */}
				<meta property="og:type" content="website" />
				<meta property="og:title" content="Stonks" />
				<meta property="og:description" content="Top 50 most shorted stocks" />
				<meta property="og:site_name" content="We Like The Stock!" />
				<meta
					property="og:image"
					content="https://welikethestock.live/facebookThumbnail.png"
				/>
				<meta property="og:image:width" content="1200" />
				<meta property="og:image:height" content="627" />
				{/* twitter */}
				<meta name="twitter:card" content="summary" />
				<meta name="twitter:title" content="We Like The Stock!" />
				<meta name="twitter:description" content="Top 50 most shorted stocks" />
				<meta name="twitter:creator" content="@IKreisz" />
				<meta
					property="twitter:image"
					content="https://welikethestock.live/twitterThumbnail.png"
				/>
				<meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
						Disclaimer: Not sure what that means or whether you should invest
					</h3>
				</div>
				<img className={styles.doge} src="doge.png" alt="" />
			</header>

			<InlineShareButtons
				config={{
					alignment: 'center', // alignment of buttons (left, center, right)
					color: 'social', // set the color of buttons (social, white)
					enabled: true, // show/hide buttons (true, false)
					font_size: 14, // font size for the buttons
					labels: 'cta', // button labels (cta, counts, null)
					language: 'en', // which language to use (see LANGUAGES)
					networks: ['facebook', 'messenger', 'twitter', 'email', 'sms'],
					padding: 12, // padding within buttons (INTEGER)
					radius: 20, // the corner radius on each button (INTEGER)
					show_total: false,
					size: 40, // the size of each button (INTEGER)

					// OPTIONAL PARAMETERS
					description: 'We Like The Stock! - List of most shorted stocks.', // (defaults to og:description or twitter:description)
					title: 'We Like The Stock! - List of most shorted stocks.', // (defaults to og:title or twitter:title)
					subject: 'We Like The Stock! - List of most shorted stocks.', // (only for email sharing)
					username: 'IKreisz', // (only for twitter sharing)
				}}
			/>

			<main className={styles.main}>
				<section className={styles.stonks}>
					{config
						? blocks.map((stock, index) => {
								return (
									<a
										style={{
											height: config[index].height,
											width: `min(${config[index].width}, 100%)`,
											backgroundColor: config[index].color,
										}}
										className={styles.stonk}
										href={stock.link}
										key={stock.ticker}
									>
										<h2 className={styles.stonkTitle}>
											{stock.company + ' (' + stock.ticker + ')'}
										</h2>
										<p className={styles.stonkShort}>{`${stock.shortInt}`}</p>
										<p
											className={styles.stonkExchange}
										>{`${stock.exchange}`}</p>
									</a>
								)
						  })
						: null}
				</section>
			</main>
			<footer>
				<div className={styles.linkContainer}>
					<a href="https://twitter.com/IKreisz" className={styles.socialLinkButton}>
						<p>Follow me on Twitter!</p>
						<img src="/twitter-blue.svg" alt="" />
					</a>
				</div>
			</footer>
		</div>
	)
}

export async function getServerSideProps(context) {
	const res = await fetch(
		process.env.NODE_ENV === 'development'
			? `http://localhost:3000/api/stonks`
			: 'https://welikethestock.vercel.app/api/stonks'
	)
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
