import { Property } from '@/types/property';
import { Text, Card, Heading, ScrollView, Image } from '@gluestack-ui/themed';
import { TouchableOpacity } from 'react-native';
export default function PropertyItem({ data }: { data: Property }) {
	return <>
		<TouchableOpacity activeOpacity={0.5}>
			<Card size="lg" variant="outline" m="$2">
				<ScrollView horizontal>

					{data.images ?
						data.images.map((image, index) => (
							<Image key={index} alt={`image ${index}`} source={image} style={{ width: 200, height: 200, margin: 10 }} />

						))
						:
						<Image alt="default image" source={require('@/assets/images/Placeholder.png')} style={{ width: 200, height: 200, margin: 10 }} />
					}
				</ScrollView>
				<Heading mb="$1" size="md">{data.title}</Heading>
				<Text size="sm">{data.description}</Text>
			</Card>
		</TouchableOpacity >

	</>;
}
