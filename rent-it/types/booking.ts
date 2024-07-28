export type Booking = {
	_id: string;
	user: {
		_id: string;
		email: string;
		phoneNumber: string;
	};
	property: {
		_id: string;
		title: string;
		pricePerNight: number;
	};
	checkIn: string;
	checkOut: string;
	totalPrice: number;
	createdAt: string;
}