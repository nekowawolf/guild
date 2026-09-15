export interface Guild {
    _id: string;
    name: string;
    description: string;
    image_url: string;
    website?: string;
    platform: string;
    category: string;
    invite_link?: string;
    socials: {
        twitter?: string;
        instagram?: string;
        discord?: string;
        github?: string;
        youtube?: string;
    };
    created_at?: string;
}