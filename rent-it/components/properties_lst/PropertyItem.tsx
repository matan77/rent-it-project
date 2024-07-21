import { Property } from '@/types/property';
import { View, Text, Button, ButtonText, Card, Heading, ScrollView, Image, HStack, VStack } from '@gluestack-ui/themed';

export default function PropertyItem({ data }: { data: Property }) {
	return <>

		<Card size="lg" variant="outline" m="$2">
			<ScrollView horizontal >

				{data.images ?
					data.images.map((image, index) => (
						<Image borderRadius={7} key={index} alt={`image ${index}`} source={image} style={{ width: 200, height: 200, margin: 10 }} />

					))
					:
					<Image borderRadius={7} alt="default image" source={require('@/assets/images/Placeholder.png')} style={{ width: 200, height: 200, margin: 10 }} />
				}
			</ScrollView>
			<Heading mb="$1" size="md">{data.title}</Heading>
			<Text mb="$2" size="sm">{data.description}</Text>
			<View flex={1} flexDirection='row' justifyContent='space-between'>


				<Button size="md" variant="solid" action="primary" alignSelf='flex-start' >
					<ButtonText>View</ButtonText>
				</Button>
				<VStack>

					<Text alignSelf='flex-end' size="md" color='green' marginEnd={20}>{`${data.pricePerNight} $`} </Text>
					<Text alignSelf='flex-end' size="xs" > per night</Text>
				</VStack>
			</View>


		</Card>


	</>;
}
