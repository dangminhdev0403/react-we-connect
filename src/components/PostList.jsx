import Post from "@components/Post";
import { useGetAllPostsQuery } from "@services/rootApi";
import { motion } from "framer-motion";

const PostList = () => {
  const { data, isLoading, isFetching, isSuccess } = useGetAllPostsQuery();
  const listPost = data?.data || [];

  if (isLoading || isFetching) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
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
      {listPost.length > 0 ? (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {listPost.map((post) => (
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
    </div>
  );
};

export default PostList;
