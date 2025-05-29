import Post from "@components/Post";
import { useGetAllPostsQuery } from "@services/rootApi";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { throttle } from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";

const PostList = () => {
  const [offset, setOffset] = useState(1);
  const limit = 5;
  const [listPosts, setListPosts] = useState([]);
  const { data, isLoading, isFetching, isSuccess } = useGetAllPostsQuery({
    offset,
    limit,
  });
  const [hasMore, setHasMore] = useState(true);
  const prevDataRef = useRef();

  useEffect(() => {
    if (isSuccess && prevDataRef.current !== data?.data?.posts) {
      const posts = data?.data?.posts || [];
      const { totalPages } = data?.data?.meta || {};

      if (offset >= totalPages) {
        setHasMore(false);
      }

      prevDataRef.current = data?.data?.posts;
      setListPosts((prev) => [...prev, ...posts]);
    }
  }, [isSuccess, data?.data?.posts, data?.data?.meta, offset]);

  const handleScroll = useMemo(() => {
    return throttle(() => {
      if (!hasMore || isFetching) return;

      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollTop + clientHeight + 50 >= scrollHeight) {
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

  // ✅ Chỉ hiện loading lần đầu
  if (isLoading && offset === 1) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border-4 border-t-blue-500 border-gray-200"
          >
            <div className="h-2 w-2 rounded-full bg-blue-500" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg font-semibold text-gray-700"
          >
            Loading posts...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      {listPosts.length > 0 ? (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {listPosts.map((post) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Post
                comments={post?.commentCount}
                like={post?.likeCount}
                fullName={post?.author?.name}
                createdAt={post?.createdAt}
                content={post?.content}
                image={post?.imageUrl}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-500 py-16"
        >
          <p className="text-lg font-medium">No posts available yet.</p>
          <p className="mt-2">Be the first to share something!</p>
        </motion.div>
      )}

      {/* ✅ Loading khi fetch thêm (không gây re-render toàn trang) */}
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
