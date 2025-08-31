import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    newNotification: (state, action) => {
      state.notifications = [action.payload, ...state.notifications];
    },
    addNotifications: (state, action) => {
      state.notifications = action.payload; // or append if needed
    },
    readNotification: (state, action) => {
      const notif = state.notifications.find(
        (n) => n._id.toString() === action.payload
      );
      if (notif) notif.isRead = true;
    },
    readAllNotificaion: (state) => {
      state.notifications.forEach(n => n.isRead = true);
    }
  },
});

export const selectUnreadCount = (state) =>
  state.notifications.notifications.filter((n) => !n.isRead).length;

export const { addNotifications, newNotification, readNotification, readAllNotificaion } =
  notificationSlice.actions;

export default notificationSlice.reducer;
