import * as React from "react";
import ListIcon from "@mui/icons-material/List";
import InfoIcon from "@mui/icons-material/Info";
import FlowPage from "../page/Flow";
import About from "../page/About";

interface Page {
  icon: React.ReactElement;
  title: string;
  page: React.ReactElement;
  link?: string;
}

const TopPages: Page[] = [
  {
    icon: <ListIcon />,
    title: "Flow Page",
    page: <FlowPage />,
  },
  {
    icon: <InfoIcon />,
    title: "About Page",
    link: "about",
    page: <About />,
  },
];

export default TopPages;
