import UserCard from "@components/UserCard";

const SearchUserPage = () => {
  return (
    <div className="container flex-col mx-auto  pt-2.5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 ">
        <UserCard />
        <UserCard />
        <UserCard />
        <UserCard />
        <UserCard />
        <UserCard />
      </div>
    </div>
  );
};

export default SearchUserPage;
