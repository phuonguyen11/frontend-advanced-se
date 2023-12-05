import React, { useState } from "react";
import './UniversityAdminstratorStaff.css';
import { useEffect } from "react";
import { getProject, updateProjectChecked, getUni, getProjectUnis } from "../../api";

export default function UniversityAdministratorStaff() {
  const [projects, setProjectData] = useState([]);
  const [unis, setUnis] = useState([]);
  const [selectedUni, setSelectedUni] = useState("");
  // const [acceptedProjects, setAcceptedProjects] = useState([]);
  // const [reload, setReload] = useState(1);
  // const [rejectedProjects, setRejectedProjects] = useState([]);

  const handleUniFilterChange = (event) => {
    setSelectedUni(event.target.value);
  };


  const handleAccept = async (projectId) => {
    const res = await updateProjectChecked(projectId, true);
    console.log(res);
    console.log("ok");
    await getProjectData();
  };

  const handleReject = async (projectId) => {
    const res = await updateProjectChecked(projectId, false);
    await getProjectData();
    console.log(res);
    console.log("ok");
  };

  async function getProjectData() {
    try {
      const result = await getProject();
      if (result !== undefined) {
        setProjectData(result);
      }

    } catch (error) {
      console.error("Error fetching project data", error);
      throw error; // Re-throw the error to handle it outside if needed
    }
  }

  async function getUniData() {
    try {
      const result = await getUni();
      if (result !== undefined) {
        setUnis(result);
      }

    } catch (error) {
      console.error("Error fetching project data", error);
      throw error; // Re-throw the error to handle it outside if needed
    }
  }

  const getAllData = async () => {
    await Promise.all([getProjectData(), getUniData()])
  }





  useEffect(() => {

    getAllData();

  }, []);

  const findUniOfProject = (project) => {
   
      const uni = unis.find(uniData => uniData.id === project.uni_id);
      console.log({ unis })
      return uni;

  }

  const getFilteredProject = () => {
    return projects.filter((project) => {
      if (selectedUni === "") {
        return project.is_checked === null;
      } else {
        // const uniOfProject = findUniOfProject(project);
        if (project.uni_id) {
          // console.log('selectedUni', selectedUni, uniOfProject, project, Number(uniOfProject.id) === Number(selectedUni));
          return project.is_checked === null && Number(project.uni_id) === Number(selectedUni);
        }
      }
    });
  }

  return (
    <>
      <div>
        <h1>University</h1>
        <h2>Project List</h2>
        <div>
          <label>Filter by Uni:</label>
          <select value={selectedUni} onChange={handleUniFilterChange}>
            <option value="">All</option>
            {unis.map((uni) => (
              <option key={uni.id} value={uni.id}>
                {uni.name}
              </option>
            ))}
          </select>
        </div>
        <table className="project-table">
          <thead>
            <tr>
              <th style={{ width: '17%' }}>Name</th>
              <th style={{ width: '10%' }}>Uni</th>
              <th style={{ width: '25%' }}>Description</th>
              <th style={{ width: '15%' }}>Location</th>
              <th style={{ width: '5%' }}>Quantity</th>
              <th style={{ width: '8%' }}>Start Date</th>
              <th style={{ width: '8%' }}>End Date</th>
              <th style={{ width: '25%' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {getFilteredProject().map((project) => {
              const uni = findUniOfProject(project)
              // console.log('project', project, uni)
              return (
                <tr key={project.id}>
                  <td>{project.name}</td>
                  {/* <td>{project.uni_id}</td> */}
                  <td>{uni ? uni.name : ""}</td>
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
              )
            }
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

