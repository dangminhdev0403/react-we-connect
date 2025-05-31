import ChatBox from "@components/Chat/ChatBox";
import FriendRequest from "@components/FriendRequest/FriendRequest";
import PostCreation from "@components/PostCreation";
import PostList from "@components/PostList";
import Sidebar from "@components/Sidebar";

function HomePage() {
  return (
    <div className="flex bg-[#f8f7fa] pt-2">
      <div className="flex-shrink-0  h-fit sticky top-0">
        {" "}
        <Sidebar />
      </div>
      {/* Khu vực giữa */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* PostCreation cố định ở trên */}
        <div className=" bg-[#f8f7fa] z-10 pb-4 flex justify-center items-center  ">
          <PostCreation />
        </div>

        {/* PostList có thể cuộn */}
        <div className="flex-1 ">
          <PostList />
        </div>
      </div>
      {/* Sidebar phải - cố định */}
      <div className="w-64 hidden sm:block flex-shrink-0 top-0 h-fit sticky">
        <FriendRequest />
      </div>
      <div className="fixed bottom-5 right-5 z-50 flex gap-4">
        {[0, 1, 2].map((_, i) => (
          <div key={i} className="relative">
            <ChatBox />
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
