import { useCallback, useState } from "react";

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
          sx={{
            border: "2px dashed #e2e8f0",
            borderRadius: "12px",
            padding: "32px 24px",
            cursor: "pointer",
            backgroundColor: "#fafafa",
            transition: "all 0.3s ease",
            "&:hover": {
              borderColor: "#3b82f6",
              backgroundColor: "#f8fafc",
              transform: "translateY(-2px)",
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.15)",
            },
            "&:active": {
              transform: "translateY(0px)",
            },
          }}
          display="flex"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
        >
          <input {...getInputProps()} />
          <Box>
            <CloudUploadIcon
              sx={{
                fontSize: 48,
                color: isDragActive ? "#3b82f6" : "#9ca3af",
                marginBottom: 2,
                transition: "color 0.3s ease",
              }}
            />
            <Typography
              variant="body1"
              sx={{
                color: isDragActive ? "#3b82f6" : "#6b7280",
                fontWeight: 500,
                fontSize: "15px",
                transition: "color 0.3s ease",
              }}
            >
              {isDragActive
                ? "Drop the image here..."
                : "Drag and drop the image here or click to select"}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "#9ca3af",
                fontSize: "13px",
                marginTop: 1,
                display: "block",
              }}
            >
              Supported formats: JPG, PNG, GIF (maximum 10MB){" "}
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            position: "relative",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "12px",
            marginTop: "8px",
            backgroundColor: "#f9fafb",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          <img
            src={previewUrl || "/placeholder.svg"}
            alt="preview"
            style={{
              width: "100%",
              maxHeight: "240px",
              objectFit: "contain",
              borderRadius: "8px",
              backgroundColor: "white",
            }}
          />
          <IconButton
            size="small"
            onClick={removeImage}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(4px)",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
              "&:hover": {
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                color: "#ef4444",
                transform: "scale(1.1)",
              },
              transition: "all 0.2s ease",
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
          <Typography
            variant="caption"
            sx={{
              display: "block",
              marginTop: 2,
              textAlign: "center",
              color: "#6b7280",
              fontSize: "12px",
              fontWeight: 500,
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              padding: "4px 8px",
              borderRadius: "6px",
              maxWidth: "200px",
              margin: "8px auto 0",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
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
      className="flex items-center gap-4 p-4 rounded-md hover:shadow-md transition mx-auto lg:min-w-2xl min-w-full "
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
