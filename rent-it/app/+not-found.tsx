import { Button, ButtonText } from '@gluestack-ui/themed';

import { router } from "expo-router";
import { Text, Center, Image } from "@gluestack-ui/themed";


export default function NotFoundScreen() {

	return <>

		<Center flex={1}  >
			<Image size="2xl" alt='logo' source={require('../assets/images/favicon.png')}></Image>
			<Text color="$textDark500">This screen doesn't exist</Text>

			<Button action={"primary"} marginTop="$20" onPress={() => {
				if (router.canGoBack()) router.back()
				else router.replace("/login")

			}}>
				<ButtonText>
					Go Back
				</ButtonText>
			</Button>

		</Center>
	</>;
}