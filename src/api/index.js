import axios from "axios";

//call api from backend
export const getProject = async () => {
  const response = await axios.get(`http://localhost:3001/project`);
  return response.data;
};

export const loginUserAPI = async (email, password) => {
  try {
    const response = await axios.post(`http://localhost:3001/sessions/login`, {
      email: email,
      password: password,
    });
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

// export const signUpUserAPI = async (email, password, )
