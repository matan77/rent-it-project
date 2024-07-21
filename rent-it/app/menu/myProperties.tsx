import React from 'react';
import { Heading, AddIcon, Fab, FabIcon } from "@gluestack-ui/themed";
import { router } from 'expo-router';
import PropertiesLst from '@/components/properties_lst/PropertiesLst';
import { SafeAreaView } from 'react-native-safe-area-context';



export default function myProperties() {


	return (
		<SafeAreaView style={{ flex: 1 }}>
			<Heading color="$text900" $dark-color="$white" alignSelf="center" lineHeight="$md" marginTop="$5" marginBottom="$3" >
				My Properties
			</Heading>
			<PropertiesLst isMy={true} filter="" />


			<Fab onPress={() => { router.push('/addProperty') }}
				placement='bottom right'
				elevation={5}
				p="$3.5"
				borderRadius="$full"
				size="lg"
			>
				<FabIcon as={AddIcon} size='xl' />
			</Fab>

		</SafeAreaView >
	);
};