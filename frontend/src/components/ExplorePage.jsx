import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { Loader2, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';

const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY;

const categories = [
    { name: "Curated", query: "" }, // Special category for curated photos
    { name: "Nature", query: "nature" },
    { name: "Animals", query: "animals" },
    { name: "Technology", query: "technology" },
    { name: "Abstract", query: "abstract" },
    { name: "Food", query: "food" },
    { name: "Travel", query: "travel" },
    { name: "People", query: "people" },
];

const ExplorePage = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("photos"); // "photos" or "videos"

    // Photo states
    const [images, setImages] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    // Video states
    const [videos, setVideos] = useState([]);
    const [videoPage, setVideoPage] = useState(1);
    const [videoLoading, setVideoLoading] = useState(false);
    const [videoHasMore, setVideoHasMore] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState(null);

    const [selectedCategory, setSelectedCategory] = useState(categories[0]); // Default to Curated
    const [searchQuery, setSearchQuery] = useState("");
    const [currentSearchTerm, setCurrentSearchTerm] = useState("");
    const observer = useRef();

    const fetchImages = useCallback(async (reset = false) => {
        if (loading) return;
        if (reset) {
            setPage(1);
            setImages([]);
            setHasMore(true);
            setLoading(true);
        } else if (!hasMore) {
            return;
        }

        setLoading(true);
        try {
            let response;
            const headers = {
                Authorization: PEXELS_API_KEY,
            };

            if (currentSearchTerm) {
                response = await axios.get(`https://api.pexels.com/v1/search?query=${currentSearchTerm}&page=${page}&per_page=30`, { headers });
            } else if (selectedCategory.query) {
                response = await axios.get(`https://api.pexels.com/v1/search?query=${selectedCategory.query}&page=${page}&per_page=30`, { headers });
            } else {
                response = await axios.get(`https://api.pexels.com/v1/curated?page=${page}&per_page=30`, { headers });
            }

            if (response.data.photos.length === 0) {
                setHasMore(false);
            } else {
                setImages(prevImages => (reset ? response.data.photos : [...prevImages, ...response.data.photos]));
                setPage(prevPage => prevPage + 1);
            }
        } catch (error) {
            console.error("Error fetching images:", error);
            setHasMore(false); // Stop trying to fetch if there's an error
        } finally {
            setLoading(false);
        }
    }, [page, loading, hasMore, selectedCategory, currentSearchTerm]);

    const fetchVideos = useCallback(async (reset = false) => {
        if (videoLoading) return;
        if (reset) {
            setVideoPage(1);
            setVideos([]);
            setVideoHasMore(true);
            setVideoLoading(true);
        } else if (!videoHasMore) {
            return;
        }

        setVideoLoading(true);
        try {
            let response;
            const headers = {
                Authorization: PEXELS_API_KEY,
            };

            if (currentSearchTerm) {
                response = await axios.get(`https://api.pexels.com/videos/search?query=${currentSearchTerm}&page=${videoPage}&per_page=30`, { headers });
            } else if (selectedCategory.query) {
                response = await axios.get(`https://api.pexels.com/videos/search?query=${selectedCategory.query}&page=${videoPage}&per_page=30`, { headers });
            } else {
                response = await axios.get(`https://api.pexels.com/videos/popular?page=${videoPage}&per_page=30`, { headers });
            }

            if (response.data.videos.length === 0) {
                setVideoHasMore(false);
            } else {
                setVideos(prevVideos => (reset ? response.data.videos : [...prevVideos, ...response.data.videos]));
                setVideoPage(prevPage => prevPage + 1);
            }
        } catch (error) {
            console.error("Error fetching videos:", error);
            setVideoHasMore(false);
        } finally {
            setVideoLoading(false);
        }
    }, [videoPage, videoLoading, videoHasMore, selectedCategory, currentSearchTerm]);

    useEffect(() => {
        if (activeTab === "photos") {
            fetchImages(true);
        } else {
            fetchVideos(true);
        }
    }, [activeTab, selectedCategory, currentSearchTerm, fetchImages, fetchVideos]);

    const lastImageElementRef = useCallback(node => {
        if (activeTab === "photos" && loading) return;
        if (activeTab === "videos" && videoLoading) return;

        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                if (activeTab === "photos" && hasMore) {
                    fetchImages();
                } else if (activeTab === "videos" && videoHasMore) {
                    fetchVideos();
                }
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore, fetchImages, videoLoading, videoHasMore, fetchVideos, activeTab]);

    const handleImageClick = (image) => {
        setSelectedImage(image);
        setSelectedVideo(null); // Clear selected video
        setIsDialogOpen(true);
    };

    const handleVideoClick = (video) => {
        setSelectedVideo(video);
        setSelectedImage(null); // Clear selected image
        setIsDialogOpen(true);
    };

    const handleDownload = async () => {
        if (selectedImage) {
            try {
                const response = await axios.get(selectedImage.src.original, { responseType: 'blob' });
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `explore_image_${selectedImage.id}.jpg`);
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.error("Error downloading image:", error);
            }
        } else if (selectedVideo) {
            try {
                // Find the highest quality video file
                const highestQualityVideo = selectedVideo.video_files.reduce((prev, current) => {
                    return (prev.width * prev.height > current.width * current.height) ? prev : current;
                });

                const response = await axios.get(highestQualityVideo.link, { responseType: 'blob' });
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `explore_video_${selectedVideo.id}.mp4`); // Assuming mp4
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.error("Error downloading video:", error);
            }
        }
    };

    return (
        <div className="w-full flex justify-center bg-white dark:bg-black text-black dark:text-white min-h-screen">
            <div className="w-full max-w-5xl mx-auto px-0 sm:px-2 py-8 md:pl-60">
                <h1 className="text-2xl font-bold mb-6 text-center">Explore</h1>

                {/* Tab Buttons */}
                <div className="flex justify-center gap-4 mb-6">
                    <Button
                        variant={activeTab === "photos" ? "default" : "outline"}
                        onClick={() => setActiveTab("photos")}
                        className="rounded-full"
                    >
                        Photos
                    </Button>
                    <Button
                        variant={activeTab === "videos" ? "default" : "outline"}
                        onClick={() => setActiveTab("videos")}
                        className="rounded-full"
                    >
                        Videos
                    </Button>
                </div>

                {/* Category Buttons */}
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {categories.map((category) => (
                        <Button
                            key={category.name}
                            variant={selectedCategory.name === category.name ? "default" : "outline"}
                            onClick={() => {
                                setSelectedCategory(category);
                                setCurrentSearchTerm(""); // Clear search when category is selected
                            }}
                            className="rounded-full"
                        >
                            {category.name}
                        </Button>
                    ))}
                </div>

                {/* Search Input */}
                <div className="flex items-center gap-2 mb-6 px-4">
                    <Input
                        type="text"
                        placeholder={`Search for ${activeTab === "photos" ? "images" : "videos"}...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                setCurrentSearchTerm(searchQuery);
                                setSelectedCategory(categories[0]); // Reset category when searching
                            }
                        }}
                        className="flex-1 bg-gray-100 dark:bg-[#23272e] text-black dark:text-white border border-gray-200 dark:border-gray-800"
                    />
                    <Button onClick={() => {
                        setCurrentSearchTerm(searchQuery);
                        setSelectedCategory(categories[0]); // Reset category when searching
                    }}>
                        <Search className="h-5 w-5" />
                    </Button>
                </div>

                {activeTab === "photos" && (
                    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1">
                        {images.map((image, index) => {
                            if (images.length === index + 1) {
                                return (
                                    <div ref={lastImageElementRef} key={image.id} className="relative group cursor-pointer bg-gray-100 dark:bg-gray-800 aspect-square overflow-hidden"
                                        onClick={() => handleImageClick(image)}>
                                        <img
                                            src={image.src.medium}
                                            alt={image.alt}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </div>
                                );
                            } else {
                                return (
                                    <div key={image.id} className="relative group cursor-pointer bg-gray-100 dark:bg-gray-800 aspect-square overflow-hidden"
                                        onClick={() => handleImageClick(image)}>
                                        <img
                                            src={image.src.medium}
                                            alt={image.alt}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </div>
                                );
                            }
                        })}
                    </div>
                )}

                {activeTab === "videos" && (
                    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1">
                        {videos.map((video, index) => {
                            if (videos.length === index + 1) {
                                return (
                                    <div ref={lastImageElementRef} key={video.id} className="relative group cursor-pointer bg-gray-100 dark:bg-gray-800 aspect-square overflow-hidden"
                                        onClick={() => handleVideoClick(video)}>
                                        <img
                                            src={video.image}
                                            alt={video.url}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <span className="text-white text-xl font-bold">▶</span>
                                        </div>
                                    </div>
                                );
                            } else {
                                return (
                                    <div key={video.id} className="relative group cursor-pointer bg-gray-100 dark:bg-gray-800 aspect-square overflow-hidden"
                                        onClick={() => handleVideoClick(video)}>
                                        <img
                                            src={video.image}
                                            alt={video.url}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <span className="text-white text-xl font-bold">▶</span>
                                        </div>
                                    </div>
                                );
                            }
                        })}
                    </div>
                )}

                {activeTab === "photos" && loading && (
                    <div className="flex justify-center items-center py-4">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                    </div>
                )}
                {activeTab === "videos" && videoLoading && (
                    <div className="flex justify-center items-center py-4">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                    </div>
                )}

                {activeTab === "photos" && !hasMore && !loading && images.length > 0 && (
                    <p className="text-center text-gray-500 py-4">No more images to load.</p>
                )}
                {activeTab === "videos" && !videoHasMore && !videoLoading && videos.length > 0 && (
                    <p className="text-center text-gray-500 py-4">No more videos to load.</p>
                )}

                {activeTab === "photos" && !hasMore && !loading && images.length === 0 && (
                    <p className="text-center text-gray-500 py-4">Could not load images.</p>
                )}
                {activeTab === "videos" && !videoHasMore && !videoLoading && videos.length === 0 && (
                    <p className="text-center text-gray-500 py-4">Could not load videos.</p>
                )}
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden">
                    {selectedImage && (
                        <div className="flex flex-col items-center">
                            <img src={selectedImage.src.large} alt="Enlarged" className="max-w-full h-auto" />
                            <div className="p-4 w-full flex flex-col items-center">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Photo by: {selectedImage.photographer}</p>
                                <Button onClick={handleDownload} className="bg-[#0095F6] hover:bg-[#318bc7] text-white">
                                    Download
                                </Button>
                            </div>
                        </div>
                    )}
                    {selectedVideo && (
                        <div className="flex flex-col items-center">
                            <video controls className="max-w-full h-auto">
                                {selectedVideo.video_files.map(file => (
                                    <source key={file.id} src={file.link} type={file.file_type} />
                                ))}
                                Your browser does not support the video tag.
                            </video>
                            <div className="p-4 w-full flex flex-col items-center">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Video by: {selectedVideo.user.name}</p>
                                <Button onClick={handleDownload} className="bg-[#0095F6] hover:bg-[#318bc7] text-white">
                                    Download
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ExplorePage;
