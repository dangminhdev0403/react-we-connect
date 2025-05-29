import { useUserInfo } from "@hooks/useUserInfo";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Avatar,
  Box,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { dialogSlice } from "@redux/slices/dialogSlice";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch } from "react-redux";

// ─────────────────────────────────────────────
// ImageUploader Component with Preview Support
// ─────────────────────────────────────────────
export const ImageUploader = ({ image, setImage }) => {
  // const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const selectedFile = acceptedFiles[0];
      setImage(selectedFile);
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    },
    [setImage]
  );

  const removeImage = () => {
    setImage(null);
    setPreviewUrl(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  return (
    <Box>
      {!image ? (
        <Box
          {...getRootProps()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-blue-500 transition"
          display="flex"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
        >
          <input {...getInputProps()} />
          <Box>
            <CloudUploadIcon color="action" fontSize="large" />
            <Typography variant="body2" color="textSecondary">
              {isDragActive
                ? "Drop the image here..."
                : "Drag & drop an image here, or click to select"}
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box className="relative border rounded-md p-2 mt-2 bg-gray-100">
          <img
            src={previewUrl}
            alt="preview"
            className="w-full max-h-60 object-contain rounded"
          />
          <IconButton
            size="small"
            className="absolute top-1 right-1"
            onClick={removeImage}
            sx={{ backgroundColor: "white" }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
          <Typography
            variant="caption"
            display="block"
            mt={1}
            textAlign="center"
          >
            {image.name}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

// ─────────────────────────────────────────────
// PostCreation Component (main export default)
// ─────────────────────────────────────────────
const PostCreation = () => {
  const userInfo = useUserInfo();
  const dispatch = useDispatch();

  const openPopup = () => {
    dispatch(
      dialogSlice.actions.openDialog({
        title: "What's on your mind?",
        dialogType: "postCreation",
        dialogProps: {
          userInfo,
        },
      })
    );
  };

  return (
    <Paper
      elevation={2}
      className="flex items-center gap-4 p-4 rounded-md hover:shadow-md transition "
    >
      <Avatar sx={{ width: 40, height: 40 }}>
        {userInfo.name?.[0]?.toUpperCase() || "U"}
      </Avatar>
      <TextField
        className="flex-1"
        size="small"
        variant="outlined"
        placeholder="What's on your mind?"
        onClick={openPopup}
        inputProps={{ readOnly: true }}
        sx={{
          "& .MuiInputBase-root": {
            borderRadius: "999px",
            backgroundColor: "#f3f4f6",
            paddingLeft: 2,
          },
        }}
      />
    </Paper>
  );
};

export default PostCreation;
