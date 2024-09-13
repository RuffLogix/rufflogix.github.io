import React, { useState } from "react";
import { formatDate } from "../services/utils";

export interface Post {
  frontmatter: {
    title: string;
    author: string;
    date: string;
    description: string;
    tags: string[];
    published: boolean;
  };
  url: string;
}

interface PaginationProps {
  posts: Post[];
  postsPerPage: number;
}

const Pagination: React.FC<PaginationProps> = ({ posts, postsPerPage }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(posts.length / postsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="py-10 h-screen flex flex-col gap-8">
      {posts
        .slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage)
        .map(
          (post: Post) =>
            post.frontmatter.published && (
              <div>
                <div className="flex flex-col gap-2">
                  <h1 className="text-xl font-bold">
                    {post.frontmatter.title}
                  </h1>
                  <p className="text-sm">
                    Written by {post.frontmatter.author} on //{" "}
                    {formatDate(post.frontmatter.date)}
                  </p>
                  <div className="flex gap-1">
                    {post.frontmatter.tags.map((tag: string) => (
                      <span className="px-3 py-1 font-normal bg-orange-200 hover:bg-orange-400 hover:cursor-default duration-300 rounded-full text-xs">
                        # {tag}
                      </span>
                    ))}
                  </div>
                  <p>{post.frontmatter.description}</p>
                </div>
                <a
                  href={post.url}
                  className="underline hover:text-orange-500 font-medium"
                >
                  Read more
                </a>
              </div>
            ),
        )}
      <div className="flex justify-between mt-4">
        {currentPage > 1 && (
          <button
            onClick={handlePrevious}
            className="px-4 py-2 font-medium bg-orange-200 hover:bg-orange-400 hover:cursor-pointer duration-300 rounded-md"
          >
            Previous
          </button>
        )}

        <div></div>

        {currentPage < totalPages && (
          <button
            onClick={handleNext}
            className="px-4 py-2 font-medium bg-orange-200 hover:bg-orange-400 hover:cursor-pointer duration-300 rounded-md"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default Pagination;
