import * as admin from 'firebase-admin';


import dotenv from 'dotenv';

dotenv.config();

if (process.env.FIREBASE) {


	// Initialize Firebase with the service account and storage bucket
	admin.initializeApp({
		credential: admin.credential.cert(JSON.parse(process.env.FIREBASE) as admin.ServiceAccount),
		storageBucket: 'rentit-4019b.appspot.com'
	});

}


const bucket = admin.storage().bucket();

export { bucket };