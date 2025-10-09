import { Navigate, Route } from "react-router";
import { all_routes } from "./all_routes";
import ContactDetails from "../crm/customers";
import Deals from "../crm/deals";
import DealsDetails from "../crm/deals/dealsDetails";
import DealsKanban from "../crm/deals/dealsKanban";
import ContactsDetails from "../crm/contacts";
import Login from "../auth/login";
import Register from "../auth/register";
import Templates from "../crm/templates/Templates";
import Profile from "../settings/generalSettings/profile";
import Security from "../settings/generalSettings/security";
import ContactList from "../crm/customers/customerList";
import Dashboard from "../crm/dashboard/Dashboard";
import AdminDashboard from "../crm/dashboard/AdminDashboard";
import LeadsKanban from "../crm/contacts/leadskanban";
import ContactGrid from "../crm/customers/customer-kanban";
import Whatsapp from "../crm/chat/Whatsapp";
import Pipeline from "../crm/pipeline";
import Groups from "../crm/groups/Groups";
import Contacts from "../crm/contacts/contacts";
import UpgradePlan from "../settings/generalSettings/upgradePlan";
import MyScans from "../settings/generalSettings/myScans";
import Emails from "../crm/emails/Emails";
import Calendar from "../crm/calendar/Calendar";
import EmailSetup from "../settings/generalSettings/emailSetup";
import ShareProfile from "../../core/common/shareProfile/ShareProfile";
import UserVerification from "../otherPages/UserVerification";
import PaymentSuccess from "../otherPages/PaymentSuccess";
import PostRegistrationForm from "../otherPages/PostRegistrationForm";
import ImportAndExport from "../crm/tools/ImportAndExport";
import Api from "../crm/tools/Api";
import SyncAndIntegration from "../crm/tools/SyncAndIntegration";
import Zapier from "../crm/tools/Zapier";
import ReferAndEarn from "../crm/support/ReferAndEarn";
import HelpAndSupport from "../crm/support/HelpAndSupport";
import MyTickets from "../crm/support/MyTickets";
import Users from "../crm/contacts/Users";
import AdminContactDetails from "../crm/contacts/AdminUserDetails";
import AdminUserDetails from "../crm/contacts/AdminUserDetails";
import ManagePlans from "../settings/generalSettings/ManagePlans";
import ManageTickets from "../settings/generalSettings/ManageTickets";
import ManageCoupons from "../settings/generalSettings/ManageCoupons";
import BillingInfo from "../settings/generalSettings/BillingInfo";
import InvoiceView from "../settings/generalSettings/InvoiceView";
import PaymentUnsuccessful from "../otherPages/PaymentUnsuccessful";
import EmbeddedCheckoutPage from "../otherPages/EmbeddedCheckoutPage";
import ResetPassword from "../auth/resetPassword";

const route = all_routes;

export const adminRoutes = [
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
    route: Route,
    title: "Admin Dashboard",
  },
  {
    path: route.adminCalendar,
    element: <Calendar />,
    route: Route,
    title: "Calendar",
  },
  {
    path: route.adminHelpAndSupport,
    element: <HelpAndSupport />,
    route: Route,
    title: "Help and Support",
  },
  {
    path: route.adminSecurity,
    element: <Security />,
    route: Route,
    title: "Security",
  },
  {
    path: route.users,
    element: <Users />,
    route: Route,
    title: "Users",
  },
  {
    path: route.adminProfile,
    element: <Profile />,
    route: Route,
    title: "Profile",
  },
  {
    path: route.adminProfile,
    element: <Security />,
    route: Route,
    title: "Security",
  },
  {
    path: route.adminUserDetails,
    element: <AdminUserDetails />,
    route: Route,
    title: "User Details",
  },
  {
    path: route.AdminApi,
    element: <Api />,
    route: Route,
    title: "Api",
  },
  {
    path: route.managePlans,
    element: <ManagePlans />,
    route: Route,
    title: "Manage Plans",
  },
  {
    path: route.manageTickets,
    element: <ManageTickets />,
    route: Route,
    title: "Manage Tickets",
  },
  {
    path: route.manageCoupons,
    element: <ManageCoupons />,
    route: Route,
    title: "Manage Coupons",
  },
];

