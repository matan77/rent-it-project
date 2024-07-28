
import { Icon, Button, Heading, Text, ArrowLeftIcon, VStack, HStack, ButtonIcon, ButtonText, ScrollView } from '@gluestack-ui/themed';
import { router, useLocalSearchParams } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '@/utils/api';
import { Property } from '@/types/property';
import Services from '@/components/Services';

import { MaterialIcons } from '@expo/vector-icons';
import { UserContext } from '@/utils/userContext';
import { Linking } from 'react-native';
import { Image } from '@gluestack-ui/themed';
import { Dimensions } from 'react-native';
import Booking from '@/components/Booking';



export default function PropertyScreen() {
	const userContext = useContext(UserContext);
	const { id } = useLocalSearchParams();
	const [property, setProperty] = useState<Property>();


	const width = Dimensions.get('window').width;
	const fetch = async () => {
		try {
			const res = await api.get(`/api/properties/${id}`);
			setProperty(res.data);


		} catch (error) {
			router.replace("/+not-found");
		}
	}
	const openMap = () => {
		if (property) {

			const url = `geo:${property.location.coordinates[0]},${property.location.coordinates[0]}`;
			Linking.openURL(url).catch(err => console.error("Failed to open map", err));
		}
	};


	const handleCall = () => {
		if (property?.owner.phoneNumber) {
			const url = `tel:${property.owner.phoneNumber}`;
			Linking.openURL(url).catch(err => console.error("Failed to make a call", err));
		}
	};

	const handleEmail = () => {
		if (property?.owner.email) {
			const url = `mailto:${property.owner.email}`;
			Linking.openURL(url).catch(err => console.error("Failed to send an email", err));
		}
	};


	useEffect(() => {
		fetch();

	}, []);
	const imageHorizontalMr = 16;
	console.log(property);

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<Button variant="link" p="$0" size="lg" position='absolute' left={10} top={35} onPress={router.back}  >
				<Icon size="xl" as={ArrowLeftIcon} />
			</Button>

			<Heading color="$text900" $dark-color="$white" alignSelf="center" lineHeight="$md" marginTop="$5" marginBottom="$3" >
				{property?.title}
			</Heading>
			<VStack>
				<ScrollView
					marginHorizontal={imageHorizontalMr}
					alignSelf='center'
					decelerationRate={0}
					snapToInterval={width - imageHorizontalMr * 2}


					horizontal={true}

					contentInset={{ top: 0, left: 0, bottom: 0, right: 0, }}

				>
					{property?.images ?
						property?.images.map((image, index) => (
							<Image
								borderRadius={7}

								h={240}
								w={width - imageHorizontalMr * 2}
								key={index}
								alt={`image ${index}`}
								source={image}

								resizeMode='cover'
							/>
						))
						:
						<Image
							h={240}
							w={width - imageHorizontalMr * 2}
							borderRadius={7}
							alt="default image"
							resizeMode='cover'
							source={require('@/assets/images/Placeholder.png')}

						/>
					}
				</ScrollView>


				<Heading marginTop={13} marginStart={8} color="$text900" $dark-color="$white" alignSelf="flex-start" lineHeight="$md"  >
					Description
				</Heading>

				<Text marginStart={8} alignSelf="flex-start"  >{property?.description}</Text>

				<Services services={property ? property.services : []}></Services>

				<HStack alignSelf='center'>
					<Button marginEnd={14} variant='solid' onPress={openMap} size='lg' >
						<ButtonText>{"View Location"}</ButtonText>
						<ButtonIcon as={() => <MaterialIcons color="red" name="location-on" size={35} />} />
					</Button>
					<VStack >

						<Text alignSelf='flex-end' size="md" color='green'>{`${property?.pricePerNight} $`} </Text>
						<Text alignSelf='flex-end' size="xs" > per night</Text>
					</VStack>
				</HStack>

				<HStack m="$1" marginHorizontal={20} space='lg' alignSelf='flex-start' >
					<Button variant='link' onPress={handleCall} size='lg'>

						<ButtonIcon as={() => <MaterialIcons color="#0077E6" name="phone" size={24} />} />
					</Button>

					<Button variant='link' onPress={handleEmail} size='lg'>
						<ButtonIcon as={() => <MaterialIcons color="#0077E6" name="email" size={24} />} />
					</Button>

				</HStack>

				<Booking isDisabled={userContext?.user?._id !== property?.owner._id}></Booking>

			</VStack>
		</SafeAreaView>
	);
}

