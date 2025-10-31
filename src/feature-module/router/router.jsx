import React, { useContext, useEffect, useRef } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router";
import { adminRoutes, authRoutes, publicRoutes } from "./router.link";
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
import { fetchGoogleCalendarEvents } from "../../core/common/googleEvents/GoogleEvents";
import AdminRoute from "./AdminRoute";
import AdminFeature from "../AdminFeature";
import UserVerification from "../otherPages/UserVerification";

const ALLRoutes = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { toasts } = useSelector((state) => state.toast);

  const userProfile = useSelector((state) => state.profile);
  const routesWithoutFeature = ["/registration-form"];
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
      console.log("token found");
      dispatch(fetchProfile());
      dispatch(fetchTags());
    }
  }, []);
  useEffect(() => {
    if (userProfile.googleConnected) {
      fetchGoogleCalendarEvents(dispatch);
    }
  }, [userProfile.googleConnected]);

  return (
    <>
      <Helmet>
        <title>{fullTitle}</title>
      </Helmet>
      <Routes>
        {/* Public Route - Login */}
        <Route path="/" element={<Login />} />
        <Route path="/user-verification" element={<UserVerification />} />

        <Route element={<AuthFeature />}>
          {authRoutes.map((route, index) => (
            <Route path={route.path} element={route.element} key={index} />
          ))}
        </Route>

        {/* Admin Routes */}
        <Route
          element={
            <AdminRoute>
              <Routes>
                {adminRoutes.map((route, index) => {
                  // Skip routes with undefined paths
                  if (!route.path) return null;

                  const shouldUseFeature = !routesWithoutFeature.includes(
                    route.path.split("/")[1]
                      ? `/${route.path.split("/")[1]}`
                      : route.path
                  );

                  return shouldUseFeature ? (
                    <Route element={<AdminFeature />} key={index}>
                      <Route path={route.path} element={route.element} />
                    </Route>
                  ) : (
                    <Route
                      path={route.path}
                      element={route.element}
                      key={index}
                    />
                  );
                })}
              </Routes>
            </AdminRoute>
          }
        >
          {adminRoutes.map((route, index) => {
            if (!route.path) return null;

            const shouldUseFeature = !routesWithoutFeature.includes(
              route.path.split("/")[1]
                ? `/${route.path.split("/")[1]}`
                : route.path
            );

            return shouldUseFeature ? (
              <Route element={<Feature />} key={index}>
                <Route path={route.path} element={route.element} />
              </Route>
            ) : (
              <Route path={route.path} element={route.element} key={index} />
            );
          })}
        </Route>

        {/* Private Routes */}
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <Routes>
                {/* <Route element={<Feature />}>
                  {publicRoutes.map((route, index) => (
                    <Route
                      path={route.path}
                      element={route.element}
                      key={index}
                    />
                  ))}
                </Route> */}
                {publicRoutes.map((route, index) => {
                  // Skip routes with undefined paths
                  if (!route.path) return null;

                  const shouldUseFeature = !routesWithoutFeature.includes(
                    route.path.split("/")[1]
                      ? `/${route.path.split("/")[1]}`
                      : route.path
                  );

                  return shouldUseFeature ? (
                    <Route element={<Feature />} key={index}>
                      <Route path={route.path} element={route.element} />
                    </Route>
                  ) : (
                    <Route
                      path={route.path}
                      element={route.element}
                      key={index}
                    />
                  );
                })}
                {/* {publicRoutes.map((route, index) => {
                  const shouldUseFeature = !routesWithoutFeature.includes(
                    route.path.split("/")[1]
                      ? `/${route.path.split("/")[1]}`
                      : route.path
                  );

                  return shouldUseFeature ? (
                    <Route element={<Feature />} key={index}>
                      <Route path={route.path} element={route.element} />
                    </Route>
                  ) : (
                    <Route
                      path={route.path}
                      element={route.element}
                      key={index}
                    />
                  );
                })} */}
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
