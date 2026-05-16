import axios from "axios";

const BASE_URL = "http://localhost:3001/api";

export const createNotification = (data) =>
  axios.post(`${BASE_URL}/notifications`, data);

export const getNotifications = () =>
  axios.get(`${BASE_URL}/notifications`);

export const markAsRead = (id) =>
  axios.patch(`${BASE_URL}/notifications/${id}/read`);