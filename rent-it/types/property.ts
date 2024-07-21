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
    images: string[]; // Assuming images is an array of strings representing image URLs
    description: string;
    services: string[];
    pricePerNight: number;
    createdAt: string; 
};
