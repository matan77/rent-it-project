
export type Error = {
	location?: string;
	msg: string;
	path?: string;
	type?: string;
	value?: string;
};

export type ErrorsResponse = {
	errors: Error[];
};

