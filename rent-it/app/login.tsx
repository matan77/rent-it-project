import {
	VStack, Heading, Button, Input, InputField, InputSlot, InputIcon,
	ButtonText, Image, FormControl, EyeIcon, EyeOffIcon,
	FormControlError, FormControlErrorIcon, FormControlErrorText,
	useToast, Toast, ToastTitle,
	Divider, HStack, AlertCircleIcon,
	View
} from "@gluestack-ui/themed";


import { useState } from 'react';
import api from "@/utils/api";
import { findErrorByPath } from "@/utils/error";

import axios from "axios";
import { Text } from "@gluestack-ui/themed";
import { Link, router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

import { UserContext } from '../utils/userContext'
import { useContext } from 'react';
import { Platform } from "react-native";
import { User } from "@/types/user";


export default function Login() {
	const userContext = useContext(UserContext);
	const [errors, setErrors] = useState({ errors: [] });

	const [form, setForm] = useState({
		email: "",
		password: ""
	});
	const toast = useToast()

	const emailError = findErrorByPath(errors.errors, "email");
	const passwordError = findErrorByPath(errors.errors, "password");

	const [showPassword, setShowPassword] = useState(false)
	const handleState = () => {
		setShowPassword((showState) => {
			return !showState
		})
	}

	const handleLogin = async () => {

		setErrors({ errors: [] });
		try {
			const res = await api.post('/api/users/login', form);
			const { user, token } = res.data as { user: User, token: string };
			userContext?.setUser(user);
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


					toast.show({
						placement: "bottom",
						render: ({ id }) => {
							const toastId = "toast-" + id

							return (
								<Toast marginBottom="$16" nativeID={toastId} action="error" variant="accent">
									<ToastTitle>
										{error?.response?.data?.msg}
									</ToastTitle>
								</Toast>
							)
						},
					})

					setForm({
						email: "",
						password: ""
					});

				}
			}
		}
	}


	return <>

		<VStack space="xl" paddingTop="$10" $lg-width="15%" justifyContent="center" $lg-alignSelf="center" paddingHorizontal="$5">
			<Image size="2xl" alt='logo' alignSelf="center" source={require('../assets/images/favicon.png')}></Image>
			<Heading color="$text900" $dark-color="$white" alignSelf="center" lineHeight="$md" marginBottom="$10">
				Welcome Back
			</Heading>


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


			<Button onPress={handleLogin}>
				<ButtonText >Login </ButtonText>
			</Button>

			<HStack>
				<Divider height={2} flex={1} marginTop="$3.5" />
				<Text marginHorizontal="$3" >OR</Text>
				<Divider height={2} flex={1} marginTop="$3.5" />
			</HStack>

			<View alignSelf="center">
				<Link href="/register">
					<Text size="md" color="$primary600" bold={true} >Create an account</Text>
				</Link>
			</View>


		</VStack>

	</>
}
