
import {
	Badge, BadgeIcon, GlobeIcon, View,

	Checkbox,
	CheckboxGroup, Heading,
	ScrollView,
	Text
} from '@gluestack-ui/themed';
import { useState } from 'react';

import { icons } from 'lucide-react-native';


interface ServicesPickerProps {
	services: string[];
	setServices: React.Dispatch<React.SetStateAction<string[]>>;
}


export default function ServicesPicker({ services, setServices }: ServicesPickerProps) {
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
		<View >
			<Heading color="$text900" $dark-color="$white" alignSelf="center" lineHeight="$md" marginBottom="$5" >
				select services
			</Heading>
			<CheckboxGroup
				value={services}
				onChange={(keys) => {
					setServices(keys)
				}}
			>

				<ScrollView horizontal={true}  >
					<View flexWrap='wrap' flexDirection='row' width={550} paddingHorizontal={5} >
						{allServices.map((service: string, index) => (
							<Checkbox key={index} value={service} aria-label={service} margin={3}>
								<Badge
									size="lg"
									variant="outline"
									borderRadius="$full"
									action={services.includes(service) ? "success" : "muted"}
								>
									<Text>{service}</Text>
									<BadgeIcon as={servicesIcons[index]} ml="$2" />
								</Badge>
							</Checkbox>
						))}

					</View>
				</ScrollView>

			</CheckboxGroup>
		</View >
	)
}
