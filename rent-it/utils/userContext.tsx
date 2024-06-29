import React, { createContext, useState, Context, ReactNode, useEffect } from 'react';
import { Platform } from 'react-native';
import api from './api';
import axios from 'axios'
import {
	AlertDialog, AlertDialogBackdrop, AlertDialogContent, Spinner,
	AlertDialogHeader, AlertDialogBody, Image
} from '@gluestack-ui/themed';

import { User } from '@/types/user';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';


export const UserContext: Context<UserContextType> = createContext<UserContextType>(undefined);

interface UserProviderProps {
	children: ReactNode;
}

type UserContextType = {
	user: User;
	setUser: React.Dispatch<React.SetStateAction<User>>;
	trigger: boolean;
	setTrigger: React.Dispatch<React.SetStateAction<boolean>>;
} | undefined;

export const UserProvider = ({ children }: UserProviderProps) => {
	const [user, setUser] = useState<User>(null);
	const [trigger, setTrigger] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {

		if (Platform.OS != 'web') {
			const token = SecureStore.getItem("AUTH_TOKEN")
			if (token) {
				api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
			}
		}
		setIsOpen(true);
		api.get('/api/users')
			.then((res) => {

				setIsOpen(false);
				setUser({ name: res.data.name as string });
				router.replace('/menu');
			})
			.catch((error) => {
				setIsOpen(false);


				if (!(error instanceof Error && error.message === "serviceDown")) {
					router.replace('/');
				}
			})
	}, [trigger]);





	return (
		<UserContext.Provider value={{ user, setUser, trigger, setTrigger }}>
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
