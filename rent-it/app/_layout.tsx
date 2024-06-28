import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GluestackUIProvider, Box } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import { useColorScheme } from "react-native";
import { Slot } from "expo-router";
import { UserProvider } from '../utils/userContext'

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from "expo-router";


SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loaded, error] = useFonts({
		...FontAwesome.font,
	});

	// Expo Router uses Error Boundaries to catch errors in the navigation tree.
	useEffect(() => {
		if (error) throw error;
	}, [error]);

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	return <RootLayoutNav />;
}


function RootLayoutNav() {
	const colorScheme = useColorScheme();

	return (
		<GluestackUIProvider config={config} colorMode={colorScheme === "dark" ? "dark" : "light"}>
			<ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
				<UserProvider>
					<Box flex={1} $dark-bg='$backgroundDark900'>
						<Slot initialRouteName="/login" />
					</Box>
				</UserProvider>
			</ThemeProvider>
		</GluestackUIProvider>
	);
}
