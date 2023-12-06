import React, { useState } from "react";
import './UniversityAdminstratorStaff.css';
import { useEffect } from "react";
import { getAllProjectsOfAllUnis, updateProjectChecked, getUni } from "../../api";

export default function UniversityAdministratorStaff() {
  const [projects, setProjectData] = useState([]);
  const [unis, setUnis] = useState([]);
  const uniOfStaff = localStorage.getItem("uni_id");


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
      const result = await getAllProjectsOfAllUnis();
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
    return uni;
  }

  const getFilteredProject = () => {
    return projects.filter((project) => {
      return Number(project.uni_id) === Number(uniOfStaff);
    });
  }

  return (
    <>
      {localStorage.getItem("role") === "2" ? (
        <>
          <div>
            <h1>University</h1>
            <h2>Project List</h2>
            <table className="project-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th style={{ width: '17%' }}>Name</th>
                  <th style={{ width: '10%' }}>Uni</th>
                  <th style={{ width: '25%' }}>Description</th>
                  <th style={{ width: '15%' }}>Location</th>
                  <th style={{ width: '5%' }}>Quantity</th>
                  <th style={{ width: '8%' }}>Start Date</th>
                  <th style={{ width: '8%' }}>End Date</th>
                  <th>Status</th>
                  <th style={{ width: '25%' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredProject().map((project, index) => {
                  const uni = findUniOfProject(project)
                  // console.log('project', project, uni)
                  return (
                    <tr key={project.id}>
                      <td>{index + 1}</td>
                      <td>{project.name}</td>
                      {/* <td>{project.uni_id}</td> */}
                      <td>{uni ? uni.name : ""}</td>
                      <td>{project.description}</td>
                      <td>{project.location}</td>
                      <td>{project.quantity}</td>
                      <td>{new Date(project.start_date).toLocaleDateString()}</td>
                      <td>{new Date(project.end_date).toLocaleDateString()}</td>
                      <td>{project.is_checked == null ? "Pending" : project.is_checked == true ? "Accepted" : "Rejected"}</td>
                      <td>
                        {project.is_checked == null ?
                          <>
                            <button disabled={project.is_checked != null} className="accept-btn" onClick={() => handleAccept(project.id)}>
                              Accept
                            </button>
                            <button disabled={project.is_checked != null} className="reject-btn" onClick={() => handleReject(project.id)}>
                              Reject
                            </button>
                          </>
                          : ""}
                      </td>
                    </tr>
                  )
                }
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (<h1>You don't have permission to access this page</h1>)
      }
    </>
  );
};

