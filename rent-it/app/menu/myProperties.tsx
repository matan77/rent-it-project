import { View, Text, StyleSheet } from 'react-native';

export default function MyProperties() {
	return (
		<View style={styles.container}>
			<Text>myProperties</Text>
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
