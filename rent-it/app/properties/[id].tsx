import { useLocalSearchParams } from 'expo-router';
import { View, Text,  } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Property() {
  const { id } = useLocalSearchParams();

  return (
	<SafeAreaView style={{ flex: 1 }}>
      <Text>Details of user {id} </Text>
    </SafeAreaView>
  );
}
