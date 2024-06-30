import { Text, Fab, Button, Icon, FabIcon, ArrowLeftIcon } from '@gluestack-ui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';


export default function AddProperty() {
	return (
		<SafeAreaView>
			<Button variant="link" p="$0" size="lg" position='absolute' left={20} top={20} onPress={router.back}  >

				<Icon size="xl" as={ArrowLeftIcon} />
			</Button>
			{/* <Fab onPress={() => { router.back() }}
				placement='top left'
				elevation={5}
				bg='#ffffff'
				size="lg"
			>
				<FabIcon as={ArrowLeftIcon} size='xl' />
			</Fab> */}
			<Text alignSelf='center'>MyBookings</Text>
		</SafeAreaView>
	);
}