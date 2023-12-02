import axios from "axios";


//call api from backend
export const getProject = async () => {
	const response = await axios.get(
		`https://gremer.azurewebsites.net/project`
	);
     return response.data;
};



export const updateProjectAPI = async (projectData) => {
	const response = await axios.put(
		`http://localhost:3000/project/${projectData.id}`, projectData
	);
	return response.data
}

export const updateProjectChecked = async (project_id, isChecked) => {
	const response = await axios.put(`https://gremer.azurewebsites.net/project/${project_id}/isChecked`, {isChecked});
	return response.data
}