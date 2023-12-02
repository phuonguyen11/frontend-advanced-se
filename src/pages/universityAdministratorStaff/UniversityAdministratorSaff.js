import React, { useState } from "react";
import './UniversityAdminstratorStaff.css';
import { useEffect } from "react";
import { getProject, updateProjectChecked } from "../../api";

export default function UniversityAdministratorStaff() {
  const [projects, setProjectData] = useState([]);
  const [acceptedProjects, setAcceptedProjects] = useState([]);
  const [reload, setReload] = useState(1);
  const [rejectedProjects, setRejectedProjects] = useState([]);

  async function getProjectData2() {
    try {
      const result = await getProject();
      if(result !== undefined)
      {
        setProjectData(result);
      }
  
    } catch (error) {
      console.error("Error fetching project data", error);
      throw error; // Re-throw the error to handle it outside if needed
    }  
  }

  const handleAccept = async(projectId) => {
    const res = await updateProjectChecked(projectId, true);
    console.log(res);
    console.log("ok");
    getProjectData2();
  };

  const handleReject = async (projectId) => {
    const res = await updateProjectChecked(projectId, false);
    getProjectData2();
    console.log(res);
    console.log("ok");
  };

  useEffect(() => {
    async function getProjectData() {
      try {
        const result = await getProject();
        if(result !== undefined)
        {
          setProjectData(result);
        }
    
      } catch (error) {
        console.error("Error fetching project data", error);
        throw error; // Re-throw the error to handle it outside if needed
      }  
    }
    getProjectData();
    }, []);


  return (
    <div>
      <h2>Project List</h2>
      <table className="project-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Location</th>
            <th>Quantity</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => project.ischecked === null && (
            <tr key={project.id}>
              <td>{project.name}</td>
              <td>{project.description}</td>
              <td>{project.location}</td>
              <td>{project.quantity}</td>
              <td>{new Date(project.start_date).toLocaleDateString()}</td>
              <td>{new Date(project.end_date).toLocaleDateString()}</td>
              <td>
              
                <button className="accept-btn" onClick={() => handleAccept(project.id)}>
                  Accept
                </button>
                <button className="reject-btn" onClick={() => handleReject(project.id)}>
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      
    </div>
  );
};

