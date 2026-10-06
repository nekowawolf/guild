import { Guild, GuildSubmissionPayload } from '@/types/guild';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchGuilds = async (forceShuffle: boolean = false): Promise<Guild[]> => {
    try {
        const fullUrl = `${API_BASE_URL}/guild`;
        console.log('Fetching Guilds data from:', fullUrl);

        const response = await fetch(fullUrl);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText} (URL: ${fullUrl})`);
        }
        const data = await response.json();

        let resultData: Guild[] = [];

        if (!Array.isArray(data)) {
            if (data && Array.isArray(data.data)) {
                resultData = data.data;
            } else {
                console.error('API did not return an array:', data);
                return [];
            }
        } else {
            resultData = data;
        }

        if (typeof sessionStorage !== 'undefined') {
            const cachedOrderStr = sessionStorage.getItem('guildsOrder');
            if (cachedOrderStr && !forceShuffle) {
                try {
                    const cachedOrder: string[] = JSON.parse(cachedOrderStr);
                    const orderMap = new Map<string, number>(cachedOrder.map((id, index) => [id, index]));
                    resultData.sort((a, b) => {
                        const aIdx = orderMap.has(a._id) ? orderMap.get(a._id)! : 99999;
                        const bIdx = orderMap.has(b._id) ? orderMap.get(b._id)! : 99999;
                        return aIdx - bIdx;
                    });
                } catch (e) {
                    console.error('Failed to parse cached order', e);
                }
            } else {
                for (let i = resultData.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [resultData[i], resultData[j]] = [resultData[j], resultData[i]];
                }
                const order = resultData.map(t => t._id);
                sessionStorage.setItem('guildsOrder', JSON.stringify(order));
            }
        }

        return resultData;
    } catch (error) {
        console.error('Error fetching guilds:', error);
        throw error;
    }
};

export const fetchGuildById = async (id: string): Promise<Guild | null> => {
    try {
        const items = await fetchGuilds(false);
        return items.find((t) => t._id.toString() === id) || null;
    } catch (error) {
        console.error('Error fetching Guild item by ID:', error);
        return null;
    }
};

export const submitGuild = async (payload: GuildSubmissionPayload) => {
    const fullUrl = `${API_BASE_URL}/guild-submissions`;
    const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Failed to submit guild');
    }

    return response.json();
};