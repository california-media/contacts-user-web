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
import { EmailAuthContext } from "../../core/common/context/EmailAuthContext";
import { fetchGoogleCalendarEvents } from "../../core/common/googleEvents/GoogleEvents";
import AdminRoute from "./AdminRoute";
import { io } from "socket.io-client";
import AdminFeature from "../AdminFeature";
const ALLRoutes = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toasts } = useSelector((state) => state.toast);
  const userProfile = useSelector((state) => state.profile);
  const socketRef = useRef(null);

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
    const initializeApp = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          console.log("token found, fetching profile");

          // Fetch user profile and wait for completion
          const profileResult = await dispatch(fetchProfile()).unwrap();
          console.log("Profile fetched:", profileResult);

          // Fetch tags (non-blocking)
          dispatch(fetchTags());

          // Initialize socket connection if user role is "user"
          if (profileResult.data && profileResult.data.role === "user") {
            console.log("profile result id", profileResult.data.id);
            initializeUserSocket(profileResult.data.id);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          // Handle error - maybe redirect to login or show error message
          localStorage.removeItem("token");
          navigate("/");
        }
      }
    };

    initializeApp();

    // Cleanup socket on component unmount
    return () => {
      if (socketRef.current) {
        console.log("🔌 Cleaning up user socket connection");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [dispatch, navigate]);

  // Initialize socket connection for regular users
  const initializeUserSocket = (userId) => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    console.log("🔌 Initializing user socket connection for userId:", userId);

    const socket = io("http://localhost:3003", {
      transports: ["websocket", "polling"],
      timeout: 10000,
      query: {
        userId: userId,
      },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("🔌 User connected to socket server:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("🔌 User disconnected from socket server:", reason);
    });

    socket.on("connect_error", (error) => {
      console.error("🔌 User socket connection error:", error);
    });

    // Handle page visibility changes to maintain connection
    const handleVisibilityChange = () => {
      if (!document.hidden && socket.disconnected) {
        console.log("🔌 Page became visible, reconnecting socket");
        socket.connect();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Handle beforeunload to gracefully disconnect
    const handleBeforeUnload = () => {
      if (socket.connected) {
        socket.disconnect();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Store cleanup functions in socket for later removal
    socket._cleanupFunctions = [
      () =>
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        ),
      () => window.removeEventListener("beforeunload", handleBeforeUnload),
    ];
  };

  useEffect(() => {
    if (userProfile.googleConnected) {
      fetchGoogleCalendarEvents(dispatch);
    }
  }, [userProfile.googleConnected, dispatch]);

  // Clean up socket when user logs out (profile is reset)
  useEffect(() => {
    // If profile was reset (user logged out), disconnect socket
    if (!userProfile.id && socketRef.current) {
      console.log("🔌 Profile reset detected, disconnecting socket");

      // Clean up event listeners
      if (socketRef.current._cleanupFunctions) {
        socketRef.current._cleanupFunctions.forEach((cleanup) => cleanup());
      }

      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, [userProfile.id]);

  return (
    <>
      <Helmet>
        <title>{fullTitle}</title>
      </Helmet>
      <Routes>
        {/* Public Route - Login */}
        <Route path="/" element={<Login />} />
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
