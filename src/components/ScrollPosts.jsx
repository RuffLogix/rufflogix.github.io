import React, { useState, useEffect, useRef } from "react";
import PostCard from "./PostCard.jsx";

function extractPostImage(postDescription) {
  const regex = /<img[^>]+src=["']([^"'>]+)["']/;
  const match = postDescription.match(regex);
  return match ? match[1] : null;
}

async function fetchPosts(page, perPage) {
  const res = await fetch(
    "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@rufflogix"
  );
  const data = await res.json();
  return data.items.slice(page * perPage, (page + 1) * perPage).map((post) => ({
    title: post.title,
    date: post.pubDate,
    link: post.guid,
    author: post.author,
    thumbnail: extractPostImage(post.description),
    description: post.description,
  }));
}

export default function ScrollPosts({ initialPosts }) {
  const [posts, setPosts] = useState(initialPosts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const triggerRef = useRef(null);
  const POSTS_PER_PAGE = 6;

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          setLoading(true);
          const newPosts = await fetchPosts(page, POSTS_PER_PAGE);

          if (newPosts.length === 0) {
            setHasMore(false);
          } else {
            setPosts((prev) => [...prev, ...newPosts].slice(0, 9));
            setPage((prev) => prev + 1);
          }

          setLoading(false);
        }
      },
      { threshold: 1 }
    );
    if (triggerRef.current) {
      observer.observe(triggerRef.current);
    }
    return () => observer.disconnect();
  }, [page, loading, hasMore]);

  return (
    <>
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        data-animation="stagger-children"
      >
        {posts.map((post, idx) => (
          <div key={idx} data-animation="fade-up" data-delay={idx * 0.1}>
            <PostCard post={post} />
          </div>
        ))}
      </div>
      {hasMore && <div ref={triggerRef} className="h-8"></div>}
      {loading && hasMore && (
        <div className="text-center text-gray-400 mt-8">Loading...</div>
      )}
    </>
  );
}
