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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [displayedPosts, setDisplayedPosts] = useState<Post[]>(posts);

  const totalPages = Math.ceil(displayedPosts.length / postsPerPage);

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

  const searchTag = (tag: string) => {
    const filteredPosts = posts.filter((post) => {
      let shouldDisplay = false;
      post.frontmatter.tags.forEach((postTag) => {
        if (postTag.toLowerCase().includes(tag.toLowerCase())) {
          shouldDisplay = true;
        }
      });
      return shouldDisplay;
    });
    setDisplayedPosts(filteredPosts);
  };

  return (
    <div className="flex flex-col gap-5 mx-3 md:mx-0">
      <div className="flex justify-end">
        <input
          type="text"
          placeholder="Search by tag ..."
          className="px-4 py-2 font-medium bg-orange-200 hover:bg-orange-400 hover:cursor-pointer duration-300 rounded-md"
          onChange={(e) => searchTag(e.target.value)}
        />
      </div>
      <div>
        {displayedPosts
          .slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage)
          .map(
            (post: Post, postIndex: number) =>
              post.frontmatter.published && (
                <div key={postIndex}>
                  <div className="flex flex-col gap-2">
                    <h1 className="text-xl font-bold">
                      {post.frontmatter.title}
                    </h1>
                    <p className="text-sm">
                      Written by {post.frontmatter.author} on{" "}
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
                  <hr className="my-4 border-gray-300" />
                </div>
              )
          )}
      </div>
      <div className="flex justify-between my-4">
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
