'use client';

import { useState } from 'react';
import { useTerminalStore } from '@/lib/store';
import { Newspaper, ExternalLink, Clock, Tag } from 'lucide-react';

export default function NewsPanel() {
  const { newsItems } = useTerminalStore();
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Finance', 'Crypto', 'Economy', 'Technology'];

  const filteredNews = activeCategory === 'All' 
    ? newsItems 
    : newsItems.filter(n => 
        n.category.toLowerCase() === activeCategory.toLowerCase() ||
        n.title.toLowerCase().includes(activeCategory.toLowerCase())
      );

  return (
    <div className="space-y-4">
      <div className="terminal-panel p-4">
        <h2 className="terminal-title flex items-center gap-2">
          <Newspaper className="w-4 h-4" />
          Financial News
        </h2>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
              activeCategory === cat 
                ? 'bg-terminal-accent text-black' 
                : 'bg-terminal-panel border border-terminal-border text-terminal-muted'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* News Feed */}
      <div className="space-y-3">
        {filteredNews.map((news) => (
          <a
            key={news.id}
            href={news.url}
            target="_blank"
            rel="noopener noreferrer"
            className="terminal-panel p-4 block hover:border-terminal-accent transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="font-medium text-sm leading-relaxed line-clamp-2">{news.title}</h3>
                <div className="flex items-center gap-3 mt-2">
                  <span className="flex items-center gap-1 text-xs text-terminal-accent">
                    <Tag className="w-3 h-3" />
                    {news.source}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-terminal-muted">
                    <Clock className="w-3 h-3" />
                    {new Date(news.publishedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-terminal-muted shrink-0" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
