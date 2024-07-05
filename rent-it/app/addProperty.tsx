import {
	Button, Icon, ArrowLeftIcon, Heading, ButtonText, ButtonIcon,
	View, FormControl, Input, InputField, FormControlError, FormControlErrorIcon, FormControlErrorText, AlertCircleIcon,
	VStack, Textarea, TextareaInput
} from '@gluestack-ui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import LocationPicker from '@/components/LocationPicker';
import ServicesPicker from '@/components/ServicesPicker';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Location from 'expo-location';

import api from "@/utils/api";
import { findErrorByPath } from "@/utils/error";






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

	const [errors, setErrors] = useState({ errors: [] });

	const [form, setForm] = useState({
		title: "",
		description: "",
		pricePerNight: 0
	});

	const titleError = findErrorByPath(errors.errors, "title");
	const descriptionError = findErrorByPath(errors.errors, "description");
	const priceError = findErrorByPath(errors.errors, "pricePerNight");



	return (

		<SafeAreaView style={{ flex: 1 }}>

			<GestureHandlerRootView style={{ flex: 1 }}>
				<View pointerEvents={isLocationOpen ? 'none' : 'auto'} >

					<Button variant="link" p="$0" size="lg" position='absolute' left={10} top={10} onPress={router.back}  >
						<Icon size="xl" as={ArrowLeftIcon} />
					</Button>

					<Heading color="$text900" $dark-color="$white" alignSelf="center" lineHeight="$md" marginTop="$5" >
						Add new property
					</Heading>
					<VStack space='lg' marginHorizontal="$5" marginTop="$4">




						<FormControl isInvalid={titleError !== undefined}>
							<Input size="lg">
								<InputField onChangeText={(title: string) => setForm({ ...form, title })}
									type="text" placeholder="Title" value={form.title} />
							</Input>
							<FormControlError>

								<FormControlErrorIcon as={AlertCircleIcon} />
								<FormControlErrorText >
									{titleError?.msg}
								</FormControlErrorText>
							</FormControlError>
						</FormControl>

						<FormControl isInvalid={descriptionError !== undefined}>

							<Textarea height="$48" size="md" isInvalid={descriptionError !== undefined}  >
								<TextareaInput numberOfLines={7}
									multiline={true}
									placeholder="Description ..."
								/>
							</Textarea>
							<FormControlError>

								<FormControlErrorIcon as={AlertCircleIcon} />
								<FormControlErrorText >
									{descriptionError?.msg}
								</FormControlErrorText>
							</FormControlError>
						</FormControl>

						<FormControl isInvalid={priceError !== undefined}>
							<Input size="lg">
								<InputField onChangeText={(text: string) => setForm({ ...form, pricePerNight: text === "" ? 0 : parseInt(text, 10) })}
									keyboardType='decimal-pad'
									type="text" placeholder="Price Per Night" value={form.pricePerNight.toString()} />
							</Input>
							<FormControlError>

								<FormControlErrorIcon as={AlertCircleIcon} />
								<FormControlErrorText >
									{priceError?.msg}
								</FormControlErrorText>
							</FormControlError>
						</FormControl>

						<Button variant='outline' onPress={showLocationModal} size='lg' >
							<ButtonText>{location ? "location picked" : "Pick location"}</ButtonText>
							<ButtonIcon as={() => <MaterialIcons color={location ? "#4ade80" : "red"} name="location-on" size={35} />} />
						</Button>
						
						<ServicesPicker />


						<Button size="lg" variant="solid" mt="$10" action="positive"  >

							<ButtonText>Add </ButtonText>
						</Button>
					</VStack>







				</View>

















				<LocationPicker
					closeLocationModal={closeLocationModal}
					location={location} setLocation={setLocation}
					isLocationOpen={isLocationOpen} setIsLocationOpen={setIsLocationOpen} ref={locationPickerRef} />

			</GestureHandlerRootView>


		</SafeAreaView >
	);
}