'use client';

import NwwOneeAIChat, { chatStore } from "@/components/NwwOneeAIChat";
import { useState, useEffect, useRef, Suspense } from 'react';
import { FaTimes, FaYoutube, FaInstagram, FaGithub, FaDiscord, FaTelegram, FaGlobe } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { CgClose } from "react-icons/cg";
import { GoSearch } from "react-icons/go";
import { CiBookmark } from "react-icons/ci";
import { Spinner } from '@/components/ui/spinner';
import { FiChevronDown, FiCheck, FiFilter } from 'react-icons/fi';
import { FallbackImage } from '@/components/FallbackImage';
import Pagination from '@/components/Pagination';
import { useGuilds } from '@/hooks/useGuilds';
import { Guild } from '@/types/guild';

const ITEMS_PER_PAGE = 6;

const categories = ['All', 'Programming', 'Design', '3D', 'Artist', 'Editing', 'Photography', 'Audio', 'Gadget', 'Gaming', 'Other'];

const platformOptions = ['All', 'Discord', 'Telegram', 'WhatsApp', 'Facebook'];

const socialOrder = ['website', 'youtube', 'twitter', 'instagram', 'discord', 'github'];

function FilterDropdown({ selectedPlatform, setSelectedPlatform }: { selectedPlatform: string, setSelectedPlatform: (p: string) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const hasActiveFilters = selectedPlatform !== 'All';

    return (
        <div className="relative inline-block text-left shrink-0" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex items-center justify-center gap-2 px-4 h-12 rounded-full text-sm font-medium transition-colors duration-200 cursor-pointer
                    ${isOpen || hasActiveFilters ? 'bg-blue-500/20 text-fill-color border border-blue-500/50' : 'card-color text-fill-color/70 border border-color hover:!text-[var(--fill-color)] hover:!border-blue-600'}
                `}
            >
                <FiFilter className={`w-4 h-4 ${isOpen || hasActiveFilters ? 'text-blue-400' : ''}`} />
                <span>Platform</span>
                <FiChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-2 w-56 rounded-xl card-color border border-color shadow-xl overflow-hidden focus:outline-none animate-in fade-in zoom-in-95 duration-200 right-0 origin-top-right">
                    <div className="max-h-[60vh] overflow-y-auto custom-scrollbar px-3 pb-3 pt-5">
                        <div>
                            <div className="flex items-center gap-1.5 mb-2 px-2 text-fill-color/50">
                                <FiFilter className="w-3.5 h-3.5" />
                                <h3 className="text-xs font-semibold uppercase tracking-wider">Platform</h3>
                            </div>
                            <div className="space-y-1">
                                {platformOptions.map(platform => (
                                    <button
                                        key={platform}
                                        onClick={() => {
                                            setSelectedPlatform(platform);
                                            setIsOpen(false);
                                        }}
                                        className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors cursor-pointer ${selectedPlatform === platform
                                            ? 'bg-blue-500/20 text-blue-400 font-medium'
                                            : 'text-fill-color/70 hover:bg-[rgba(var(--fill-color-rgb),0.1)] hover:text-fill-color'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>{platform === 'All' ? 'All Platforms' : platform}</span>
                                        </div>
                                        {selectedPlatform === platform && <FiCheck className="w-4 h-4" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <NwwOneeAIChat />
        </div>
    );
}

function GuildContentInner() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [selectedPlatform, setSelectedPlatform] = useState('All');

    const { guildsData, loading, error, search, setSearch, suggestion, handleSuggestionClick } = useGuilds();

    const [currentPage, setCurrentPage] = useState(1);
    const [selectedGuild, setSelectedGuild] = useState<Guild | null>(null);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, activeCategory, selectedPlatform]);

    const filteredGuilds = guildsData.filter(g => {
        const matchesSearch = g.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = activeCategory === 'All' || g.category === activeCategory;
        const matchesPlatform = selectedPlatform === 'All' || g.platform === selectedPlatform;
        return matchesSearch && matchesCategory && matchesPlatform;
    });

    const totalItems = filteredGuilds.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const displayedGuilds = filteredGuilds.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const renderSocialIcon = (key: string, url: string) => {
        switch (key) {
            case 'youtube': return <a key={key} href={url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="opacity-70 hover:opacity-100 transition-opacity text-fill-color"><FaYoutube className="w-5 h-5" /></a>;
            case 'twitter': return <a key={key} href={url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="opacity-70 hover:opacity-100 transition-opacity text-fill-color"><FaXTwitter className="w-5 h-5" /></a>;
            case 'instagram': return <a key={key} href={url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="opacity-70 hover:opacity-100 transition-opacity text-fill-color"><FaInstagram className="w-5 h-5" /></a>;
            case 'github': return <a key={key} href={url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="opacity-70 hover:opacity-100 transition-opacity text-fill-color"><FaGithub className="w-5 h-5" /></a>;
            case 'discord': return <a key={key} href={url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="opacity-70 hover:opacity-100 transition-opacity text-fill-color"><FaDiscord className="w-5 h-5" /></a>;
            case 'telegram': return <a key={key} href={url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="opacity-70 hover:opacity-100 transition-opacity text-fill-color"><FaTelegram className="w-5 h-5" /></a>;
            case 'website': return <a key={key} href={url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="opacity-70 hover:opacity-100 transition-opacity text-fill-color"><FaGlobe className="w-5 h-5" /></a>;
            default: return null;
        }
    };

    const getOrderedSocials = (socialsObj: any) => {
        const presentSocials = Object.keys(socialsObj).filter(k => socialsObj[k] && typeof socialsObj[k] === 'string');

        return presentSocials.sort((a, b) => {
            const indexA = socialOrder.indexOf(a);
            const indexB = socialOrder.indexOf(b);
            return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
        }).map(key => ({ key, url: socialsObj[key] }));
    };

    const scrollRef = useRef<HTMLDivElement>(null);
    const fadeRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    useEffect(() => {
        const checkOverflow = () => {
            if (scrollRef.current && fadeRef.current) {
                const { scrollWidth, clientWidth, scrollLeft } = scrollRef.current;
                const hasMore = Math.ceil(scrollLeft + clientWidth) < scrollWidth - 1;
                fadeRef.current.style.opacity = hasMore ? '1' : '0';
                fadeRef.current.style.visibility = hasMore ? 'visible' : 'hidden';
            }
        };

        const timeoutId = setTimeout(checkOverflow, 50);

        window.addEventListener('resize', checkOverflow);
        const scrollElement = scrollRef.current;
        if (scrollElement) {
            scrollElement.addEventListener('scroll', checkOverflow);
        }

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', checkOverflow);
            if (scrollElement) {
                scrollElement.removeEventListener('scroll', checkOverflow);
            }
        };
    }, [categories.length]);

    const onMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        if (scrollRef.current) {
            setStartX(e.pageX - scrollRef.current.offsetLeft);
            setScrollLeft(scrollRef.current.scrollLeft);
        }
    };

    const onMouseLeave = () => {
        setIsDragging(false);
    };

    const onMouseUp = () => {
        setIsDragging(false);
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX);
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    return (
        <div className="min-h-screen body-color text-fill-color p-8 pt-12 font-sans">
            <div className="max-w-7xl mx-auto flex flex-col items-center">
                <div className="w-full max-w-2xl mb-8 text-center">
                    <h1 className="text-3xl font-bold mb-2">
                        Guild Directory
                    </h1>
                    <p className="text-fill-color/70 max-w-md mx-auto">
                        Discover online communities across tech, programming, design, gaming, and more. Find where you belong.
                    </p>
                </div>

                {/* Search Bar & Platform Filter */}
                <div className="w-full max-w-2xl mb-6 flex gap-3">
                    <div className="relative flex-grow search-container">
                        <GoSearch className="search-icon absolute left-4 top-1/2 -translate-y-1/2 text-fill-color w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search Community"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full h-12 pl-12 pr-12 rounded-full card-color border border-color text-fill-color placeholder:text-fill-color/50 transition-colors custom-search-focus"
                        />
                        {search && (
                            <button
                                onClick={() => {
                                    setSearch('');
                                    setCurrentPage(1);
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity text-fill-color cursor-pointer"
                                aria-label="Clear search"
                            >
                                <CgClose className="w-5 h-5" />
                            </button>
                        )}

                        <div className="absolute left-0 top-full pt-1 pl-5 w-full text-left z-10 pointer-events-none">
                            <div className={`text-xs text-fill-color/70 transition-opacity duration-300 pointer-events-auto ${suggestion ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                                Did you mean:{' '}
                                <button
                                    onClick={() => suggestion && handleSuggestionClick(suggestion)}
                                    className="font-semibold text-blue-500 hover:underline cursor-pointer"
                                >
                                    {suggestion}
                                </button>
                                ?
                            </div>
                        </div>
                    </div>
                    <FilterDropdown selectedPlatform={selectedPlatform} setSelectedPlatform={setSelectedPlatform} />
                </div>

                {/* Categories Buttons */}
                <div className="relative w-full md:max-w-3xl mb-10 mx-auto overflow-hidden">
                    <div
                        ref={scrollRef}
                        onMouseDown={onMouseDown}
                        onMouseLeave={onMouseLeave}
                        onMouseUp={onMouseUp}
                        onMouseMove={onMouseMove}
                        className={`flex overflow-x-auto gap-2 items-center md:pb-3 max-md:[&::-webkit-scrollbar]:hidden max-md:[-ms-overflow-style:none] max-md:[scrollbar-width:none] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[rgba(var(--fill-color-rgb),0.3)] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[rgba(var(--fill-color-rgb),0.5)] ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
                    >
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium leading-none transition-colors duration-200 cursor-pointer ${activeCategory === category
                                    ? 'bg-blue-600 text-white'
                                    : 'card-color text-fill-color/70 border border-color hover:!text-[var(--fill-color)] hover:!border-blue-600'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                    {/* Fade indicator */}
                    <div
                        ref={fadeRef}
                        className="absolute right-0 top-0 h-8 w-12 bg-gradient-to-l from-blue-600/20 to-transparent pointer-events-none transition-opacity duration-200"
                        style={{ opacity: 0, visibility: 'hidden' }}
                    />
                </div>

                {loading ? (
                    <div className="flex justify-center p-12 w-full max-w-7xl">
                        <Spinner className="text-blue-500 size-10" />
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 w-full items-center">
                        {error && (
                            <div className="text-red-500 text-center py-4 bg-red-500/10 rounded-lg border border-red-500/20 w-full max-w-7xl mb-4">
                                Error loading guilds: {error}
                            </div>
                        )}
                        {/* Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 w-full max-w-7xl">
                            {displayedGuilds.length > 0 ? (
                                displayedGuilds.map(guild => {
                                    const socialKeys = { website: guild.website, ...guild.socials };
                                    const orderedSocials = getOrderedSocials(socialKeys);

                                    return (
                                        <div
                                            key={guild._id}
                                            onClick={() => setSelectedGuild(guild)}
                                            className="glass-card rounded-2xl overflow-hidden flex flex-col h-full card-hover transition-all cursor-pointer relative group hover:border-blue-500/40"
                                        >
                                            {/* Guild Image Banner */}
                                            <div className="relative w-full h-32 bg-gradient-to-br from-blue-600/20 via-blue-500/10 to-purple-600/10 overflow-hidden">
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <FallbackImage
                                                        src={guild.image_url}
                                                        alt={guild.name}
                                                        className="w-20 h-20 rounded-2xl object-cover border-2 border-[var(--border-color)] shadow-lg"
                                                    />
                                                </div>
                                                {/* Platform badges on banner */}
                                                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                                                    {guild.platform && (
                                                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-sm text-white/90 font-semibold uppercase tracking-wider">
                                                            {guild.platform}
                                                        </span>
                                                    )}
                                                </div>
                                                {/* Bookmark */}
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        chatStore.setIsOpen(true);
                                                        chatStore.setActiveView('user');
                                                    }}
                                                    className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-[rgba(var(--fill-color-rgb),0.06)] border border-color text-fill-color opacity-70 hover:opacity-100 hover:!bg-blue-500/20 hover:!text-blue-400 hover:!border-blue-500/40 transition-all cursor-pointer"
                                                    title="Bookmark"
                                                >
                                                    <CiBookmark className="w-[16px] h-[16px]" />
                                                </button>
                                            </div>

                                            {/* Content */}
                                            <div className="p-5 flex flex-col flex-grow">
                                                <div className="flex items-start justify-between mb-3">
                                                    <h3 className="text-lg font-bold text-fill-color leading-tight truncate pr-2">
                                                        {guild.name}
                                                    </h3>
                                                </div>

                                                <div className="flex flex-wrap gap-1.5 mb-3">
                                                    {guild.category && (
                                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                                                            {guild.category}
                                                        </span>
                                                    )}
                                                </div>

                                                <p className="text-sm text-fill-color/70 mb-4 flex-grow line-clamp-2">
                                                    {guild.description}
                                                </p>

                                                {/* Footer */}
                                                <div className="flex items-center justify-between gap-3 mt-auto pt-4 border-t border-[rgba(var(--fill-color-rgb),0.08)]">
                                                    <div className="flex items-center gap-4 min-w-0 overflow-hidden">
                                                        {orderedSocials.slice(0, 4).map(social => renderSocialIcon(social.key, social.url))}
                                                        {orderedSocials.length > 4 && (
                                                            <span className="text-[10px] px-2 py-0.5 rounded-md border border-color bg-card-color text-fill-color/70 font-bold shrink-0">
                                                                +{orderedSocials.length - 4}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {guild.invite_link && (
                                                        <a href={guild.invite_link} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="shrink-0 px-4 py-1.5 rounded-full text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20 flex items-center gap-1.5">
                                                            Join Now
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="col-span-full w-full flex-col flex gap-4">
                                    <div className="text-center py-1">
                                        <FallbackImage
                                            src="https://cdn.nekowawolf.xyz/image/2026/1787422427_nwwonee_search.webp"
                                            alt="No data found"
                                            width={160}
                                            height={160}
                                            className="mx-auto"
                                        />
                                        <p className="text-fill-color/50 -mt-4">No communities found.</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {displayedGuilds.length > 0 && totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                itemsPerPage={ITEMS_PER_PAGE}
                                totalItems={totalItems}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </div>
                )}

                {/* Modal Popup */}
                {selectedGuild && (
                    <div
                        className="cursor-pointer fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                        onClick={() => setSelectedGuild(null)}
                    >
                        <div
                            className="cursor-auto glass-card rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-color shadow-2xl relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Top Right Actions */}
                            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                                {/* Bookmark */}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        chatStore.setIsOpen(true);
                                        chatStore.setActiveView('user');
                                    }}
                                    className="w-9 h-9 flex items-center justify-center rounded-full bg-[rgba(var(--fill-color-rgb),0.06)] border border-color text-fill-color opacity-70 hover:opacity-100 hover:!bg-blue-500/20 hover:!text-blue-400 hover:!border-blue-500/40 transition-all cursor-pointer"
                                    title="Bookmark"
                                >
                                    <CiBookmark className="w-[18px] h-[18px]" />
                                </button>
                                {/* Close */}
                                <button
                                    onClick={() => setSelectedGuild(null)}
                                    className="w-9 h-9 flex items-center justify-center rounded-full bg-[rgba(var(--fill-color-rgb),0.06)] border border-color text-fill-color opacity-70 hover:opacity-100 transition-all cursor-pointer"
                                >
                                    <FaTimes size={14} />
                                </button>
                            </div>

                            <div className="p-6 sm:p-8">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-20 h-20 relative rounded-xl overflow-hidden bg-card-color2 shrink-0 border border-color shadow-sm">
                                        <FallbackImage
                                            src={selectedGuild.image_url}
                                            alt={selectedGuild.name}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>
                                    <div className="pr-20">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h2 className="text-2xl font-bold text-fill-color leading-tight">
                                                {selectedGuild.name}
                                            </h2>
                                        </div>
                                        <div className="flex gap-2 items-center flex-wrap">
                                            {selectedGuild.category && (
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                    {selectedGuild.category}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Platforms */}
                                <div className="mb-4">
                                    <h4 className="text-sm font-semibold text-fill-color/50 mb-2 uppercase tracking-wider">Platforms</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedGuild.platform && (
                                            <span className="text-xs px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                                                {selectedGuild.platform}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h4 className="text-sm font-semibold text-fill-color/50 mb-2 uppercase tracking-wider">About</h4>
                                    <div className="max-h-40 overflow-y-auto pr-2">
                                        <p className="text-base text-fill-color/80 leading-relaxed whitespace-pre-wrap">
                                            {selectedGuild.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between gap-3 pt-4 mt-auto border-t border-[rgba(var(--fill-color-rgb),0.08)]">
                                    <div className="relative flex-grow min-w-0 overflow-hidden">
                                        <div
                                            className="flex items-center gap-4 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden"
                                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                                            ref={(el) => {
                                                if (el) {
                                                    const fade = el.nextElementSibling as HTMLElement;
                                                    if (fade) {
                                                        const checkOverflow = () => {
                                                            const hasMore = Math.ceil(el.scrollLeft + el.clientWidth) < el.scrollWidth - 1;
                                                            fade.style.opacity = hasMore ? '1' : '0';
                                                            fade.style.visibility = hasMore ? 'visible' : 'hidden';
                                                        };
                                                        checkOverflow();
                                                        setTimeout(checkOverflow, 50);
                                                    }
                                                }
                                            }}
                                            onScroll={(e) => {
                                                const target = e.currentTarget;
                                                const fade = target.nextElementSibling as HTMLElement;
                                                if (fade) {
                                                    const hasMore = Math.ceil(target.scrollLeft + target.clientWidth) < target.scrollWidth - 1;
                                                    fade.style.opacity = hasMore ? '1' : '0';
                                                    fade.style.visibility = hasMore ? 'visible' : 'hidden';
                                                }
                                            }}
                                        >
                                            {(() => {
                                                const socialKeys = { website: selectedGuild.website, ...selectedGuild.socials };
                                                const orderedSocials = getOrderedSocials(socialKeys);
                                                return orderedSocials.map(social => renderSocialIcon(social.key, social.url));
                                            })()}
                                        </div>
                                        {/* Fade indicator for mobile scrolling */}
                                        <div
                                            className="absolute right-0 top-0 bottom-1 w-12 pointer-events-none transition-opacity duration-200 md:hidden bg-gradient-to-l from-blue-600/20 to-transparent"
                                            style={{ opacity: 0, visibility: 'hidden' }}
                                        />
                                    </div>
                                    {selectedGuild.invite_link && (
                                        <a href={selectedGuild.invite_link} target="_blank" rel="noreferrer" className="shrink-0 px-6 py-1.5 rounded-full text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20 flex items-center gap-1.5">
                                            Join Now
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function GuildContent() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center min-h-[50vh]">
                <Spinner className="text-blue-500 size-10" />
            </div>
        }>
            <GuildContentInner />
        </Suspense>
    );
}