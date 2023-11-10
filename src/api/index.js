import axios from "axios";


//call api from backend
export const getProject = async () => {
	const response = await axios.get(
		`http://localhost:3000/project`
	);
     return response.data;
};



export const updateProjectAPI = async (projectData) => {
	const response = await axios.put(
		`http://localhost:3000/project/${projectData.id}`, projectData
	);
	return response.data
}