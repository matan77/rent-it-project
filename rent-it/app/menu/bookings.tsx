
import { Heading } from '@gluestack-ui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';

import BookingsLst from '@/components/bookings_lst/BookingsLst';

export default function Bookings() {
	return (
		<SafeAreaView style={{ flex: 1 }}>

			<Heading color="$text900" $dark-color="$white" alignSelf="center" lineHeight="$md" marginTop="$5" >
				Bookings
			</Heading>

			<BookingsLst isMy={false} />
		</SafeAreaView >
	);
}