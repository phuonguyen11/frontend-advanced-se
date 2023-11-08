import axios from "axios";


//call api from backend
export const getProject = async () => {
	const response = await axios.get(
		`http://localhost:3000/project`
	);
     return response.data;
};

