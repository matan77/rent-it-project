
import {
	Button, ButtonText,
} from '@gluestack-ui/themed';



interface BookingProps {
	isDisabled: boolean;

}


export default function Booking({ isDisabled, }: BookingProps) {

	return (
		<Button mt="$5" action="positive" isDisabled={isDisabled} alignSelf='center' >
			<ButtonText>Book Now</ButtonText>
		</Button>

	)
}
