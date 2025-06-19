import { gapi } from "gapi-script";
import { mergeGoogleEvents } from "../../data/redux/slices/EventSlice";
import { useDispatch } from "react-redux";
const now = new Date();
  const oneYearLater = new Date();
  oneYearLater.setFullYear(now.getFullYear() + 1);
 export const fetchGoogleCalendarEvents = async (dispatch) => {

    try {
      const response = await gapi.client.calendar.events.list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        timeMax: oneYearLater.toISOString(),
        maxResults: 100,
        orderBy: "startTime",
      });

      const events = response.result.items.map((event) => ({
        title: event.summary || "Untitled",
        start: event.start?.dateTime || event.start?.date,
        end: event.end?.dateTime || event.end?.date,
        className: "bg-primary",
        googleEvent: true,
      }));

    //   setDefaultEvents(events);
      dispatch(mergeGoogleEvents(events));
    } catch (error) {
      console.error("Failed to fetch events from Google Calendar", error);
    }
  };
