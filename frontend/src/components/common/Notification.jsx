import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addNotifications,
  readAllNotificaion,
  readNotification,
} from "../../store/slices/notificationSlice";

function Notification() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { notifications } = useSelector((state) => state.notifications);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notifications", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
        const data = await response.json();
        if (data.success) {
          dispatch(addNotifications(data.notifications));
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, [dispatch, token]);

  const handleMarkAsRead = async (id) => {
    try {
      const res = await fetch(`/api/notifications/mark-as-read/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        dispatch(readNotification(id));
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const res = await fetch(`/api/notifications/mark-all-as-read`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        dispatch(readAllNotificaion())
      }
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-900 min-h-screen pt-20">
      <div className="flex justify-between items-center mb-6 py-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white">Notifications</h1>
        {notifications.length > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="btn-save"
          >
            Mark All as Read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 mb-4 rounded-full bg-gray-800 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <p className="text-gray-400 text-lg font-medium">No notifications yet</p>
          <p className="text-gray-500 mt-1">We'll notify you when something arrives</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {notifications.map((notif) => (
            <li
              key={notif._id}
              className={`p-4 rounded-lg transition-all duration-200 ease-in-out ${notif.isRead
                ? "bg-gray-800 text-gray-400 border border-gray-700"
                : "bg-gray-800 font-medium text-white border-l-4 border-primary-500 shadow-lg"
                }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-start">
                    {!notif.isRead && (
                      <span className="flex h-2 w-2 mt-1.5 mr-3">
                        <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-primary-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                      </span>
                    )}
                    <span className={notif.isRead ? "text-gray-400" : "text-white font-semibold"}>
                      {notif.message}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(notif.createdAt).toLocaleString()}
                  </p>
                </div>
                {!notif.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(notif._id)}
                    className="ml-4 px-3 py-1 text-sm rounded-md bg-green-900/40 hover:bg-green-900/60 text-green-300 hover:text-green-200 font-medium transition-colors duration-200"
                    title="Mark as read"
                  >
                    Mark Read
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Notification;