import {
	VStack, Heading, Button, Input, InputField,
	ButtonText, FormControl, Toast, ToastTitle,
	FormControlError, FormControlErrorIcon, FormControlErrorText,
	useToast, AlertCircleIcon, InputSlot, InputIcon, PhoneIcon, MailIcon
} from "@gluestack-ui/themed";


import { useState } from 'react';
import api from "@/utils/api";
import { findErrorByPath } from "@/utils/error";

import axios from "axios";

import { router } from 'expo-router';

import { UserContext } from '@/utils/userContext';
import { useContext } from 'react';

import { Ionicons } from '@expo/vector-icons';

export default function profile() {
	const userContext = useContext(UserContext);
	const [errors, setErrors] = useState({ errors: [] });

	const [form, setForm] = useState(userContext?.user);




	const toast = useToast()


	const phoneError = findErrorByPath(errors.errors, "phoneNumber");
	const nameError = findErrorByPath(errors.errors, "name");

	const [showPassword, setShowPassword] = useState(false)
	const handleState = () => {
		setShowPassword((showState) => {
			return !showState
		})
	}

	const handleSave = async () => {
		setErrors({ errors: [] });
		try {
			const res = await api.patch('/api/users/', { name: form?.name, phoneNumber: form?.phoneNumber });


			toast.show({
				placement: "bottom",
				render: ({ id }) => {
					const toastId = "toast-" + id
					return (
						<Toast marginBottom="$16" nativeID={toastId} action="success" variant="accent">
							<ToastTitle>
								Profile updated successfully
							</ToastTitle>
						</Toast>
					)
				},
			})


			userContext?.setUser({ ...userContext?.user, name: form ? form.name : "", phoneNumber: form?.phoneNumber });

			router.replace('menu');

		} catch (error) {
			if (axios.isAxiosError(error)) {
				if (error.response?.status === 400) {
					setErrors(error.response?.data);
				}
			}
		}
	}


	return <>

		<VStack space="xl" paddingTop="$10" $lg-width="15%" justifyContent="center" $lg-alignSelf="center" paddingHorizontal="$5">
			<Heading color="$text900" $dark-color="$white" alignSelf="center" lineHeight="$md" marginBottom="$10">
				Edit your profile
			</Heading>


			<FormControl isDisabled={true}>
				<Input size="lg">
					<InputSlot pl="$3">
						<InputIcon as={MailIcon} />
					</InputSlot>
					<InputField
						type="text" placeholder="Email" value={form?.email} />
				</Input>
			</FormControl>

			<FormControl isInvalid={nameError !== undefined}>
				<Input size="lg">
					<InputSlot pl="$3">
						<InputIcon as={() => (<Ionicons name="person-outline" size={20} color="#8C8C8C" />)} />
					</InputSlot>
					<InputField onChangeText={(name: string) => setForm({ ...form, name })}
						type="text" placeholder="name" value={form?.name} />
				</Input>
				<FormControlError>

					<FormControlErrorIcon as={AlertCircleIcon} />
					<FormControlErrorText >
						{nameError?.msg}
					</FormControlErrorText>
				</FormControlError>
			</FormControl>

			<FormControl isInvalid={phoneError !== undefined}>
				<Input size="lg">
					<InputSlot pl="$3">
						<InputIcon as={PhoneIcon} />
					</InputSlot>
					<InputField onChangeText={(phoneNumber: string) => form && setForm({ ...form, phoneNumber })}
						type="text" placeholder="name" value={form?.phoneNumber} />
				</Input>
				<FormControlError>

					<FormControlErrorIcon as={AlertCircleIcon} />
					<FormControlErrorText >
						{phoneError?.msg}
					</FormControlErrorText>
				</FormControlError>
			</FormControl>


			<Button onPress={handleSave}>
				<ButtonText >Save Changes</ButtonText>
			</Button>
			<Button mt="$5" action="negative" onPress={async () => {
				try {

					const res = await api.delete('/api/users/');
					toast.show({
						placement: "bottom",
						render: ({ id }) => {
							const toastId = "toast-" + id
							return (
								<Toast marginBottom="$16" nativeID={toastId} action="error" variant="accent">
									<ToastTitle>
										Account deleted
									</ToastTitle>
								</Toast>
							)
						},
					});

					router.replace('login');
				} catch (error) {

					
				}


			}} >
				<ButtonText>Delete Account</ButtonText>
			</Button>
		</VStack >

	</>
}
