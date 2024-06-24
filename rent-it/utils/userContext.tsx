import React, { createContext, useState, Context, ReactNode, useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { router } from 'expo-router';
import api from './api';
import axios from 'axios'
import {
	AlertDialog, AlertDialogBackdrop, AlertDialogContent, Spinner,
	AlertDialogHeader, AlertDialogBody, Image
} from '@gluestack-ui/themed';

type User = {
	name: string;
	email: string;
	phoneNumber: string;
} | null;


export const UserContext: Context<UserContextType> = createContext<UserContextType>(undefined);

interface UserProviderProps {
	children: ReactNode;
}

type UserContextType = {
	user: User;
	setUser: React.Dispatch<React.SetStateAction<User>>;
} | undefined;

export const UserProvider = ({ children }: UserProviderProps) => {
	const [user, setUser] = useState<User>(null);
	const [isOpen, setIsOpen] = useState(false);
	const appState = useRef(AppState.currentState);
	const [appStateVisible, setAppStateVisible] = useState(appState.current);

	const handleChange = (newState: string) => {
		if (newState === "active") {

			setIsOpen(true);
			api.get('/api/users')
				.then((res) => {
					setIsOpen(false);
					setUser(res.data as User);
				})
				.catch((error) => {
					setIsOpen(false);

					if (!axios.isAxiosError(error) || error.code !== 'ERR_NETWORK') {
						router.replace('/');
					}
				});
		}
	}

	useEffect(() => {
		const evl = AppState.addEventListener('change', handleChange);
		handleChange("active");
		return () => {
			evl.remove();
		}
	}, []);



	return (
		<UserContext.Provider value={{ user, setUser }}>
			<AlertDialog
				isOpen={isOpen}
			>
				<AlertDialogBackdrop />
				<AlertDialogContent >
					<AlertDialogHeader justifyContent='center' >
						<Image alt='logo' source={require('../assets/images/favicon.png')} />
					</AlertDialogHeader>
					<AlertDialogBody>
						<Spinner size='large' />
					</AlertDialogBody>
				</AlertDialogContent>
			</AlertDialog>
			{children}
		</UserContext.Provider>
	);
};
