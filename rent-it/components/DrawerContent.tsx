import { Divider, Image, Heading, View, HStack } from "@gluestack-ui/themed"
import {
	DrawerContentComponentProps,
	DrawerContentScrollView,
	DrawerItem,
	DrawerItemList,
} from '@react-navigation/drawer';

import Entypo from '@expo/vector-icons/Entypo';

import { JSXElementConstructor, useContext } from 'react';
import { UserContext } from '@/utils/userContext';
import * as SecureStore from 'expo-secure-store';
import api from "@/utils/api";
import { router } from "expo-router";
import { Platform } from "react-native";
import React from "react";

export default function DrawerContent({ state, navigation, descriptors }: DrawerContentComponentProps) {
	const userContext = useContext(UserContext);
	const drProps = { state, navigation, descriptors };


	return <>
		<View flex={1}>
			<Image alt='drawerBg' style={{ width: "auto" }} source={require('../assets/images/drawerBg.png')} />

			<Heading color="$textLight700" $dark-color="$textLight400" alignSelf="center" marginBottom="$2">
				{`Hello, ${userContext?.user?.name}!`}
			</Heading>


			<DrawerContentScrollView   >
				<DrawerItemList {...drProps} />


			</DrawerContentScrollView >


			<View justifyContent="flex-end" marginBottom="$6">

				<DrawerItem
					label='Logout'

					labelStyle={{ marginLeft: -27 }}
					icon={({ color, size }) =>
						<Entypo name="log-out" color={color} size={size} />
					}
					onPress={() => {
						if (Platform.OS != 'web') {
							SecureStore.deleteItemAsync('AUTH_TOKEN');
						}
						api.defaults.headers.common['Authorization'] = undefined;
						userContext?.setUser(null);
						router.replace('login');
					}}
				/>
			</View>
		</View >
	</>

};
