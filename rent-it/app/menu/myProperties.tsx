import React from 'react';
import { StyleSheet, Text, FlatList, TouchableOpacity, ListRenderItem } from 'react-native';
import { View, Button, ButtonIcon, AddIcon, Fab, FabIcon } from "@gluestack-ui/themed";
import { router } from 'expo-router';

interface Item {
	id: string;
	title: string;
}
export default function myProperties() {
	const data = Array.from({ length: 20 }, (_, index) => ({ id: index.toString(), title: `Item ${index + 1}` }));

	const renderItem: ListRenderItem<Item> = ({ item }) => (
		<View padding={20} marginVertical={20} bgColor='$primary300' >
			<Text>{item.title}</Text>
		</View>
	);

	return (
		<View flex={1}>
			<FlatList
				data={data}
				renderItem={renderItem}
				keyExtractor={item => item.id}
				contentContainerStyle={{ paddingHorizontal: 10, }}
			/>
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

const styles = StyleSheet.create({
	item: {
		padding: 20,
		marginVertical: 10,
		backgroundColor: '#f9c2ff',
		borderRadius: 10,
	},
	addButton: {
		position: 'absolute',
		right: 20,
		bottom: 20,
		backgroundColor: '#6200ee',
		borderRadius: 30,
		width: 60,
		height: 60,
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.8,
		shadowRadius: 2,
		elevation: 5,
	},
	addButtonText: {
		color: '#fff',
		fontSize: 20,
	},
});
