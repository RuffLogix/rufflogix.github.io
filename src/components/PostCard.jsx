import { User, Calendar } from "lucide-react";

export default function PostCard({ post }) {
  return (
    <div className="w-full bg-gray-800 border border-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:border-emerald-500 flex flex-col overflow-hidden">
      <a
        href={post.link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col h-full"
      >
        <img
          src={post.thumbnail ?? "/images/rufflogix-logo.jpg"}
          alt={post.title}
          className="w-full h-48 object-cover bg-gray-700"
          loading="lazy"
        />
        <div className="p-4 flex flex-col">
          <h3 className="text-lg font-bold text-white leading-tight mb-2 line-clamp-2">
            {post.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-400 mt-auto">
            <span className="flex items-center gap-1">
              <User size={14} />
              {post.author}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {new Date(post.date).toLocaleDateString()}
            </span>
          </div>
        </div>
      </a>
    </div>
  );
}
