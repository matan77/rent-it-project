import { Booking } from '@/types/booking';

import {
	View, Text, Button, ButtonText, Card, Heading,
	ButtonIcon, CalendarDaysIcon, HStack, VStack, Icon
} from '@gluestack-ui/themed';
import { Linking } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function PropertyItem({ data, isMy }: { data: Booking, isMy: boolean }) {
	const viewProperty = () => {
		router.push(`/properties/${data.property._id}`)
	}

	const formatDate = (date: string): string => {
		return new Date(date).toLocaleDateString('en-GB',
			{ day: 'numeric', month: 'short', year: 'numeric' });
	}



	const handleCall = () => {

		const url = `tel:${data.user.phoneNumber}`;
		Linking.openURL(url).catch(err => console.error("Failed to make a call", err));
	}


	const handleEmail = () => {

		const url = `mailto:${data.user.email}`;
		Linking.openURL(url).catch(err => console.error("Failed to send an email", err));
	};


	return <>

		<Card flex={1} borderRadius="$lg" variant='outline' size='lg' alignSelf='center' m="$3">
			<Heading mb="$1" alignSelf='center' size="md">{data.property.title}</Heading>
			<VStack marginVertical={20}>
				<HStack>
					<Icon as={CalendarDaysIcon} marginHorizontal="$1" w="$6" h="$6" />
					<Text marginStart={3} size="md">{formatDate(data.checkIn)}</Text>
					<Text marginStart={3} size="md">{"  -  "}</Text>
					<Text marginHorizontal={3} size="md">{formatDate(data.checkOut)}</Text>
				</HStack>

			</VStack>

			<View flex={1} flexDirection='row' justifyContent='space-between' mb="$2">

				{isMy ?
					<Button onPress={viewProperty} size="md" variant="solid" action="positive" alignSelf='flex-start' >
						<ButtonText>Book Again</ButtonText>
					</Button>
					:
					<VStack>
						<HStack space='lg'>
							<Text marginStart={3} size="lg">contact client:</Text>
							<Button variant='link' onPress={handleCall} size='lg'>
								<ButtonIcon as={() => <MaterialIcons color="#0077E6" name="phone" size={24} />} />
							</Button>

							<Button variant='link' onPress={handleEmail} size='lg'>
								<ButtonIcon as={() => <MaterialIcons color="#0077E6" name="email" size={24} />} />
							</Button>

						</HStack>
						<Button onPress={viewProperty} size="md" variant="solid" action="primary" alignSelf='flex-start' >
							<ButtonText>View Property</ButtonText>
						</Button>
					</VStack>
				}


				<VStack alignSelf='flex-end'>
					<Text alignSelf='flex-end' size="md" color='green' marginEnd={20}>{`${data.totalPrice} $`} </Text>
				</VStack>
			</View>


		</Card>


	</>;
}
