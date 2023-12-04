import axios from "axios";


//call api from backend
export const getProject = async () => {
	const response = await axios.get(
		`https://gremer.azurewebsites.net/project/
		`
	);
     return response.data;
};

export const getUni = async () => {
	const response = await axios.get(
		`https://gremer.azurewebsites.net/uni/
		`
	);
     return response.data;
};

export const getAbility = async () => {
	const response = await axios.get(
		`https://gremer.azurewebsites.net/ability/
		`
	);
     return response.data;
};



export const updateProjectAPI = async (projectData) => {
	const response = await axios.put(
		`https://gremer.azurewebsites.net/project
		`, projectData
	);
	return response.data
}

export const deleteProject = async (projectId) => {
	try {
		const response = await axios.delete(`https://gremer.azurewebsites.net/project/
		${projectId}`);
		console.log(response.data.message); // Log the success message
	} catch (error) {
	  console.error('Error deleting project:', error);
	  throw error;
	}
  };

  export const addProject = async (projectData) => {
	try {
		const response = await axios.post(`https://gremer.azurewebsites.net/project
		`, projectData);
		console.log(response.data.message); // Log the success message
	} catch (error) {
	  console.error('Error creating project');
	  throw error;
	}
  };

  export const updateProjectChecked = async (project_id, isChecked) => {
	const response = await axios.put(`https://gremer.azurewebsites.net/project/${project_id}/isChecked`, {isChecked});
	return response.data
}

export const getProjectUnis = async () => {
	const response = await axios.get(`https://gremer.azurewebsites.net/project/project-unis`);
	return response.data 
}