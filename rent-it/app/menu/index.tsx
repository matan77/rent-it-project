import { Text, View } from '@gluestack-ui/themed';
import { Redirect, router } from 'expo-router';
import { useEffect } from 'react';




export default function Home() {
	// for dev del
	useEffect(() => {
		router.push('/menu/myProperties')
	}, [])

	return (
		<View >

			<Text> Home</Text>
		</View >
	);
}

