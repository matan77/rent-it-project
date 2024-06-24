import { Redirect } from 'expo-router';
import { UserContext } from '../utils/userContext'
import { useContext } from 'react';


export default function main() {
	const userContext = useContext(UserContext);

	if (userContext === undefined || userContext.user === null) {
		return <Redirect href="/login" />;
	}
	else {
		return <Redirect href="/login" />; // redirect to menu
	}

}