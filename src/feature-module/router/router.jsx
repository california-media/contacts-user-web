import React, { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router";
import { authRoutes, publicRoutes } from "./router.link";
import Feature from "../feature";
import AuthFeature from "../authFeature";
import Login from "../auth/login";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { all_routes } from "./all_routes";
import { fetchProfile } from "../../core/data/redux/slices/ProfileSlice";
import { fetchTags } from "../../core/data/redux/slices/TagSlice";
import { useDispatch } from "react-redux";
import PrivateRoute from "./PrivateRoute";

const ALLRoutes = () => {
  const location = useLocation();
    const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const route = all_routes;
  // Find the current route in either public or auth routes
  const currentRoute = publicRoutes.find(route => route.path === location.pathname) || 
                       authRoutes.find(route => route.path === location.pathname);

  // Construct the full title
  const fullTitle = currentRoute?.title 
    ? `${currentRoute.title} | Contacts Web`
    : "Contacts Web";

  useEffect(() => {
    document.title = fullTitle;
  }, [fullTitle]);
  useEffect(()=>{
  const token = localStorage.getItem("token");
  if(token){
    // navigate(route.dashboard);
      dispatch(fetchProfile());
      dispatch(fetchTags());
  }
  },[])

  return (
    <>
      <Helmet>
        <title>{fullTitle}</title>
      </Helmet>
      {/* <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<Feature />}>
          {publicRoutes.map((route, idx) => (
            <Route path={route.path} element={route.element} key={idx} />
          ))}
        </Route>
        <Route element={<AuthFeature />}>
          {authRoutes.map((route, idx) => (
            <Route path={route.path} element={route.element} key={idx} />
          ))}
        </Route>
      </Routes> */}
 <Routes>
        {/* Public Route - Login */}
        <Route path="/" element={<Login />} />

        {/* Private Routes */}
       <Route
          path="/*"
          element={
            <PrivateRoute>
              <Routes>
                <Route element={<Feature />}>
                  {publicRoutes.map((route, idx) => (
                    <Route path={route.path} element={route.element} key={idx} />
                  ))}
                </Route>
                <Route element={<AuthFeature />}>
                  {authRoutes.map((route, idx) => (
                    <Route path={route.path} element={route.element} key={idx} />
                  ))}
                </Route>
              </Routes>
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
};

export default ALLRoutes;
