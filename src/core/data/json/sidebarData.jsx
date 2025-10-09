import { useSelector } from "react-redux";
import { all_routes } from "../../../feature-module/router/all_routes";
import { IoMdCalendar, IoMdPeople, IoMdPricetag } from "react-icons/io";
const route = all_routes;

export const SidebarData = [
  {
    label: "MAIN MENU",
    submenuOpen: true,
    showSubRoute: false,
    submenuHdr: "Main",
    submenuItems: [
      {
        label: "Dashboard",
        iconImg: "/assets/img/icons/dashboardIcon.png",
        submenu: false,
        showSubRoute: false,

        submenuItems: [{ label: "Dashboard", link: route.dashboard }],
      },
      {
        label: "Contacts",
        iconImg: "/assets/img/icons/contactsIcon.png",
        submenu: false,
        showSubRoute: false,
        submenuItems: [
          {
            label: "Contacts Dashboard",
            link: route.contacts,
            icon: <IoMdPeople />,
          },
        ],
      },
      {
        label: "Calendar",
        iconImg: "/assets/img/icons/calendarIcon.png",
        submenu: false,
        showSubRoute: false,
        submenuItems: [{ label: "Calendar", link: route.calendar }],
      },
      {
        label: "Tickets",
        iconImg: "/assets/img/icons/helpAndSupport.png",
        submenu: false,
        showSubRoute: false,
        submenuItems: [{ label: "Tickets", link: route.myTickets }],
      },
    ],
  },
  {
    label: "TEMPLATES",
    submenuOpen: true,
    showSubRoute: false,
    submenuHdr: "Inventory",
    submenuItems: [
      {
        label: "Whatsapp",
        iconImg: "/assets/img/icons/whatsappIcon.png",
        submenu: false,
        showSubRoute: false,
        submenuItems: [
          { label: "Templates", link: `${route.templates}#whatsappTemplates` },
        ],
      },
      {
        label: "Email",
        iconImg: "/assets/img/icons/emailIcon.png",
        submenu: false,
        showSubRoute: false,
        submenuItems: [
          { label: "Templates", link: `${route.templates}#emailTemplates` },
        ],
      },
    ],
  },
  {
    label: "GROUPS",
    submenuOpen: true,
    showSubRoute: false,
    submenuHdr: "Inventory",
    submenuItems: [
      {
        label: "Family",
        icon: "ti ti-tag",
        submenu: false,
        showSubRoute: false,
        submenuItems: [{ label: "Groups", link: "" }],
      },
      {
        label: "Friends",
        icon: "ti ti-tag",
        submenu: false,
        showSubRoute: false,
        submenuItems: [{ label: "Groups", link: "" }],
      },
      {
        label: "Networking",
        icon: "ti ti-tag",
        submenu: false,
        showSubRoute: false,
        submenuItems: [{ label: "Groups", link: "" }],
      },
      {
        label: "Coworkers",
        icon: "ti ti-tag",
        submenu: false,
        showSubRoute: false,
        submenuItems: [{ label: "Groups", link: "" }],
      },
    ],
  },
  {
    label: "TOOLS",
    submenuOpen: true,
    showSubRoute: false,
    submenuHdr: "Inventory",
    submenuItems: [
      {
        label: "Sync & Integrations",
        icon: "ti ti-tag",
        submenu: false,
        showSubRoute: false,
        submenuItems: [{ label: "Groups", link: route.emailSetup }],
      },
      {
        label: "Import/export",
        iconImg: "/assets/img/icons/importAndExport.png",
        submenu: false,
        showSubRoute: false,
        submenuItems: [{ label: "Groups", link: route.ImportAndExport }],
      },
      {
        label: "API",
        iconImg: "/assets/img/icons/apiIcon.png",
        submenu: false,
        showSubRoute: false,
        submenuItems: [{ label: "Groups", link: route.Api }],
      },
      // {
      //   label: "Zapier",
      //   iconImg: "/assets/img/icons/zapierLogo.png",
      //   submenu: false,
      //   showSubRoute: false,
      //   submenuItems: [{ label: "Groups", link: route.Zapier }],
      // },
    ],
  },
  {
    label: "SCANS",
    submenuOpen: true,
    showSubRoute: false,
    submenuHdr: "Inventory",
    submenuItems: [
      {
        label: "My Scans",
        iconImg: "/assets/img/icons/scanIcon.png",
        submenu: false,
        showSubRoute: false,
        submenuItems: [{ label: "SCANS", link: `${route.scans}#myScans` }],
      },
      {
        label: "Scanned Me",
        iconImg: "/assets/img/icons/scanIcon.png",
        submenu: false,
        showSubRoute: false,
        submenuItems: [{ label: "SCANS", link: `${route.scans}#scannedMe` }],
      },
    ],
  },
  {
    label: "SUPPORT",
    submenuOpen: true,
    showSubRoute: false,
    submenuHdr: "Inventory",
    submenuItems: [
      {
        label: "Refer and Earn",
        iconImg: "/assets/img/icons/referAndEarn.png",
        submenu: false,
        showSubRoute: false,
        submenuItems: [{ label: "SUPPORT", link: route.ReferAndEarn }],
      },
      {
        label: "Help & Support",
        iconImg: "/assets/img/icons/helpAndSupport.png",
        submenu: false,
        showSubRoute: false,
        submenuItems: [{ label: "SUPPORT", link: route.HelpAndSupport }],
      },
      {
        label: "Settings",
        iconImg: "/assets/img/icons/settingIcon.png",
        submenu: false,
        showSubRoute: false,
        submenuItems: [{ label: "SUPPORT", link: route.security }],
      },
    ],
  },
];
