import FriendRequest from "@components/FriendRequest";
import PostCreation from "@components/PostCreation";
import PostList from "@components/PostList";
import Sidebar from "@components/Sidebar";

function HomePage() {
  return (
    <div className=" flex gap-4 p-6 !bg-[#f8f7fa]  ">
      <Sidebar />
      <div className="flex-1">
        <PostCreation />
        <PostList />
      </div>
      <div className="w-64 hidden sm:block">
        <FriendRequest />
      </div>
    </div>
  );
}

export default HomePage;
