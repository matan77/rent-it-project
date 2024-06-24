import { Button, ButtonText } from '@gluestack-ui/themed';
import React from 'react';
import { BackHandler } from 'react-native';
import { Stack, router } from "expo-router";
import { Text, Center, Image } from "@gluestack-ui/themed";

export default function NotFoundScreen() {
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