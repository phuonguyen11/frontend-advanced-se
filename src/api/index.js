import axios from "axios";


//call api from backend
export const getProject = async () => {
	const response = await axios.get(
		// `https://abc-summer.azurewebsites.net/project/
		// `
		`https://abc-summer.azurewebsites.net/projects`
	);
     return response.data;
};

export const getUni = async () => {
	const response = await axios.get(
		// `https://abc-summer.azurewebsites.net/uni/
		// `
		`https://abc-summer.azurewebsites.net/unis/
		`
	);
     return response.data;
};

export const getAbility = async () => {
	const response = await axios.get(
		`https://abc-summer.azurewebsites.net/ability/
		`
	);
     return response.data;
};



export const updateProjectAPI = async (projectData) => {
	const response = await axios.put(
		`https://abc-summer.azurewebsites.net/projects
		`, projectData
	);
	return response.data
}

export const deleteProject = async (projectId) => {
	try {
		const response = await axios.delete(`https://abc-summer.azurewebsites.net/projects/
		${projectId}`);
		console.log(response.data.message); // Log the success message
	} catch (error) {
	  console.error('Error deleting project:', error);
	  throw error;
	}
  };

  export const addProject = async (projectData) => {
	try {
		const response = await axios.post(`https://abc-summer.azurewebsites.net/projects
		`, projectData);
		console.log(response.data.message); // Log the success message
	} catch (error) {
	  console.error('Error creating project');
	  throw error;
	}
  };

  export const updateProjectChecked = async (project_id, isChecked) => {
	const response = await axios.put(`https://abc-summer.azurewebsites.net/project/${project_id}/isChecked`, {isChecked});
	return response.data
}

// export const getProjectUnis = async () => {
// 	const response = await axios.get(`https://abc-summer.azurewebsites.net/project/project-unis`);
// 	return response.data 
// }