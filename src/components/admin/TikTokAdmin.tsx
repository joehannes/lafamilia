import React, { useState } from 'react';
import { FaYoutube, FaTrash, FaPlus } from 'react-icons/fa';

interface TikTokVideo {
  id: string;
  adventureId: string;
  title: string;
  url: string;
  description: string;
  createdAt: string;
}

interface TikTokAdminProps {
  onSave?: (videos: TikTokVideo[]) => void;
}

const TikTokAdmin: React.FC<TikTokAdminProps> = ({ onSave }) => {
  const [videos, setVideos] = useState<TikTokVideo[]>([
    {
      id: '1',
      adventureId: 'buggy',
      title: 'Jungle Quad Adventure',
      url: 'https://www.tiktok.com/@youraccount/video/123456789',
      description: 'Experience the thrill of off-road quad biking through the Dominican jungle',
      createdAt: '2024-03-01'
    },
    {
      id: '2',
      adventureId: 'party_boat',
      title: 'Party Boat Vibes',
      url: 'https://www.tiktok.com/@youraccount/video/987654321',
      description: 'Full day of fun, sun, and Caribbean vibes on the water',
      createdAt: '2024-03-02'
    },
    {
      id: '3',
      adventureId: 'waterfall',
      title: 'Waterfall Magic',
      url: 'https://www.tiktok.com/@youraccount/video/456789123',
      description: 'Discover the enchanting Samana waterfalls hidden in the jungle',
      createdAt: '2024-03-03'
    }
  ]);
  const [newVideo, setNewVideo] = useState({
    adventureId: 'buggy',
    title: '',
    url: '',
    description: ''
  });

  const handleAddVideo = () => {
    if (newVideo.title && newVideo.url) {
      const video: TikTokVideo = {
        id: Date.now().toString(),
        ...newVideo,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setVideos([...videos, video]);
      setNewVideo({
        adventureId: 'buggy',
        title: '',
        url: '',
        description: ''
      });
      onSave?.([...videos, video]);
    }
  };

  const handleDeleteVideo = (id: string) => {
    const updated = videos.filter(v => v.id !== id);
    setVideos(updated);
    onSave?.(updated);
  };

  const getTikTokEmbedUrl = (url: string) => {
    // Convert TikTok URL to embed format
    const videoId = url.split('/video/')[1]?.split('?')[0];
    if (videoId) {
      return `https://www.tiktok.com/embed/v2/${videoId}`;
    }
    return url;
  };

  return (
    <div className="w-full space-y-8">
      <h2 className="text-3xl font-bold text-slate-900 mb-6">TikTok Videos Management</h2>

      {/* Add new video form */}
      <div className="bg-gradient-to-br from-black to-slate-900 rounded-2xl p-8 text-white">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <FaPlus /> Add New TikTok Video
        </h3>

        <div className="space-y-4">
          {/* Adventure selection */}
          <div>
            <label className="block text-sm font-semibold mb-2">Adventure Category</label>
            <select
              value={newVideo.adventureId}
              onChange={(e) => setNewVideo({ ...newVideo, adventureId: e.target.value })}
              className="w-full px-4 py-2 bg-slate-800 border-2 border-pink-500 rounded-lg text-white focus:outline-none"
            >
              <option value="buggy">🏜️ Jungle Boogie (Buggy)</option>
              <option value="party_boat">🎉 Party Boat (Saona)</option>
              <option value="waterfall">🌊 Waterfall (Samana)</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold mb-2">Video Title</label>
            <input
              type="text"
              value={newVideo.title}
              onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
              placeholder="e.g., Epic Quad Adventure"
              className="w-full px-4 py-2 bg-slate-800 border-2 border-pink-500 rounded-lg text-white focus:outline-none placeholder-slate-400"
            />
          </div>

          {/* TikTok URL */}
          <div>
            <label className="block text-sm font-semibold mb-2">TikTok URL</label>
            <input
              type="url"
              value={newVideo.url}
              onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
              placeholder="https://www.tiktok.com/@youraccount/video/123456789"
              className="w-full px-4 py-2 bg-slate-800 border-2 border-pink-500 rounded-lg text-white focus:outline-none placeholder-slate-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-2">Description</label>
            <textarea
              value={newVideo.description}
              onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
              placeholder="Brief description of the video..."
              rows={3}
              className="w-full px-4 py-2 bg-slate-800 border-2 border-pink-500 rounded-lg text-white focus:outline-none placeholder-slate-400 resize-none"
            />
          </div>

          {/* Submit button */}
          <button
            onClick={handleAddVideo}
            disabled={!newVideo.title || !newVideo.url}
            className="w-full py-3 px-4 bg-gradient-to-r from-pink-600 to-orange-600 text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Video
          </button>
        </div>
      </div>

      {/* Video list */}
      <div>
        <h3 className="text-2xl font-bold text-slate-900 mb-6">Current Videos ({videos.length})</h3>

        <div className="grid md:grid-cols-2 gap-6">
          {videos.map((video) => (
            <div key={video.id} className="bg-white rounded-2xl overflow-hidden shadow-lg border-2 border-slate-200">
              {/* Video preview */}
              <div className="w-full h-64 bg-slate-200 flex items-center justify-center overflow-hidden">
                <FaYoutube className="text-6xl text-slate-400" />
              </div>

              {/* Video info */}
              <div className="p-6 space-y-3">
                <h4 className="font-bold text-slate-900 text-lg">{video.title}</h4>
                <p className="text-sm text-slate-600">{video.description}</p>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">
                    Adventure:{' '}
                    <span className="font-semibold">
                      {video.adventureId === 'buggy'
                        ? '🏜️ Buggy'
                        : video.adventureId === 'party_boat'
                          ? '🎉 Party Boat'
                          : '🌊 Waterfall'}
                    </span>
                  </span>
                  <span className="text-slate-500">{video.createdAt}</span>
                </div>

                <div className="border-t-2 border-slate-200 pt-3 flex gap-2">
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-3 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white text-sm font-semibold rounded text-center hover:shadow-lg transition-all"
                  >
                    View on TikTok
                  </a>
                  <button
                    onClick={() => handleDeleteVideo(video.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TikTokAdmin;
