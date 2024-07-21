import { Heading, Button, ButtonText, ButtonIcon, ArrowUpIcon, ArrowDownIcon } from '@gluestack-ui/themed';
import { useState } from 'react';

import { SafeAreaView } from 'react-native-safe-area-context';
import PropertiesLst from '@/components/properties_lst/PropertiesLst';

export default function Home() {
	const filters = ['', 'price_lh', 'price_hl'];
	const [filter, setFilter] = useState(0);

	const onFilterChange = () => {
		setFilter((filter + 1) % filters.length);
	}



	return (
		<SafeAreaView style={{ flex: 1 }}>

			<Heading color="$text900" $dark-color="$white" alignSelf="center" lineHeight="$md" marginTop="$5" >
				Home
			</Heading>

			<Button onPress={onFilterChange} size="md" variant="solid" action="primary"  alignSelf='flex-end' m="$2">
				{
					filters[filter] ? <ButtonText>By price</ButtonText> :
						<ButtonText>By date</ButtonText>
				}
				{filters[filter] === 'price_lh' && <ButtonIcon m="$2" w="$5" h="$5" as={ArrowUpIcon} />}
				{filters[filter] === 'price_hl' && <ButtonIcon m="$2" w="$5" h="$5" as={ArrowDownIcon} />}

			</Button>


			<PropertiesLst isMy={true} filter={filters[filter]} />
		</SafeAreaView >
	);
}

