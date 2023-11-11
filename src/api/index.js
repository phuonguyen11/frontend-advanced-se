import axios from "axios";

//call api from backend
export const getProject = async () => {
  const response = await axios.get(`http://localhost:7789/project`);
  return response.data;
};

export const deleteProject = async (projectId) => {
  try {
    const response = await axios.delete(
      `http://localhost:7789/project/${projectId}`,
    );
    console.log(response.data.message); // Log the success message
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};

export const addProject = async (projectData) => {
  try {
    const response = await axios.post(
      `http://localhost:7789/project`,
      projectData,
    );
    console.log(response.data.message); // Log the success message
  } catch (error) {
    console.error("Error creating project");
    throw error;
  }
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