import { ImageUploader } from "@components/PostCreation";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog as MuiDialog,
  TextField,
  Typography,
} from "@mui/material";
import { dialogSlice } from "@redux/slices/dialogSlice";
import { openSnackbar } from "@redux/slices/snackbarSlice";
import { useCreatePostMutation } from "@services/rootApi";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// Đổi tên từ PostCreation → PostDialogContent
const PostDialogContent = ({ userInfo }) => {
  const [createNewPost, { isLoading }] = useCreatePostMutation();
  const dispatch = useDispatch();

  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const handleCreatePost = async () => {
    try {
      const formData = new FormData();
      formData.append("content", content);
      formData.append("image", image);
      await createNewPost(formData).unwrap();
      dispatch(dialogSlice.actions.closeDialog());
      dispatch(openSnackbar({ message: "Create post successfully!" }));
    } catch (error) {
      const errorMessage =
        error?.data?.message || error?.message || "Something went wrong";
      dispatch(openSnackbar({ type: "error", message: errorMessage }));
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar sx={{ width: 40, height: 40 }}>
          {userInfo?.name?.[0]?.toUpperCase() || "?"}
        </Avatar>
        <Typography fontWeight="bold">{userInfo?.name}</Typography>
      </Box>

      <TextField
        value={content}
        onChange={(e) => setContent(e.target.value)}
        multiline
        minRows={3}
        fullWidth
        placeholder="What's on your mind?"
        sx={{
          backgroundColor: "#f9fafb",
          borderRadius: 2,
        }}
      />

      <ImageUploader image={image} setImage={setImage} />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleCreatePost}
        disabled={isLoading}
      >
        {isLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Đăng bài"
        )}
      </Button>
    </Box>
  );
};

const DynamicContent = ({ dialogType, additionalProps }) => {
  switch (dialogType) {
    case "postCreation":
      return <PostDialogContent userInfo={additionalProps.userInfo} />;
    default:
      return <Typography>No content available.</Typography>;
  }
};

const Dialog = () => {
  const dialog = useSelector((state) => state.dialog);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(dialogSlice.actions.closeDialog());
  };

  return (
    <MuiDialog
      open={dialog.open}
      maxWidth={dialog.maxWidth || "sm"}
      fullWidth={dialog.fullWidth ?? true}
      onClose={handleClose}
    >
      {dialog.title && <DialogTitle>{dialog.title}</DialogTitle>}

      <DialogContent dividers>
        <DynamicContent
          dialogType={dialog.dialogType}
          additionalProps={dialog.dialogProps}
        />
      </DialogContent>

      {dialog.action && <DialogActions>{dialog.action}</DialogActions>}
    </MuiDialog>
  );
};

export default Dialog;
