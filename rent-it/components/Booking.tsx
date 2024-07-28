import React, { useState } from 'react';
import { Button, ButtonText, ButtonSpinner, Toast, useToast, ToastTitle, } from '@gluestack-ui/themed';
import { Calendar, DateData } from 'react-native-calendars';
import api from '@/utils/api';
import { MarkedDates } from 'react-native-calendars/src/types';
import { router } from 'expo-router';
import axios from 'axios';
import { useColorScheme } from 'react-native';

interface BookingProps {
	isDisabled: boolean;
	property: string;
}


export default function Booking({ isDisabled, property }: BookingProps) {
	const [checkIn, setCheckIn] = useState('');
	const [checkOut, setCheckOut] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isBook, setIsBook] = useState(false);
	const theme = useColorScheme();
	const toast = useToast();
	const color = theme === 'light' ? '#0077E6' : '#1A91FF';

	const handleBooking = async () => {
		if (!isBook) {
			setIsBook(true);
			return;
		}
		let msg: null | string = null;
		setIsLoading(true);
		try {
			const res = await api.post('/api/bookings', {
				property,
				checkIn,
				checkOut,
			});


			toast.show({
				placement: "bottom",
				render: ({ id }) => {
					const toastId = "toast-" + id

					return (
						<Toast marginBottom="$16" nativeID={toastId} action="success" variant="accent">
							<ToastTitle>
								Booking Confirmed
							</ToastTitle>
						</Toast>
					)
				}
			});
			router.replace('/menu/myBookings');
		} catch (error) {

			if (axios.isAxiosError(error)) {
				msg = error.response?.data.msg;
			}
		} finally {
			setIsLoading(false);
			if (msg)
				toast.show({
					placement: "bottom",
					render: ({ id }) => {
						const toastId = "toast-" + id

						return (
							<Toast marginBottom="$16" nativeID={toastId} action="error" variant="accent">
								<ToastTitle>
									{msg}
								</ToastTitle>
							</Toast>
						)
					},
				});
		}
	};

	const dateToString = (d: Date) => d.toISOString().split('T')[0];


	const getMarkedDates = (): MarkedDates => {
		if (!checkIn) {
			return {
			};
		}

		const InDate = new Date(checkIn);

		const markedDates: MarkedDates = {
			[checkIn]: { selected: true, startingDay: true, color },
		}

		if (!checkOut) {
			return markedDates;
		}

		const OutDate = new Date(checkOut);
		if (checkIn === checkOut) {
			return {
				[checkIn]: { selected: true, startingDay: true, endingDay: true, color },
			}
		}

		let currDate = new Date(InDate);
		while (currDate < OutDate) {
			currDate.setDate(currDate.getDate() + 1);
			const dateStr = currDate.toISOString().split('T')[0];
			markedDates[dateStr] = { selected: true, color };
		}

		markedDates[checkOut] = { selected: true, endingDay: true, color };

		return markedDates;
	}
	const markedDates = getMarkedDates();

	return (
		<>
			{isBook
				&&
				<Calendar
					key={theme}

					theme={theme === 'light' ? { arrowColor: color, } : {
						arrowColor: color, calendarBackground: '#262626', backgroundColor: '#262626',
						todayTextColor: color,
						textSectionTitleColor: 'white',

						dayTextColor: 'white',
						textDisabledColor: '#525252',
						monthTextColor: 'white',
					}
					}
					style={{
						marginHorizontal: 50,
					}}
					minDate={dateToString(new Date())}
					onDayPress={(day: DateData) => {

						if (!checkIn) {
							setCheckIn(day.dateString);
						} else if (!checkOut) {
							const InDate = new Date(checkIn);
							const OutDate = new Date(day.dateString);
							if (OutDate >= InDate) {
								setCheckOut(day.dateString);
							}
							else {
								setCheckIn(day.dateString);
							}
						}
						else {
							setCheckOut('');
							setCheckIn(day.dateString);
						}
					}}
					markedDates={markedDates}
					markingType={'period'}

				/>
			}

			<Button
				marginVertical="$5"
				action="positive"
				isDisabled={isDisabled || isBook && (!checkIn || !checkOut || isLoading)}
				alignSelf="center"
				onPress={handleBooking}
			>
				<ButtonText>{isBook ? "Book Now" : "make a book"}</ButtonText>
				{isLoading && <ButtonSpinner />}
			</Button>
		</>
	);
}
