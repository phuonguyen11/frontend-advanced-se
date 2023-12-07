import axios from "axios";

//call api from backend
export const getAccessTokenHeader = () => {
  return {
    "access-token": localStorage.getItem("id_token"),
  };
};

export const getProject = async () => {
  const response = await axios.get(
    // `https://abc-summer.azurewebsites.net/project/
    // `
    `https://abc-summer.azurewebsites.net/projects/me`,
    {
      headers: getAccessTokenHeader(),
    },
  );
  return response.data.data;
};

export const getAllProjectsOfAllUnis = async () => {
  const response = await axios.get(
    // `https://abc-summer.azurewebsites.net/project/
    // `
    `https://abc-summer.azurewebsites.net/projects`,
    {
      headers: getAccessTokenHeader(),
    },
  );
  return response.data;
};

export const getUni = async () => {
  const response = await axios.get(
    // `https://abc-summer.azurewebsites.net/uni/
    // `
    `https://abc-summer.azurewebsites.net/unis/
		`,
  );
  return response.data;
};

export const getAbility = async () => {
  const response = await axios.get(
    `https://abc-summer.azurewebsites.net/ability/
		`,
  );
  return response.data;
};

export const loginUserAPI = async (email, password) => {
  try {
    const response = await axios.post(
      `https://abc-summer.azurewebsites.net/users/login`,
      {
        email: email,
        password: password,
      },
    );
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const registerUserAPI = async (userData) => {
  try {
    const response = await axios.post(
      `https://abc-summer.azurewebsites.net/users/signup`,
      userData,
    );
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const updateProjectAPI = async (projectData) => {
  const response = await axios.put(
    `https://abc-summer.azurewebsites.net/projects
		`,
    projectData,
    {
      headers: getAccessTokenHeader(),
    },
  );
  return response.data;
};

export const deleteProject = async (projectId) => {
  try {
    const response = await axios.delete(
      `https://abc-summer.azurewebsites.net/projects/
		${projectId}`,
      {
        headers: getAccessTokenHeader(),
      },
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
      `https://abc-summer.azurewebsites.net/projects
		`,
      projectData,
      {
        headers: getAccessTokenHeader(),
      },
    );
    console.log(response.data.message); // Log the success message
  } catch (error) {
    console.error("Error creating project");
    throw error;
  }
};

export const updateProjectChecked = async (project_id, isChecked) => {
  const response = await axios.put(
    `https://abc-summer.azurewebsites.net/projects/isChecked/${project_id}`,
    { isChecked },
    {
      headers: getAccessTokenHeader(),
    },
  );
  return response.data;
};

export const updateApplyProject = async (project_id) => {
  const response = await axios.post(
    `https://abc-summer.azurewebsites.net/project-user`,
    {project_id},
    {
      headers: getAccessTokenHeader(),
    },
  );
  return response.data;
};


