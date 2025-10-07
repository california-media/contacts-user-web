import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import OneSignal from "react-onesignal";

/**
 * Custom hook to manage OneSignal user authentication
 * Handles login/logout based on user authentication state
 */
const useOneSignalAuth = () => {
  const profile = useSelector((state) => state.profile);
  const { id, oneSignalExternalId, error } = profile;

  // Login user to OneSignal
  const loginOneSignalUser = useCallback(async () => {
    try {
      // Get External ID from Redux store or localStorage
      let externalId = oneSignalExternalId;

      if (!externalId) {
        externalId = localStorage.getItem("oneSignalExternalId");
      }

      // If still no external ID, generate one based on user ID
      if (!externalId && id) {
        externalId = `user_${id}`;
        localStorage.setItem("oneSignalExternalId", externalId);
      }

      if (externalId) {
        console.log("🔔 Logging into OneSignal with External ID:", externalId);
        await OneSignal.login(externalId);
        console.log("✅ OneSignal user login successful");

        // Optional: Store player ID for debugging (use correct API)
        const playerId = OneSignal.User.PushSubscription.id;
        console.log("📱 OneSignal Player ID:", playerId);

        return externalId;
      } else {
        console.warn("⚠️ No OneSignal External ID available for login");
        return null;
      }
    } catch (error) {
      console.error("❌ OneSignal user login failed:", error);
      return null;
    }
  }, [id, oneSignalExternalId]);

  // Logout user from OneSignal
  const logoutOneSignalUser = useCallback(async () => {
    try {
      console.log("🔔 Logging out from OneSignal");
      await OneSignal.logout();
      console.log("✅ OneSignal user logout successful");

      // Clear stored External ID
      localStorage.removeItem("oneSignalExternalId");
    } catch (error) {
      console.error("❌ OneSignal user logout failed:", error);
    }
  }, []);

  // Set up notification event listeners
  const setupNotificationListeners = useCallback(() => {
    try {
      // Helper function to log notification details
      const logNotificationDetails = (event, eventType) => {
        if (event.notification) {
          const notification = event.notification;
          console.log("Title:", notification.heading || notification.title);
          console.log("Content:", notification.body || notification.content);
        }
      };

      // Listen for notifications displayed in foreground
      OneSignal.Notifications.addEventListener(
        "foregroundWillDisplay",
        (event) => {
          logNotificationDetails(event, "received");
        }
      );

      console.log("✅ OneSignal notification listeners set up successfully");
    } catch (error) {
      console.error("❌ Failed to set up notification listeners:", error);
    }
  }, [id]);

  // Check OneSignal authentication status
  const checkOneSignalStatus = useCallback(async () => {
    try {
      // Use the correct API: OneSignal.User.externalId (property, not function)
      const externalUserId = OneSignal.User.externalId;
      const playerId = OneSignal.User.PushSubscription.id;

      console.log("OneSignal Status Check:", {
        externalUserId,
      });

      return {
        externalUserId,
        playerId,
        isLoggedIn: !!externalUserId,
      };
    } catch (error) {
      console.error("❌ OneSignal status check failed:", error);
      return {
        externalUserId: null,
        playerId: null,
        isLoggedIn: false,
      };
    }
  }, []);

  // Auto-login when user is authenticated and OneSignal is ready
  useEffect(() => {
    const autoLogin = async () => {
      // Only proceed if user is authenticated (has ID)
      if (!id || error) return;

      try {
        // Check if already logged in to OneSignal
        const status = await checkOneSignalStatus();

        if (!status.isLoggedIn) {
          // Not logged in, attempt login
          await loginOneSignalUser();
        } else {
          console.log("✅ User already logged into OneSignal");
        }

        // Set up notification listeners after login
        setupNotificationListeners();
      } catch (error) {
        console.error("❌ OneSignal auto-login failed:", error);
      }
    };

    // Delay to ensure OneSignal is initialized
    const timer = setTimeout(autoLogin, 2000);

    return () => clearTimeout(timer);
  }, [
    id,
    loginOneSignalUser,
    checkOneSignalStatus,
    setupNotificationListeners,
  ]);

  return {
    loginOneSignalUser,
    logoutOneSignalUser,
    checkOneSignalStatus,
    setupNotificationListeners,
  };
};

export default useOneSignalAuth;
