import {
	VStack, Heading, Button, Input, InputField, InputSlot, InputIcon,
	ButtonText, Image, FormControl, EyeIcon, EyeOffIcon,
	FormControlError, FormControlErrorIcon, FormControlErrorText,
	useToast, Toast, ToastTitle,
	Divider, HStack,
	AlertCircleIcon
} from "@gluestack-ui/themed";

import { useState } from 'react';
import api from "@/utils/api";
import { findErrorByPath } from "@/utils/error";

import axios from "axios";
import { Text } from "@gluestack-ui/themed";
import { Link } from 'expo-router';
import { ErrorsResponse } from "@/types/error";

export default function Register() {
	const [errors, setErrors] = useState<ErrorsResponse>({ errors: [] });

	const [form, setForm] = useState({
		name: "",
		phoneNumber: "",
		email: "",
		password: ""
	});
	const toast = useToast()

	const nameError = findErrorByPath(errors.errors, "name");
	const phoneError = findErrorByPath(errors.errors, "phoneNumber");
	const emailError = findErrorByPath(errors.errors, "email");
	const passwordError = findErrorByPath(errors.errors, "password");


	const [showPassword, setShowPassword] = useState(false)
	const handleState = () => {
		setShowPassword((showState) => {
			return !showState
		})
	}

	const handleRegister = async () => {

		try {
			const res = await api.post('/api/users/register', form);
			console.log(res.data());
		} catch (error) {
			console.log(JSON.stringify(error))
			if (axios.isAxiosError(error)) {
				if (error.response?.status === 400) {
					setErrors(error.response?.data);
				}
				else {
					setForm({
						name: "",
						phoneNumber: "",
						email: "",
						password: ""
					});
					toast.show({
						placement: "bottom",
						render: ({ id }) => {
							const toastId = "toast-" + id
							return (
								<Toast marginBottom="$16" nativeID={toastId} action="error" variant="accent">
									<ToastTitle>
										{error.response?.data.msg}
									</ToastTitle>
								</Toast>
							)
						},
					})
				}
			}
		}
	}


	return <>

		<VStack space="xl" paddingTop="$10" $lg-width="15%" justifyContent="center" $lg-alignSelf="center" paddingHorizontal="$5">
			<Image size="xl" alt='logo' alignSelf="center" source={require('../assets/images/favicon.png')}></Image>
			<Heading color="$text900" $dark-color="$white" alignSelf="center" lineHeight="$md" marginBottom="$5">
				Create your account
			</Heading>

			<FormControl isInvalid={nameError !== undefined}>
				<Input size="lg">
					<InputField onChangeText={(name: string) => setForm({ ...form, name })}
						type="text" placeholder="name" value={form.name} />
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
					<InputField onChangeText={(phoneNumber: string) => setForm({ ...form, phoneNumber })}
						type="text" placeholder="phone" value={form.phoneNumber} />
				</Input>
				<FormControlError>
					<FormControlErrorIcon as={AlertCircleIcon} />
					<FormControlErrorText >
						{phoneError?.msg}
					</FormControlErrorText>
				</FormControlError>
			</FormControl>

			<FormControl isInvalid={emailError !== undefined}>
				<Input size="lg">
					<InputField onChangeText={(email: string) => setForm({ ...form, email })}
						type="text" placeholder="Email" value={form.email} />
				</Input>
				<FormControlError>
					<FormControlErrorIcon as={AlertCircleIcon} />
					<FormControlErrorText >
						{emailError?.msg}
					</FormControlErrorText>
				</FormControlError>
			</FormControl>


			<FormControl isInvalid={passwordError !== undefined}>
				<Input size="lg">
					<InputField onChangeText={(password: string) => setForm({ ...form, password })}
						type={showPassword ? "text" : "password"} value={form.password} placeholder="Password" />
					<InputSlot pr="$3" onPress={handleState}>
						<InputIcon
							as={showPassword ? EyeIcon : EyeOffIcon}
							color="$darkBlue500"
						/>
					</InputSlot>

				</Input>
				<FormControlError>
					<FormControlErrorIcon as={AlertCircleIcon} />
					<FormControlErrorText >
						{passwordError?.msg}
					</FormControlErrorText>
				</FormControlError>
			</FormControl>


			<Button onPress={handleRegister}>
				<ButtonText>Register</ButtonText>
			</Button>

			<HStack>
				<Divider height={2} flex={1} marginTop="$3.5" />
				<Text marginHorizontal="$3" >OR</Text>
				<Divider height={2} flex={1} marginTop="$3.5" />
			</HStack>
			<HStack alignSelf="center">
				<Text size="md" color="$black" bold={true} >Already have an account? </Text>
				<Link href="/login">
					<Text size="md" color="$primary600" bold={true} >Login</Text>
				</Link>

			</HStack>

		</VStack>

	</>
}
