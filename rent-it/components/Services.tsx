
import {
	Badge, BadgeIcon, View,
	ScrollView,
	Text
} from '@gluestack-ui/themed';
import { useState } from 'react';

import { icons } from 'lucide-react-native';


interface ServicesPickerProps {
	services: string[];

}


export default function Services({ services }: ServicesPickerProps) {
	const allServices = ['Wi-Fi', 'Parking', 'Pool', 'Air Conditioning', 'Gym', 'Laundry', 'Kitchen']
	const servicesIcons = [
		icons["Wifi"],
		icons["SquareParking"],
		icons["Waves"],
		icons["AirVent"],
		icons["Dumbbell"],
		icons["WashingMachine"],
		icons["ChefHat"],
	]

	return (

		<ScrollView horizontal={true} alignSelf='center' margin={17}>
			{allServices.map((service: string, index) => (
				services.includes(service) &&
				<Badge
					margin={3}
					size="lg"
					variant="outline"
					borderRadius="$full"
					action="info"
				>
					<Text>{service}</Text>
					<BadgeIcon as={servicesIcons[index]} ml="$2" />
				</Badge>

			))}
		</ScrollView >

	)
}
