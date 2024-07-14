import React from 'react';
import { View, Button, ButtonIcon, AddIcon, Fab, FabIcon } from "@gluestack-ui/themed";
import { router } from 'expo-router';
import PropertiesLst from '@/components/properties_lst/PropertiesLst';



export default function myProperties() {


	return (	
		<View flex={1}>

			<PropertiesLst/>

			
			<Fab onPress={() => { router.push('/addProperty') }}
				placement='bottom right'
				elevation={5}
				p="$3.5"
				borderRadius="$full"
				size="lg"
			>
				<FabIcon as={AddIcon} size='xl' />
			</Fab>

		</View >
	);
};