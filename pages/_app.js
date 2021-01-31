import '../styles/globals.css'
import firebase from 'firebase/app'
import 'firebase/analytics'
import { useEffect } from 'react'

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
	measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
}

if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig)
}

function MyApp({ Component, pageProps }) {
	useEffect(() => {
		firebase.analytics()
	}, [])

	return <Component {...pageProps} />
}

export default MyApp
