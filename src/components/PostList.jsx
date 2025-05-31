import Post from "@components/Post";
import { useGetAllPostsQuery } from "@services/rootApi";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { throttle } from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";

const PostList = () => {
  const limit = 5;
  const [offset, setOffset] = useState(1);
  const [listPosts, setListPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const prevPostsRef = useRef([]);

  const { data, isLoading, isFetching, isSuccess } = useGetAllPostsQuery({
    offset,
    limit,
  });

  useEffect(() => {
    if (isSuccess && data?.data?.posts !== prevPostsRef.current) {
      const incomingPosts = data?.data?.posts || [];
      const totalPages = data?.data?.meta?.totalPages || 1;

      setListPosts((prev) => {
        if (offset === 1) return incomingPosts;
        const ids = new Set(prev.map((p) => p._id));
        const newPosts = incomingPosts.filter((p) => !ids.has(p._id));
        return [...prev, ...newPosts];
      });
      prevPostsRef.current = incomingPosts;

      if (offset >= totalPages) {
        setHasMore(false);
      }
    }
  }, [data, isSuccess, offset]);

  const resetFn = () => {
    setOffset(1);

    prevPostsRef.current = null;
    setHasMore(true);
  };
  const handleScroll = useMemo(() => {
    return throttle(() => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;

      if (scrollTop < 100 && offset > 1) {
        resetFn();
        return;
      }

      if (!hasMore || isFetching) return;

      if (scrollTop + clientHeight + 100 >= scrollHeight) {
        setOffset((prev) => prev + 1);
      }
    }, 1000);
  }, [hasMore, isFetching]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      handleScroll.cancel();
    };
  }, [handleScroll]);

  if (isLoading && offset === 1) {
    return <div>Loading posts...</div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      {listPosts.length > 0 ? (
        listPosts.map((post) => (
          <Post
            key={post._id}
            comments={post.commentCount}
            like={post.likeCount}
            fullName={post.author?.name}
            createdAt={post.createdAt}
            content={post.content}
            image={post.imageUrl}
          />
        ))
      ) : (
        <p className="text-center text-gray-500">No posts yet.</p>
      )}

      {isFetching && (
        <div className="mt-6 flex justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-10 w-10 rounded-full border-4 border-t-blue-500 border-gray-200"
          />
        </div>
      )}
    </div>
  );
};

export default PostList;