export const publicRoutes = [
  {
    path: "/dashboard",
    name: "Root",
    element: <Dashboard />,
    route: Route,
    title: "Dashboard",
  },
  {
    path: route.calendar,
    element: <Calendar />,
    route: Route,
    title: "Calendar",
  },
  {
    path: route.HelpAndSupport,
    element: <HelpAndSupport />,
    route: Route,
    title: "Help and Support",
  },
  {
    path: route.security,
    element: <Security />,
    route: Route,
    title: "Security",
  },

  {
    path: route.leadsKanban,
    element: <LeadsKanban />,
    route: Route,
    title: "Leads Kanban",
  },
  {
    path: route.upgradePlan,
    element: <UpgradePlan />,
    route: Route,
    title: "Upgrade Plan",
  },
  {
    path: route.contactDetails,
    element: <ContactDetails />,
    route: Route,
    title: "Contact Details",
  },

  {
    path: route.deals,
    element: <Deals />,
    route: Route,
    title: "Deals",
  },
  {
    path: route.dealsDetails,
    element: <DealsDetails />,
    route: Route,
    title: "Deals Details",
  },
  {
    path: route.dealsKanban,
    element: <DealsKanban />,
    route: Route,
    title: "Deals Kanban",
  },
  {
    path: route.contactsDetails,
    element: <ContactsDetails />,
    route: Route,
    title: "Contacts Details",
  },
  {
    path: route.contacts,
    element: <Contacts />,
    route: Route,
    title: "Contacts",
  },
  {
    path: route.groups,
    element: <Groups />,
    route: Route,
    title: "Groups",
  },
  {
    path: route.templates,
    element: <Templates />,
    route: Route,
    title: "Templates",
  },
  {
    path: route.emails,
    element: <Emails />,
    route: Route,
    title: "Emails",
  },
  {
    path: route.calendar,
    element: <Calendar />,
    route: Route,
    title: "Calendar",
  },
  {
    path: route.registrationForm,
    element: <PostRegistrationForm />,
    route: Route,
    title: "Registration Form",
  },
  {
    path: route.scans,
    element: <MyScans />,
    route: Route,
    title: "Scans",
  },
  {
    path: route.profile,
    element: <Profile />,
    route: Route,
    title: "Profile",
  },
  {
    path: route.security,
    element: <Security />,
    route: Route,
    title: "Security",
  },
  {
    path: route.emailSetup,
    element: <EmailSetup />,
    route: Route,
    title: "Email Setup",
  },

  {
    path: route.dashboard,
    element: <Dashboard />,
    route: Route,
    title: "Dashboard",
  },
  {
    path: route.contactList,
    element: <ContactList />,
    route: Route,
    title: "Contact List",
  },
  {
    path: route.Whatsapp,
    element: <Whatsapp />,
    route: Route,
    title: "Whatsapp",
  },

  {
    path: route.contactGrid,
    element: <ContactGrid />,
    route: Route,
    title: "Contact Grid",
  },
  {
    path: route.pipeline,
    element: <Pipeline />,
    route: Route,
    title: "Pipeline",
  },
  {
    path: route.ImportAndExport,
    element: <ImportAndExport />,
    route: Route,
    title: "Import and Export",
  },
  {
    path: route.Api,
    element: <Api />,
    route: Route,
    title: "Api",
  },
  {
    path: route.SyncAndIntegration,
    element: <SyncAndIntegration />,
    route: Route,
    title: "Sync and Integration",
  },
  {
    path: route.Zapier,
    element: <Zapier />,
    route: Route,
    title: "Zapier",
  },
  {
    path: route.ReferAndEarn,
    element: <ReferAndEarn />,
    route: Route,
    title: "Refer and Earn",
  },
  {
    path: route.HelpAndSupport,
    element: <HelpAndSupport />,
    route: Route,
    title: "Help and Support",
  },
  {
    path: route.myTickets,
    element: <MyTickets />,
    route: Route,
    title: "My Tickets",
  },
  {
    path: route.biilingInfo,
    element: <BillingInfo />,
    route: Route,
    title: "Billing Info",
  },
  {
    path: route.invoiceView,
    element: <InvoiceView />,
    route: Route,
    title: "Invoice View",
  },
];

export const authRoutes = [
  {
    path: route.login,
    element: <Login />,
    route: Route,
    title: "Login",
  },
  {
    path: route.register,
    element: <Register />,
    route: Route,
    title: "Register",
  },
  {
    path:`${route.resetPassword}/:token`,
    element: <ResetPassword />,
    route: Route,
    title: "Reset Password",
  },
  {
    path: `${route.shareProfile}/:serialNumber`,
    element: <ShareProfile />,
    route: Route,
    title: "Share Profile",
  },

  {
    path: route.paymentSuccess,
    element: <PaymentSuccess />,
    route: Route,
    title: "Payment Success",
  },
  {
    path: route.paymentUnsuccessful,
    element: <PaymentUnsuccessful />,
    route: Route,
    title: "Payment Unsuccessful",
  },
  {
    path: route.embeddedCheckout,
    element: <EmbeddedCheckoutPage />,
    route: Route,
    title: "Embedded Checkout",
  },
];
