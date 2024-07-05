import {
	Button, Icon, ArrowLeftIcon, Heading, ButtonText, ButtonIcon,
	View, FormControl, Input, InputField, FormControlError, FormControlErrorIcon, FormControlErrorText, AlertCircleIcon,
	VStack, Textarea, TextareaInput, Toast, useToast, ToastTitle,
	ScrollView,
	ButtonSpinner
} from '@gluestack-ui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import LocationPicker from '@/components/LocationPicker';
import ServicesPicker from '@/components/ServicesPicker';
import ImagePicker from '@/components/ImagePicker';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Location from 'expo-location';

import api from "@/utils/api";
import { findErrorByPath } from "@/utils/error";

import * as ImagePkr from 'expo-image-picker';
import axios from 'axios';





export default function AddProperty() {

	const [isLocationOpen, setIsLocationOpen] = useState<Boolean>(false);
	const locationPickerRef = useRef<BottomSheetModal>(null);
	const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);

	const [images, setImages] = useState<ImagePkr.ImagePickerAsset[]>([]);

	const [services, setServices] = useState<string[]>([])

	const showLocationModal = () => {
		locationPickerRef.current?.present();
	};
	const closeLocationModal = () => {
		locationPickerRef.current?.dismiss();
	};

	const toast = useToast()

	const [errors, setErrors] = useState({ errors: [] });
	const [isAdding, setIsAdding] = useState(false);

	const [form, setForm] = useState({
		title: "",
		description: "",
		pricePerNight: 0
	});

	const titleError = findErrorByPath(errors.errors, "title");
	const descriptionError = findErrorByPath(errors.errors, "description");
	const priceError = findErrorByPath(errors.errors, "pricePerNight");

	const handleAdd = async () => {
		setIsAdding(true);
		setErrors({ errors: [] });
		let msg = null;
		try {
			const formData = new FormData();

			formData.append('title', form.title);
			formData.append('description', form.description);
			formData.append('pricePerNight', form.pricePerNight.toString());
			if (location) {
				formData.append('coordinates', JSON.stringify([location.longitude, location.latitude]));
			}
			formData.append('services', JSON.stringify(services));

			// Append images to FormData
			images.forEach((image, index) => {
				formData.append('images', {
					uri: image.uri,
					type: 'image/jpeg',
					name: `image_${index}.jpg`
				} as any);
			});


			const response = await api.post('/api/properties', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});


			router.replace('/menu/myProperties');
		} catch (error) {


			if (axios.isAxiosError(error)) {

				if (error.response?.status === 400) {

					setErrors(error.response?.data);

					const location = findErrorByPath(errors.errors, "coordinates");


					if (location) {
						msg = location.msg;
					}
				}
				else {
					msg = error?.response?.data?.msg
				}
			}

		}
		if (msg) {
			toast.show({
				placement: "bottom",
				render: ({ id }) => {
					const toastId = "toast-" + id

					return (
						<Toast marginBottom="$16" nativeID={toastId} action="error" variant="accent">
							<ToastTitle>
								{msg}
							</ToastTitle>
						</Toast>
					)
				},
			});
		}
		setIsAdding(false);
	};


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
					<ScrollView>
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

							<ImagePicker images={images} setImages={setImages} />

							<FormControl isInvalid={descriptionError !== undefined}>

								<Textarea height="$24" size="md" isInvalid={descriptionError !== undefined}  >
									<TextareaInput
										onChangeText={(description: string) => setForm({ ...form, description })}
										placeholder="Description ..."
									/>
								</Textarea>
								<FormControlError>

									<FormControlErrorIcon as={AlertCircleIcon} />
									<FormControlErrorText>
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

							<ServicesPicker services={services} setServices={setServices} />



							<Button size="lg" isDisabled={isAdding} variant="solid" action="positive" onPress={handleAdd}>
								{isAdding && <ButtonSpinner />}
								<ButtonText>Add</ButtonText>
							</Button>
						</VStack>

					</ScrollView>
				</View>

















				<LocationPicker
					closeLocationModal={closeLocationModal}
					location={location} setLocation={setLocation}
					isLocationOpen={isLocationOpen} setIsLocationOpen={setIsLocationOpen} ref={locationPickerRef} />

			</GestureHandlerRootView>


		</SafeAreaView >
	);
}