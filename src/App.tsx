import React from "react";
import {
  AppBar,
  Box,
  Fab,
  Stack,
  Tab,
  Tabs,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import ScrollTop from "./components/basic/ScrollTop";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Outlet, useNavigate } from "react-router-dom";
import Pages from "./model/Pages";

function App() {
  const navigate = useNavigate();

  const [pageTabIdx, setPageTabIdx] = React.useState(0);

  React.useEffect(() => {
    navigate(`${Pages[pageTabIdx].link ?? "/"}`);
  }, [navigate, pageTabIdx]);

  return (
    <>
      <Box>
        <AppBar position="sticky">
          <Toolbar variant="dense" id="back-to-top-anchor">
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Pastry Fish V2
            </Typography>
          </Toolbar>
        </AppBar>
        <Stack
          direction="row"
          sx={{ overflowY: "auto", height: "calc(100vh - 48px)" }}
        >
          <Box sx={{ position: "sticky", top: 0 }}>
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={pageTabIdx}
              onChange={(_, idx) => setPageTabIdx(idx)}
              sx={{
                borderRight: 1,
                borderColor: "divider",
                height: "100%",
              }}
            >
              {Pages.map((page) => (
                <Tooltip title={page.title} placement="right" arrow>
                  <Tab
                    icon={page.icon}
                    sx={{
                      minWidth: "unset",
                    }}
                    key={page.title}
                  />
                </Tooltip>
              ))}
            </Tabs>
          </Box>
          <Outlet />
        </Stack>

        <ScrollTop>
          <Fab color="secondary" size="small" aria-label="scroll back to top">
            <KeyboardArrowUpIcon />
          </Fab>
        </ScrollTop>
      </Box>
    </>
  );
}

export default App;
