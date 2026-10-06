export interface AddedByInfo {
    name: string;
    url?: string;
}

export interface Guild {
    _id: string;
    name: string;
    description: string;
    image_url: string;
    website?: string;
    platform: string;
    category: string;
    link?: string;
    socials: {
        twitter?: string;
        instagram?: string;
        discord?: string;
        github?: string;
        youtube?: string;
    };
    added_by?: AddedByInfo;
    created_at?: string;
}

export interface GuildSubmissionPayload {
    guild_link: string;
    name: string;
    link: string;
    turnstile_token: string;
}