import { View, Text, StyleSheet } from 'react-native';

export default function Bookings() {
	return (
		<View style={styles.container}>
			<Text>bookings</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
