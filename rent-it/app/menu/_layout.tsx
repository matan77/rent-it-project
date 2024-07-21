import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import DrawerContent from '@/components/DrawerContent';
import { useColorScheme } from 'react-native';
import { Entypo, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';


export default function Layout() {
	const colorScheme = useColorScheme();

	return (
		<GestureHandlerRootView  >


			<Drawer screenOptions={
				{
					drawerLabelStyle: { marginLeft: -24 },
					title: "",
					sceneContainerStyle: {backgroundColor: colorScheme === "dark" ? "#262626" : "#ffffff" },
					headerTintColor: colorScheme === "dark" ? "#d6d3d1" : "#000000",
					headerTransparent: true,
				}
			}
				backBehavior='history' drawerContent={DrawerContent}>

				<Drawer.Screen
					name="index"
					options={{
						drawerLabel: 'Home',
						drawerIcon: ({ color, size, focused }) => { return <Entypo name="home" size={size} color={color} /> }
					}}

				/>
				<Drawer.Screen
					name="myBookings"
					options={{
						drawerLabel: 'My Bookings',
						drawerIcon: ({ color, focused, size }) => { return <MaterialCommunityIcons name="calendar-multiple-check" color={color} size={size} /> }
					}}
				/>
				<Drawer.Screen
					name="myProperties"
					options={{
						drawerLabel: 'My properties',
						drawerIcon: ({ color, focused, size }) => { return <MaterialCommunityIcons name="home-city" color={color} size={size} /> }
					}}
				/>

				<Drawer.Screen
					name="bookings"
					options={{

						drawerLabel: 'Bookings',
						drawerIcon: ({ color, size, focused }) => { return <MaterialCommunityIcons name="calendar-check" size={size} color={color} /> }
					}}

				/>
				<Drawer.Screen
					name="profile"
					options={{

						drawerLabel: 'Profile',
						drawerIcon: ({ color, size, focused }) => { return <MaterialIcons name="person" size={size + 3} color={color} /> }
					}}

				/>

			</Drawer>

		</GestureHandlerRootView >

	);
}
