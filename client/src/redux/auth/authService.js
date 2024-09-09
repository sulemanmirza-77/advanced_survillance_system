import axios from "axios";

const HTTP_URL = "http://35.223.72.44/:5500/api/auth";

const register = async (userData) => {
  try {
    const response = await axios.post(`${HTTP_URL}/register`, userData);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const signIn = async (userData) => {
  try {
    const response = await axios.post(`${HTTP_URL}/login`, userData);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const logout = async () => {
  try {
    const response = await axios.get(`${HTTP_URL}/logout`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const authService = { register, signIn, logout };
export default authService;
