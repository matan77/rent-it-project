import { Button, ButtonText } from '@gluestack-ui/themed';
import React, { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { Stack } from "expo-router";
import { Text, Center, Image } from "@gluestack-ui/themed";

import { UserContext } from '../utils/userContext'
import { useContext } from 'react';
import { AppState } from 'react-native';

export default function serviceDown() {

	const userContext = useContext(UserContext);
	useEffect(() => {
		const subscription = AppState.addEventListener('change', nextAppState => {
			if (nextAppState === "active") {
				userContext?.setTrigger(!userContext?.trigger);
			}

		});

		return () => {
			subscription.remove();
		};
	}, []);


	return <>
		<Stack.Screen options={{
			title: "Oops!"
		}} />
		<Center flex={1}  >
			<Image size="2xl" alt='logo' source={require('../assets/images/favicon.png')}></Image>
			<Text color="$textDark500">We're temporarily down</Text>

			<Button action={"primary"} marginTop="$20" onPress={() => {
				BackHandler.exitApp();
			}}>
				<ButtonText>
					Come back later
				</ButtonText>
			</Button>

		</Center>
	</>;
}