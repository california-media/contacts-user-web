import React, { useContext, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router";
import { authRoutes, publicRoutes } from "./router.link";
import Feature from "../feature";
import AuthFeature from "../authFeature";
import Login from "../auth/login";
import { Helmet } from "react-helmet-async";
import { all_routes } from "./all_routes";
import { fetchProfile } from "../../core/data/redux/slices/ProfileSlice";
import { fetchTags } from "../../core/data/redux/slices/TagSlice";
import { useDispatch, useSelector } from "react-redux";
import PrivateRoute from "./PrivateRoute";
import { Toast } from "react-bootstrap";
import { hideToast } from "../../core/data/redux/slices/ToastSlice";
import { GoogleAuthContext } from "../../core/common/context/GoogleAuthContext";
import { fetchGoogleCalendarEvents } from "../../core/common/googleEvents/GoogleEvents";
const ALLRoutes = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { toasts } = useSelector((state) => state.toast);
  console.log(toasts, "toastss");

  const { isGoogleSignedIn } = useContext(GoogleAuthContext);

  const route = all_routes;
  // Find the current route in either public or auth routes
  const currentRoute =
    publicRoutes.find((route) => route.path === location.pathname) ||
    authRoutes.find((route) => route.path === location.pathname);

  // Construct the full title
  const fullTitle = currentRoute?.title
    ? `${currentRoute.title} | Contacts Web`
    : "Contacts Web";

  useEffect(() => {
    document.title = fullTitle;
  }, [fullTitle]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // navigate(route.dashboard);
      console.log("fetching profile...");

      dispatch(fetchProfile());
      dispatch(fetchTags());
    }
  }, []);
  useEffect(() => {
    if (isGoogleSignedIn) {
      fetchGoogleCalendarEvents(dispatch);
    }
  }, [isGoogleSignedIn]);

  return (
    <>
      <Helmet>
        <title>{fullTitle}</title>
      </Helmet>
      <Routes>
        {/* Public Route - Login */}
        <Route path="/" element={<Login />} />
        <Route element={<AuthFeature />}>
          {authRoutes.map((route, idx) => (
            <Route path={route.path} element={route.element} key={idx} />
          ))}
        </Route>
        {/* Private Routes */}
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <Routes>
                <Route element={<Feature />}>
                  {publicRoutes.map((route, idx) => (
                    <Route
                      path={route.path}
                      element={route.element}
                      key={idx}
                    />
                  ))}
                </Route>
              </Routes>
            </PrivateRoute>
          }
        />
      </Routes>

      <div className="toast-container position-fixed top-0 end-0 p-3">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            show={true}
            onClose={() => dispatch(hideToast(toast.id))}
            delay={toast.delay}
            autohide
            className={`colored-toast bg-${toast.variant} text-white mb-2`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            {toast.heading ? (
              <Toast.Header
                closeButton
                className={`bg-${toast.variant} text-white`}
              >
                <strong className="me-auto">{toast.heading}</strong>
              </Toast.Header>
            ) : null}

            <Toast.Body className="d-flex justify-content-between align-items-start">
              <span>{toast.message}</span>
              {!toast.heading && (
                <button
                  type="button"
                  className="btn-close btn-close-white ms-3"
                  aria-label="Close"
                  onClick={() => dispatch(hideToast(toast.id))}
                ></button>
              )}
            </Toast.Body>
          </Toast>
        ))}
      </div>
    </>
  );
};

export default ALLRoutes;
