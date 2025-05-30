import UserCard from "@components/UserCard";
import { useSearchUserQuery } from "@services/rootApi";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

const SearchUserPage = () => {
  const location = useLocation();
  const { data, isLoading } = useSearchUserQuery({
    limit: 8,
    offset: 1,
    keyword: location?.state?.searchQuery,
  });

  if (isLoading) {
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
            Loading users...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  const listUsers = data?.data || [];

  let gridColsClass =
    "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
  if (listUsers.length === 1) {
    gridColsClass = "grid-cols-1";
  } else if (listUsers.length === 2) {
    gridColsClass = "grid-cols-2";
  }

  return (
    <div className="container flex-col mx-auto pt-2.5 items-center">
      {listUsers.length > 0 ? (
        <div className={`grid gap-4 justify-center ${gridColsClass}`}>
          {listUsers.map((user) => (
            <UserCard
              key={user._id}
              userId={user._id}
              fullName={user.name}
              requestStatus={user.requestStatus}
            />
          ))}
        </div>
      ) : (
        <p className="text-center font-semibold text-gray-600 mt-8">
          Không tìm thấy người dùng
        </p>
      )}
    </div>
  );
};

export default SearchUserPage;
