"use client";

import {
  HomeOutlined,
  Hub,
  Lock,
  Message,
  People,
  TranslateOutlined,
} from "@mui/icons-material";
import {
  Drawer,
  List,
  ListSubheader,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { settingSlice } from "@redux/slices/settingSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const ListStyled = styled(List)`
  padding: 16px;
  border-radius: 16px;
  margin-bottom: 20px;
  background: linear-gradient(145deg, #ffffff, #f9fafb);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
`;

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  border-radius: 12px;
  text-decoration: none;
  color: #1f2937;
  font-weight: 500;
  font-size: 15px;
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(90deg, #eff6ff, #dbeafe);
    color: #1e40af;
    transform: translateX(6px);
  }

  &.active {
    background: linear-gradient(90deg, #3b82f6, #2563eb);
    color: #ffffff;
    font-weight: 600;

    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 24px;
      background: #ffffff;
      border-radius: 0 4px 4px 0;
      box-shadow: 0 0 8px rgba(37, 99, 235, 0.5);
    }
  }

  & .MuiSvgIcon-root {
    font-size: 22px;
    transition: all 0.3s ease;
  }

  &:hover .MuiSvgIcon-root {
    transform: scale(1.15);
    color: #1e40af;
  }

  &.active .MuiSvgIcon-root {
    color: #ffffff;
  }
`;

const StyledListSubheader = styled(ListSubheader)`
  padding: 10px 16px 14px 16px;
  font-weight: 600;
  font-size: 13px;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  line-height: 1.2;
  background: transparent;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: 8px;
    left: 16px;
    width: 40px;
    height: 1px;
    background: #d1d5db;
  }
`;

const SideBarContent = () => {
  const location = useLocation(); // Để xác định link đang active

  return (
    <motion.div
      className="w-64 flex flex-col"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Main Navigation */}
      <ListStyled>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <StyledLink
            to="/"
            className={location.pathname === "/" ? "active" : ""}
          >
            <HomeOutlined />
            <span>Trang chủ</span>
          </StyledLink>
          <StyledLink
            to="/messages"
            className={location.pathname === "/messages" ? "active" : ""}
          >
            <Message />
            <span>Tin nhắn</span>
          </StyledLink>
          <StyledLink
            to="/friends"
            className={location.pathname === "/friends" ? "active" : ""}
          >
            <People />
            <span>Bạn bè</span>
          </StyledLink>
          <StyledLink
            to="/groups"
            className={location.pathname === "/groups" ? "active" : ""}
          >
            <Hub />
            <span>Nhóm</span>
          </StyledLink>
        </motion.div>
      </ListStyled>

      {/* Settings */}
      <ListStyled>
        <StyledListSubheader>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            Cài đặt
          </motion.span>
        </StyledListSubheader>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <StyledLink
            to="/settings/account"
            className={
              location.pathname === "/settings/account" ? "active" : ""
            }
          >
            <Lock />
            <span>Tài khoản</span>
          </StyledLink>
          <StyledLink
            to="/settings/language"
            className={
              location.pathname === "/settings/language" ? "active" : ""
            }
          >
            <TranslateOutlined />
            <span>Ngôn ngữ</span>
          </StyledLink>
        </motion.div>
      </ListStyled>
    </motion.div>
  );
};

const Sidebar = () => {
  const isShowDrawer = useSelector((state) => state.setting.isShowDrawer);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return isMobile ? (
    <Drawer
      open={isShowDrawer}
      onClose={() => dispatch(settingSlice.actions.toggleDrawer())}
      PaperProps={{
        sx: {
          background: "linear-gradient(145deg, #ffffff, #f8fafc)",
          padding: "24px 16px",
          border: "none",
          width: "280px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
        },
      }}
      ModalProps={{
        keepMounted: true, // Giữ drawer trong DOM để cải thiện hiệu suất
      }}
      variants={{
        open: { x: 0, opacity: 1 },
        closed: { x: "-100%", opacity: 0 },
      }}
      initial="closed"
      animate={isShowDrawer ? "open" : "closed"}
      transition={{ duration: 0.4, ease: "easeOut" }}
      component={motion.div}
    >
      <SideBarContent />
    </Drawer>
  ) : (
    <motion.div
      className="p-6"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <SideBarContent />
    </motion.div>
  );
};

export default Sidebar;
