import {
	VStack, Heading, Button, Input, InputField, InputSlot, InputIcon,
	ButtonText, Image, FormControl, EyeIcon, EyeOffIcon,
	FormControlError, FormControlErrorIcon, FormControlErrorText,
	useToast, Toast, ToastTitle,
	Divider, HStack, Icon,
	View
} from "@gluestack-ui/themed";
import { AlertCircleIcon } from 'lucide-react-native'

import { useState } from 'react';
import api from "@/utils/api";
import { findErrorByPath } from "@/utils/error";

import axios from "axios";
import { Text } from "@gluestack-ui/themed";
import { Link } from 'expo-router';

export default function Login() {
	const [errors, setErrors] = useState({ errors: [] });

	const [loginForm, setLoginForm] = useState({
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
			const res = await api.post('/api/users/login', loginForm);
			console.log(res.data());
		} catch (error) {
			if (axios.isAxiosError(error)) {
				if (error.response?.status === 400) {
					setErrors(error.response?.data);
				}
				else {
					setLoginForm({
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
										Invalid email or password
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
			<Image size="2xl" alt='logo' alignSelf="center" source={require('../assets/images/favicon.png')}></Image>
			<Heading color="$text900" $dark-color="$white" alignSelf="center" lineHeight="$md" marginBottom="$10">
				Welcome Back
			</Heading>

			<VStack space="xs">
				<FormControl isInvalid={emailError !== undefined}>
					<Input size="lg">
						<InputField onChangeText={(email: string) => setLoginForm({ ...loginForm, email })}
							type="text" placeholder="Email" value={loginForm.email} />
					</Input>
					<FormControlError>
						<FormControlErrorIcon as={AlertCircleIcon} />
						<FormControlErrorText >
							{emailError?.msg}
						</FormControlErrorText>
					</FormControlError>
				</FormControl>
			</VStack>
			<VStack space="xs">
				<FormControl isInvalid={passwordError !== undefined}>
					<Input size="lg">
						<InputField onChangeText={(password: string) => setLoginForm({ ...loginForm, password })}
							type={showPassword ? "text" : "password"} value={loginForm.password} placeholder="Password" />
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
			</VStack>

			<Button onPress={handleLogin}>
				<ButtonText >Login </ButtonText>
			</Button>

			<HStack>
				<Divider height={2} flex={1} marginTop="$3.5" />
				<Text marginHorizontal="$3" >OR</Text>
				<Divider height={2} flex={1} marginTop="$3.5" />
			</HStack>

			<View alignSelf="center" $pressed-bgColor="$red300" $hover-bgColor="$red300" $active-bgColor="$red300">
				<Link href="/register">
					<Text size="md" color="$primary600" bold={true} >Create an account</Text>
				</Link>
			</View>


		</VStack>

	</>
}
