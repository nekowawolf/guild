import { useState, useEffect } from 'react';
import { Guild } from '@/types/guild';
import { fetchGuilds } from '@/services/guildService';
import Fuse from 'fuse.js';

let isInitialLoad = true;

export const useGuilds = () => {
    const [guildsData, setGuildsData] = useState<Guild[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [search, setSearch] = useState('');
    const [suggestion, setSuggestion] = useState<string | null>(null);

    useEffect(() => {
        if (!search || guildsData.length === 0) {
            setSuggestion(null);
            return;
        }

        const exactMatchExists = guildsData.some(g => 
            g.name.toLowerCase().includes(search.toLowerCase())
        );

        if (exactMatchExists) {
            setSuggestion(null);
            return;
        }

        const fuse = new Fuse(guildsData, {
            keys: ['name'],
            threshold: 0.4,
        });

        const results = fuse.search(search);
        if (results.length > 0) {
            const bestMatch = results[0].item.name;
            if (bestMatch.toLowerCase() !== search.toLowerCase()) {
                setSuggestion(bestMatch);
            } else {
                setSuggestion(null);
            }
        } else {
            setSuggestion(null);
        }
    }, [search, guildsData]);

    const handleSuggestionClick = (newQuery: string) => {
        setSearch(newQuery);
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                let forceShuffle = false;
                
                if (isInitialLoad) {
                    isInitialLoad = false;
                    const urlParams = new URLSearchParams(window.location.search);
                    const page = Number(urlParams.get('page')) || 1;
                    if (page === 1) {
                        forceShuffle = true;
                    }
                }
                
                const data = await fetchGuilds(forceShuffle);
                setGuildsData(data);
            } catch (err) {
                setError('Failed to fetch guilds data');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    return {
        guildsData,
        loading,
        error,
        search,
        setSearch,
        suggestion,
        handleSuggestionClick
    };
};