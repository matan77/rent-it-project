import React, { useEffect } from 'react';

import * as ImagePkr from 'expo-image-picker';
import { View, ScrollView, Text, Button, Image, ButtonText, ButtonIcon } from '@gluestack-ui/themed';

import { icons } from 'lucide-react-native';

interface ImagePickerProps {
	images: ImagePkr.ImagePickerAsset[];
	setImages: React.Dispatch<React.SetStateAction<ImagePkr.ImagePickerAsset[]>>;
}

export default function ImagePicker({ images, setImages }: ImagePickerProps) {

	useEffect(() => {
		(async () => {
			const { status } = await ImagePkr.requestMediaLibraryPermissionsAsync();
			if (status !== 'granted') {
				alert('Sorry, we need camera roll permissions to make this work!');
			}

		})();
	}, []);

	const pickImages = async () => {
		setImages([]);
		try {

			let result = await ImagePkr.launchImageLibraryAsync({
				mediaTypes: ImagePkr.MediaTypeOptions.Images,
				quality: 1,
				selectionLimit: 5,
				allowsMultipleSelection: true, // Allow picking multiple images
			});
			await handleImagePick(result);
		}
		catch (error) {
			console.log(error);
		}
	};


	const handleImagePick = async (result: ImagePkr.ImagePickerResult) => {
		if (!result.canceled) {

			setImages(result.assets);

		}
	};


	return (
		<View >
			<ScrollView horizontal>
				{images.map((image, index) => (
					<Image key={index} alt={`image ${index}`} source={image} style={{ width: 200, height: 200, margin: 10 }} />

				))}
			</ScrollView>
			{images.length === 0 && <Text alignSelf='center'>No images uploaded</Text>}
			<Button size='lg' variant='outline' onPress={pickImages} >
				<ButtonText>
					Pick images
				</ButtonText>
				<ButtonIcon marginStart={3} size='xl' as={icons['Images']} />
			</Button>
		</View>
	);
}