import { axiosInstance } from "./axios";

export const getGoogleRedirectUrl = async () => {
  const response = await axiosInstance.get('/auth/google');
  const url = response?.data?.url;
  if (url) {
    window.location.href = url;
  }
}
