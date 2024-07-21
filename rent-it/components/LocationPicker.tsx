import React, { forwardRef, Dispatch, useEffect, useState, useRef } from 'react';
import {
	BottomSheetModal,
	BottomSheetView,
	BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import {
	InputSlot, Input, View, Button,
	ButtonText, InputIcon, SearchIcon, InputField, Pressable, VStack
} from '@gluestack-ui/themed';
import { useColorScheme, Alert } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { darkModeMap } from '@/utils/mapStyle';

const LocationPicker = forwardRef<BottomSheetModal,
	{
		location: Location.LocationObjectCoords | null,
		setLocation: Dispatch<React.SetStateAction<Location.LocationObjectCoords | null>>,
		closeLocationModal: () => void,
		isLocationOpen: Boolean,
		setIsLocationOpen: Dispatch<React.SetStateAction<Boolean>>
	}>((
		{ location, setLocation, isLocationOpen, setIsLocationOpen, closeLocationModal }, ref) => {

		const snapPoints = ['80%', '80%'];
		const [searchText, setSearchText] = useState('');
		const mapRef = useRef<MapView | null>(null);




		const handleSheetChanges = (index: number) => {
			setIsLocationOpen(index !== -1);
		};

		const getDeviceLocation = async () => {
			let res = await Location.getCurrentPositionAsync({});
			setLocation(res.coords);
			if (location) {
				mapRef.current?.animateToRegion({
					latitude: res.coords.latitude,
					longitude: res.coords.longitude,
					latitudeDelta: 0.001,
					longitudeDelta: 0.001,
				});
			}
		}
		const getPermission = async () => {
			let { granted } = await Location.requestForegroundPermissionsAsync();
			if (!granted) {
				Alert.alert('Permission', 'Permission to access location was denied');
				closeLocationModal();

				return;
			}
			getDeviceLocation();
		};

		useEffect(() => {

			if (isLocationOpen)
				getPermission();

		}, [isLocationOpen]);




		const handleSearch = async () => {
			try {
				let result = await Location.geocodeAsync(searchText);
				if (result.length > 0) {
					mapRef.current?.animateToRegion({
						latitude: result[0].latitude,
						longitude: result[0].longitude,
						latitudeDelta: 0.001,
						longitudeDelta: 0.001,
					});

					setLocation({
						latitude: result[0].latitude,
						longitude: result[0].longitude,
						altitude: null,
						accuracy: null,
						speed: null,
						heading: null,
						altitudeAccuracy: null
					});

				} else {
					Alert.alert('Location not found', 'Please try again with a different search term');
				}
			} catch (error) {
				console.error(error);
				Alert.alert('Error', 'An error occurred while searching for the location');
			}
		};


		const colorScheme = useColorScheme();

		return (
			<BottomSheetModalProvider>
				<BottomSheetModal
					handleIndicatorStyle={{ backgroundColor: colorScheme === "dark" ? "white" : "black" }}
					ref={ref}
					enableContentPanningGesture={false}
					containerStyle={{
						backgroundColor: "#00000070", marginTop: -40
					}}
					backgroundStyle={{ backgroundColor: colorScheme === "dark" ? "#262626" : "white" }}
					index={1}
					snapPoints={snapPoints}
					onChange={handleSheetChanges}
				>
					<BottomSheetView>
						<VStack paddingBottom={'$10'}>
							<View marginHorizontal="$5">
								<Input size='lg' mb="$3">
									<InputSlot paddingStart="$3" onPress={handleSearch}>
										<InputIcon as={SearchIcon} />
									</InputSlot>
									<InputField onSubmitEditing={handleSearch} placeholder="Search location..." onChangeText={(text: string) => setSearchText(text)} />
									<InputSlot paddingEnd="$2" >
										<InputIcon as={() => (<Pressable
											padding="$2"
											onPress={getDeviceLocation}
											borderRadius={40}
											$active-bg="#00000040"

										>
											<MaterialIcons name="gps-fixed" size={24} color="#0077E6" />
										</Pressable>)} />
									</InputSlot>
								</Input>
							</View>

							{location && (

								<MapView
									provider={PROVIDER_GOOGLE}
									customMapStyle={colorScheme === "dark" ? darkModeMap : []}
									ref={mapRef}
									style={{
										margin: 5,
										width: '100%',
										height: '81%',
									}}
									initialRegion={{
										latitude: location.latitude,
										longitude: location.longitude,
										latitudeDelta: 0.001,
										longitudeDelta: 0.001,
									}}

								>
									{location && (
										<Marker
											coordinate={{
												latitude: location.latitude,
												longitude: location.longitude,
											}}

										/>
									)}
								</MapView>
							)}


							<Button alignSelf='center' marginVertical="$5" onPress={closeLocationModal} >
								<ButtonText>Apply</ButtonText>
							</Button>

						</VStack>
					</BottomSheetView>
				</BottomSheetModal>
			</BottomSheetModalProvider >
		);
	});



export default LocationPicker;
