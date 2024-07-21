import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Center, Image, Heading, ButtonText } from '@gluestack-ui/themed';
import { router } from 'expo-router';


export default function AddProperty() {
	return <>
		<SafeAreaView style={{ flex: 1 }}>


			<Center flex={1}  >
				<Image size="2xl" alt='logo' source={require('../../assets/images/favicon.png')}></Image>
				<Heading color="$text900" $dark-color="$white" alignSelf="center" lineHeight="$md" marginTop="$5" >
					Adding property is not supported in web
				</Heading>

				<Button action="primary"  marginTop="$20" onPress={() => {
					if (router.canGoBack()) router.back()
				}}>
					<ButtonText>
						Go Back
					</ButtonText>
				</Button>

			</Center>
		</SafeAreaView>
	</>
}