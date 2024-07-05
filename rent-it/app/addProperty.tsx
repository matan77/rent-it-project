import {
	Button, Icon, ArrowLeftIcon, Heading, ButtonText, ButtonIcon,
	View
} from '@gluestack-ui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import LocationPicker from '@/components/LocationPicker';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Location from 'expo-location';


export default function AddProperty() {

	const [isLocationOpen, setIsLocationOpen] = useState<Boolean>(false);
	const locationPickerRef = useRef<BottomSheetModal>(null);
	const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);

	const showLocationModal = () => {
		locationPickerRef.current?.present();
	};
	const closeLocationModal = () => {
		locationPickerRef.current?.dismiss();
	};
	return (

		<SafeAreaView style={{ flex: 1 }}>

			<GestureHandlerRootView style={{ flex: 1 }}>
				<View pointerEvents={isLocationOpen ? 'none' : 'auto'}>

					<Button variant="link" p="$0" size="lg" position='absolute' left={10} top={10} onPress={router.back}  >
						<Icon size="xl" as={ArrowLeftIcon} />
					</Button>

					<Heading color="$text900" $dark-color="$white" alignSelf="center" lineHeight="$md" marginTop="$5" >
						Add new property
					</Heading>


					<Button onPress={showLocationModal} alignSelf='center' size='lg' >
						<ButtonText>Enter location</ButtonText>
						<ButtonIcon as={() => <MaterialIcons color="red" name="location-on" size={24} />} />
					</Button>

				</View>
				<LocationPicker
					closeLocationModal={closeLocationModal}
					location={location} setLocation={setLocation}
					isLocationOpen={isLocationOpen} setIsLocationOpen={setIsLocationOpen} ref={locationPickerRef} />





			</GestureHandlerRootView>


		</SafeAreaView >
	);
}