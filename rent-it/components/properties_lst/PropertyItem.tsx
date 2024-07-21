import { Property } from '@/types/property';

import { View, Text, Button, ButtonText, Card, Heading, ScrollView, Image, HStack, VStack } from '@gluestack-ui/themed';

export default function PropertyItem({ data }: { data: Property }) {

	return <>

		<Card flex={1} borderRadius="$lg" variant='outline' w={350} m="$3">
			<ScrollView
				alignSelf='center'
				decelerationRate={0}
				snapToInterval={332}
				w={332}

				horizontal={true}

				contentInset={{ top: 0, left: 0, bottom: 0, right: 0, }}

			>
				{data.images ?
					data.images.map((image, index) => (
						<Image
							borderRadius={7}
							marginHorizontal={1}
							h={240}
							w={330}
							key={index}
							alt={`image ${index}`}
							source={image}

							resizeMode='cover'
						/>
					))
					:
					<Image
						h={240}
						w={350}
						borderRadius={7}
						alt="default image"
						resizeMode='cover'
						source={require('@/assets/images/Placeholder.png')}

					/>
				}
			</ScrollView>

			<Heading mb="$1" size="md">{data.title}</Heading>
			<Text mb="$2" size="sm">{data.description}</Text>
			<View flex={1} flexDirection='row' justifyContent='space-between' >

				<Button size="lg" variant="solid" action="primary" alignSelf='flex-start' >
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
