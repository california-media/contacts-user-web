import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import OneSignal from "react-onesignal";

/**
 * Custom hook to manage OneSignal user authentication
 * Handles login/logout based on user authentication state
 */
const useOneSignalAuth = () => {
  const profile = useSelector((state) => state.profile);
  const { id, error } = profile;

  // Login user to OneSignal
  const loginOneSignalUser = useCallback(async () => {
    try {
      // Generate External ID dynamically from user ID
      if (!id || error) {
        console.warn("⚠️ No user ID available for OneSignal login");
        return null;
      }

      const externalId = `user_${id}`;

      console.log("Logging into OneSignal with External ID:", externalId);
      await OneSignal.login(externalId);
      console.log("✅ OneSignal user login successful");

      // Optional: Store player ID for debugging (use correct API)
      // const playerId = OneSignal.User.PushSubscription.id;
      // console.log("📱 OneSignal Player ID:", playerId);

      return externalId;
    } catch (error) {
      console.error("❌ OneSignal user login failed:", error);
      return null;
    }
  }, [id]);

  // Logout user from OneSignal
  const logoutOneSignalUser = useCallback(async () => {
    try {
      console.log("🔔 Logging out from OneSignal");
      await OneSignal.logout();
      console.log("✅ OneSignal user logout successful");
    } catch (error) {
      console.error("❌ OneSignal user logout failed:", error);
    }
  }, []);

  // Set up notification event listeners
  // const setupNotificationListeners = useCallback(() => {
  //   try {
  //     console.log("🎧 Setting up OneSignal notification listeners");

  //     // Helper function to log notification details
  //     const logNotificationDetails = (event, eventType) => {
  //       if (event.notification) {
  //         const notification = event.notification;
  //         console.log("Title:", notification.heading || notification.title);
  //         console.log("Content:", notification.body || notification.content);
  //       }
  //     };

  //     // Listen for notifications displayed in foreground
  //     OneSignal.Notifications.addEventListener(
  //       "foregroundWillDisplay",
  //       logNotificationDetails
  //     );

  //     console.log("✅ OneSignal notification listeners set up successfully");
  //   } catch (error) {
  //     console.error("❌ Failed to set up notification listeners:", error);
  //   }
  // }, []);

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
    let timeoutId;

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

        // Set up notification listeners after login (only once)
        // setupNotificationListeners();
      } catch (error) {
        console.error("❌ OneSignal auto-login failed:", error);
      }
    };

    // Delay to ensure OneSignal is initialized
    timeoutId = setTimeout(autoLogin, 2000);

    // Cleanup function
    return () => {
      // console.log("Cleaning up OneSignal listeners");
      // OneSignal.Notifications.removeEventListener("foregroundWillDisplay");
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [id, error]); // Removed functions from dependencies to prevent re-runs

  return {
    loginOneSignalUser,
    logoutOneSignalUser,
    checkOneSignalStatus,
    // setupNotificationListeners,
  };
};

export default useOneSignalAuth;
