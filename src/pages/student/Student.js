import React, { useState } from "react";
import './styles.css';
import { useEffect } from "react";
import { getAllProjectsOfAllUnis, updateApplyProject, getUni } from "../../api";
import { Typography } from "@material-ui/core";
import { getProject } from "../../api";

export default function Student() {
  const [projects, setProjectData] = useState([]);
  const [unis, setUnis] = useState([]);
  const [projectApplied, setProjectApplied] = useState([]);

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

  const handleAccept = async (projectId) => {
    await Promise.all([updateApplyProject(projectId), getProjectData()]);
  };
  const findUniOfProject = (project) => {
    const uni = unis.find(uniData => uniData.id === project.uni_id);
    return uni;
  }

  async function getProjectData() {
    try {
      const result = await getAllProjectsOfAllUnis();
      const appliedProjects = await getProject();
      const appliedProjectIds = appliedProjects.map(project => project.id);
      setProjectApplied(appliedProjectIds);
      setProjectData(result);
    } catch (error) {
      throw error; // Re-throw the error to handle it outside if needed
    }
  }
  useEffect(() => {
    const getAllData = async () => {
      await Promise.all([getProjectData(), getUniData()])
    }  
    getAllData();
  });

  return (
    <>
    {localStorage.getItem("role") === "0" ? (
    <>
      <div>
        <h1>Student Board</h1>
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
              <th style={{ width: '25%' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project, index) => {
              const uni = findUniOfProject(project)
              return (
                <tr key={project.id}>
                  <td>{index + 1}</td>
                  <td>{project.name}</td>
                  <td>{uni ? uni.name : ""}</td>
                  <td>{project.description}</td>
                  <td>{project.location}</td>
                  <td>{project.quantity}</td>
                  <td>{new Date(project.start_date).toLocaleDateString()}</td>
                  <td>{new Date(project.end_date).toLocaleDateString()}</td>
                  <td>
                    {project.is_checked === true && !projectApplied.includes(project.id)?
                        <button className="accept-btn" onClick={() => handleAccept(project.id)}>
                          Apply
                        </button>
                    :(
                      project.is_checked === true && projectApplied.includes(project.id))?<Typography style={{color:"red"}}>Applied</Typography> : <Typography style={{color:"blue"}}>Cannot apply now</Typography>}
                  </td>
                </tr>
              )
            }
            )}
          </tbody>
        </table>
      </div>
    </>
    ): (<h1>You don't have permission to access this page</h1>)
    }
    </>
  );
};

