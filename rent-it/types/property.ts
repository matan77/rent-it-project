export type Property = {
    location: {
        type: "Point";
        coordinates: [number, number];
    };
    _id: string;
    owner: {
        _id: string;
        email: string;
        phoneNumber: string;
    };
    title: string;
    images: string[]; 
    description: string;
    services: string[];
    pricePerNight: number;
    createdAt: string; 
};
