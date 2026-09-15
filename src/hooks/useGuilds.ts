import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Guild } from '@/types/guild';
import { fetchGuilds } from '@/services/guildService';
import Fuse from 'fuse.js';

let isInitialLoad = true;

export const useGuilds = (itemsPerPage: number = 6) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [guildsData, setGuildsData] = useState<Guild[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    const [localSearchQuery, setLocalSearchQuery] = useState(searchParams.get('q') || '');
    const [localCategory, setLocalCategory] = useState(searchParams.get('category') || 'All');
    const [localPlatform, setLocalPlatform] = useState(searchParams.get('platform') || 'All');
    const [localPage, setLocalPage] = useState(Number(searchParams.get('page')) || 1);
    const [suggestion, setSuggestion] = useState<string | null>(null);

    useEffect(() => {
        if (!localSearchQuery || guildsData.length === 0) {
            setSuggestion(null);
            return;
        }

        const exactMatchExists = guildsData.some(g => 
            g.name.toLowerCase().includes(localSearchQuery.toLowerCase())
        );

        if (exactMatchExists) {
            setSuggestion(null);
            return;
        }

        const fuse = new Fuse(guildsData, {
            keys: ['name'],
            threshold: 0.4,
        });

        const results = fuse.search(localSearchQuery);
        if (results.length > 0) {
            const bestMatch = results[0].item.name;
            if (bestMatch.toLowerCase() !== localSearchQuery.toLowerCase()) {
                setSuggestion(bestMatch);
            } else {
                setSuggestion(null);
            }
        } else {
            setSuggestion(null);
        }
    }, [localSearchQuery, guildsData]);

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

    useEffect(() => {
        const handler = setTimeout(() => {
            const currentQ = searchParams.get('q') || '';
            if (localSearchQuery !== currentQ) {
                const params = new URLSearchParams(window.location.search);
                if (localSearchQuery) params.set('q', localSearchQuery);
                else params.delete('q');
                params.set('page', '1');
                
                const queryString = params.toString();
                const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
                window.history.pushState(null, '', newUrl);
            }
        }, 300);
        return () => clearTimeout(handler);
    }, [localSearchQuery, pathname, searchParams]);

    const updateURL = (newCategory: string, newPlatform: string, newQuery: string, newPage: number) => {
        const params = new URLSearchParams();
        if (newCategory !== 'All') params.set('category', newCategory);
        if (newPlatform !== 'All') params.set('platform', newPlatform);
        if (newQuery) params.set('q', newQuery);
        if (newPage > 1) params.set('page', newPage.toString());
        
        const queryString = params.toString();
        const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
        window.history.pushState(null, '', newUrl);
    };

    const handleCategoryChange = (category: string) => {
        setLocalCategory(category);
        setLocalPage(1);
        updateURL(category, localPlatform, localSearchQuery, 1);
    };

    const handlePlatformChange = (platform: string) => {
        setLocalPlatform(platform);
        setLocalPage(1);
        updateURL(localCategory, platform, localSearchQuery, 1);
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalSearchQuery(e.target.value);
        setLocalPage(1);
    };

    const handlePageChange = (page: number) => {
        setLocalPage(page);
        updateURL(localCategory, localPlatform, localSearchQuery, page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const filteredGuilds = useMemo(() => {
        return guildsData.filter(guild => {
            const matchesSearch = guild.name.toLowerCase().includes(localSearchQuery.toLowerCase());
            const matchesCategory = localCategory === 'All' || guild.category === localCategory;
            const matchesPlatform = localPlatform === 'All' || guild.platform === localPlatform;
            return matchesSearch && matchesCategory && matchesPlatform;
        });
    }, [guildsData, localSearchQuery, localCategory, localPlatform]);

    useEffect(() => {
        const currentQ = searchParams.get('q') || '';
        const currentCat = searchParams.get('category') || 'All';
        const currentPlat = searchParams.get('platform') || 'All';
        const currentPg = Number(searchParams.get('page')) || 1;
        
        setLocalSearchQuery(currentQ);
        setLocalCategory(currentCat);
        setLocalPlatform(currentPlat);
        setLocalPage(currentPg);
    }, [searchParams.get('q'), searchParams.get('category'), searchParams.get('platform'), searchParams.get('page')]);

    const totalItems = filteredGuilds.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    const validCurrentPage = Math.min(Math.max(1, localPage), totalPages);

    const displayedGuilds = useMemo(() => {
        const startIndex = (validCurrentPage - 1) * itemsPerPage;
        return filteredGuilds.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredGuilds, validCurrentPage, itemsPerPage]);

    const handleClearSearch = () => {
        setLocalSearchQuery('');
        setLocalPage(1);
    };

    const handleSuggestionClick = (newQuery: string) => {
        setLocalSearchQuery(newQuery);
        setLocalPage(1);
    };

    return {
        displayedGuilds,
        loading,
        error,
        localSearchQuery,
        handleSearchChange,
        handleClearSearch,
        activeCategory: localCategory,
        handleCategoryChange,
        activePlatform: localPlatform,
        handlePlatformChange,
        currentPage: validCurrentPage,
        handlePageChange,
        totalPages,
        totalItems,
        suggestion,
        handleSuggestionClick
    };
}