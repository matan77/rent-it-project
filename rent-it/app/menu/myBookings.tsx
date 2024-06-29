import { View, Text, StyleSheet } from 'react-native';

export default function MyBookings() {
	return (
		<View style={styles.container}>
			<Text>MyBookings</Text>
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
