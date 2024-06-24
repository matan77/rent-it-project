import axios from 'axios';
import Constants from 'expo-constants';
import { router } from 'expo-router';
// get ip from expo for dev mode
const expoServer = Constants.experienceUrl;
const ip = expoServer.substring(expoServer.lastIndexOf("//") + 2, expoServer.lastIndexOf(":"));

// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
const api = axios.create({
	baseURL: `http://${ip}:3000`,
	// withCredentials: true
	timeout: 5000
});

api.interceptors.response.use((response) => response, (error) => {
	if (axios.isAxiosError(error) && error.code === 'ERR_NETWORK') {
		router.replace('/serviceDown');

	}
	throw error;
});

export default api;