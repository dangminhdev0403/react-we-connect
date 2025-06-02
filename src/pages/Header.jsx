"use client";

import { useState } from "react";

import MyAvatar from "@components/Avatar/MyAvatar";
import { useUserInfo } from "@hooks/useUserInfo";
import {
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import {
  alpha,
  AppBar,
  Avatar,
  Badge,
  Box,
  Chip,
  ClickAwayListener,
  Divider,
  Grow,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { authSlice } from "@redux/slices/authSlice";
import { settingSlice } from "@redux/slices/settingSlice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

// Styled components
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
      "&:focus": {
        width: "30ch",
      },
    },
  },
}));

const Header = ({ darkMode, toggleDarkMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [searchSuggestionsOpen, setSearchSuggestionsOpen] = useState(false);
  const [searchAnchor, setSearchAnchor] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useUserInfo();

  // Mock data
  const notifications = [
    {
      id: 1,
      title: "New message from John",
      message: "Hey, how are you doing?",
      time: "2 min ago",
      read: false,
    },
    {
      id: 2,
      title: "Project update",
      message: "Your project has been approved",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      title: "Meeting reminder",
      message: "Team meeting at 3 PM",
      time: "2 hours ago",
      read: true,
    },
    {
      id: 4,
      title: "System maintenance",
      message: "Scheduled maintenance tonight",
      time: "1 day ago",
      read: true,
    },
  ];

  const searchSuggestions = [
    "Dashboard Analytics",
    "User Management",
    "Project Settings",
    "Team Collaboration",
    "Reports & Insights",
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Event handlers
  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleUserMenuClick = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    if (value.length > 0) {
      setSearchSuggestionsOpen(true);
      setSearchAnchor(event.currentTarget);
    } else {
      setSearchSuggestionsOpen(false);
    }
  };

  const handleSubmitSearch = (e) => {
    if (e.key === "Enter") {
      navigate(`/search/users`, {
        state: {
          searchQuery,
        },
      });
    }
  };

  const handleSearchFocus = (event) => {
    if (searchQuery.length > 0) {
      setSearchSuggestionsOpen(true);
      setSearchAnchor(event.currentTarget);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setSearchSuggestionsOpen(false);
  };

  const handleCloseMenus = () => {
    setNotificationAnchor(null);
    setUserMenuAnchor(null);
    setSearchSuggestionsOpen(false);
  };

  const handleLogout = () => {
    dispatch(authSlice.actions.logOut());
    navigate("/login");
  };
  return (
    <>
      <AppBar
        position="sticky"
        elevation={1}
        sx={{ bgcolor: "background.paper", color: "text.primary" }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Left side - Logo and Search */}

          <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
            <Link to="/">
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mr: 3 }}
              >
                <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32 }}>
                  <Typography variant="body2" fontWeight="bold">
                    WC
                  </Typography>
                </Avatar>
                {!isMobile && (
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    WeConnect
                  </Typography>
                )}
              </Box>
            </Link>

            {!isMobile && (
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search anything…"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  onKeyDown={handleSubmitSearch}
                  className="!border rounded-2xl border-gray-400"
                />
              </Search>
            )}
          </Box>

          {/* Right side - Actions */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {!isMobile && (
              <IconButton onClick={toggleDarkMode} color="inherit">
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            )}

            {/* Notifications */}
            <IconButton color="inherit" onClick={handleNotificationClick}>
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <MyAvatar
              name={userInfo.name}
              handleUserMenuClick={handleUserMenuClick}
            />
            {/* Mobile Menu - Sử dụng toggleDrawer từ props */}
            {isMobile && (
              <IconButton
                color="inherit"
                onClick={() => dispatch(settingSlice.actions.toggleDrawer())}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Search Suggestions Popper */}
      <Popper
        open={searchSuggestionsOpen}
        anchorEl={searchAnchor}
        placement="bottom-start"
        transition
        style={{ zIndex: 1300 }}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper sx={{ mt: 1, minWidth: 300 }}>
              <ClickAwayListener
                onClickAway={() => setSearchSuggestionsOpen(false)}
              >
                <MenuList>
                  <MenuItem disabled>
                    <Typography variant="caption" color="text.secondary">
                      Suggestions
                    </Typography>
                  </MenuItem>
                  {searchSuggestions
                    .filter((suggestion) =>
                      suggestion
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                    )
                    .slice(0, 5)
                    .map((suggestion, index) => (
                      <MenuItem
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <SearchIcon sx={{ mr: 2, fontSize: 16 }} />
                        {suggestion}
                      </MenuItem>
                    ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleCloseMenus}
      >
        <Box
          sx={{
            px: 2,
            py: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Notifications</Typography>
          {unreadCount > 0 && (
            <Chip label={`${unreadCount} new`} size="small" color="primary" />
          )}
        </Box>
        <Divider />
        {notifications.map((notification) => (
          <MenuItem
            key={notification.id}
            sx={{ flexDirection: "column", alignItems: "flex-start", py: 1.5 }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                mb: 0.5,
              }}
            >
              <Typography
                variant="subtitle2"
                fontWeight={notification.read ? "normal" : "bold"}
              >
                {notification.title}
              </Typography>
              {!notification.read && (
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    bgcolor: "primary.main",
                    borderRadius: "50%",
                  }}
                />
              )}
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              {notification.message}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {notification.time}
            </Typography>
          </MenuItem>
        ))}
        <Divider />
        <MenuItem sx={{ justifyContent: "center" }}>
          <Typography variant="body2" color="primary">
            View all notifications
          </Typography>
        </MenuItem>
      </Menu>

      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleCloseMenus}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2">{userInfo.name}</Typography>
          <Typography variant="caption" color="text.secondary">
            {userInfo.email}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={handleCloseMenus}>
          <PersonIcon sx={{ mr: 2 }} />
          Profile
        </MenuItem>
        <MenuItem onClick={handleCloseMenus}>
          <SettingsIcon sx={{ mr: 2 }} />
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <LogoutIcon sx={{ mr: 2 }} />
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default Header;
