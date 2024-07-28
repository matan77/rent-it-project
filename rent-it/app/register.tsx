import {
	VStack, Heading, Button, Input, InputField, InputSlot, InputIcon,
	ButtonText, Image, FormControl, EyeIcon, EyeOffIcon,
	FormControlError, FormControlErrorIcon, FormControlErrorText,
	useToast, Toast, ToastTitle,
	Divider, HStack,
	AlertCircleIcon,
	ScrollView
} from "@gluestack-ui/themed";

import { useState, useContext } from 'react';
import { UserContext } from '@/utils/userContext';
import api from "@/utils/api";
import { findErrorByPath } from "@/utils/error";
import * as SecureStore from 'expo-secure-store';
import axios from "axios";
import { Text } from "@gluestack-ui/themed";
import { Link, router } from 'expo-router';
import { ErrorsResponse } from "@/types/error";
import { Platform, KeyboardAvoidingView } from "react-native";

export default function Register() {
	const userContext = useContext(UserContext);
	const [errors, setErrors] = useState<ErrorsResponse>({ errors: [] });
	const [cofError, setCofError] = useState<undefined | { msg: string }>(undefined);

	const [form, setForm] = useState({
		name: "",
		phoneNumber: "",
		email: "",
		password: "",
		confirmPassword: ""
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
		if (form.password !== form.confirmPassword) {
			setCofError({ msg: "Password don't match" });
			return;
		}
		setCofError(undefined);
		try {
			const res = await api.post('/api/users/register', form);

			const token = res.data as string;
			userContext?.setUser({
				name: form.name,
				email: form.email,
				phoneNumber: form.phoneNumber
			});
			if (Platform.OS != 'web') {
				await SecureStore.setItemAsync("AUTH_TOKEN", token);
			}
			api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

			router.replace('menu');
		} catch (error) {
			if (axios.isAxiosError(error)) {
				if (error.response?.status === 400) {
					setErrors(error.response?.data);
				}
				else {
					setForm({
						name: "",
						phoneNumber: "",
						email: "",
						password: "",
						confirmPassword: ""
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
		<KeyboardAvoidingView  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>


			<VStack space="xl" paddingVertical="$10" $lg-width="15%" justifyContent="center" $lg-alignSelf="center" paddingHorizontal="$5">
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


				<FormControl isInvalid={cofError !== undefined}>
					<Input size="lg">
						<InputField onChangeText={(confirmPassword: string) => setForm({ ...form, confirmPassword })}
							type={showPassword ? "text" : "password"} value={form.confirmPassword} placeholder="Confirm Password" />

					</Input>
					<FormControlError>
						<FormControlErrorIcon as={AlertCircleIcon} />
						<FormControlErrorText >
							{cofError?.msg}
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
		</KeyboardAvoidingView>
	</>
}
