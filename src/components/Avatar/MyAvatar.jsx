import { IconButton } from "@mui/material";

const MyAvatar = ({ name, handleUserMenuClick, width = 32, height = 32 }) => {
  return (
    <IconButton onClick={handleUserMenuClick} color="inherit">
      <div
        style={{
          width,
          height,
          borderRadius: "50%",
          backgroundColor: "#ccc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
        }}
      >
        {name?.[0].toUpperCase()}
      </div>
    </IconButton>
  );
};

export default MyAvatar;
