import { Error } from '../types/error';

export const findErrorByPath = (errors: Error[], path: string): Error | undefined => {
	return errors?.find(error => error.path === path);
};