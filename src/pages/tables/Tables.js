import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import React from "react";
import { useState, useEffect } from "react";
import { Grid, Typography, makeStyles } from "@material-ui/core";
import MUIDataTable from "mui-datatables";

import PageTitle from "../../components/PageTitle";
import { getProject, updateProjectAPI, deleteProject, addProject, getUni } from "../../api";
import Modal from 'react-modal';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import './styles.css';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { getStudentOfProject } from '../../api';
import { updateStudentRegisterd } from '../../api';
const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
}));

const handleAccept = async (projectId, userId) => {
  console.log(projectId, userId)
  const res = await updateStudentRegisterd(projectId, userId, true);
  console.log(res);
  await getStudentOfProject();
};

const handleReject = async (projectId, userId) => {
  const res = await updateStudentRegisterd(projectId, userId, false);
  console.log(res);
  await getStudentOfProject();
};

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: '50%',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

export default function Tables() {
  const [projectData, setProjectData] = useState([]);
  const [uniData, setUniData] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [quantity, setQuantity] = useState("");
  const [selectedRowIndex, setSelectedRowIndex] = useState(0);
  const [startDate, setStartDate] = useState(new Date('2014-08-18T21:11:54'))
  const [endDate, setEndDate] = useState(new Date('2014-08-18T21:11:54'))
  const classes = useStyles();
  const [openAdd, setOpenAdd] = useState(false);
  const [studentView, setStudentView] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState(1);
  const handleUniversityChange = (event) => {
    const selectedId = parseInt(event.target.value, 10);
    setSelectedUniversity(selectedId);
  };

  const getTableData = () => {
    return projectData.map((item) => {
      return [
        item.name,
        item.description,
        item.location,
        item.quantity,
        new Date(item.start_date).toLocaleDateString(),
        new Date(item.end_date).toLocaleDateString(),
      ];
    });
  };
  useEffect(() => {
    async function getProjectData() {
      try {
        const result = await getProject();
        if (result !== undefined) {
          setProjectData(result);
        }
      } catch (error) {
        console.error("Error fetching project data", error);
        throw error;
      }
    }
    getProjectData();
    getTableData();
    // [isEdited, getTableData]; useEffect dependencies
  } );


  useEffect(() => {
    async function getUniData() {
      try {
        const result = await getUni();
        if (result !== undefined) {
          setUniData(result);
        }

      } catch (error) {
        console.error("Error fetching uni data", error);
        throw error; // Re-throw the error to handle it outside if needed
      }
    }
    getUniData();
  }, []);

  async function getStudentOfProjectData() {
    try {
        const results = await Promise.all(projectData.map(async (item) => {
        
        const result = await getStudentOfProject(item.id);
        return result;
      }));
      const test = results.filter(item => item.length > 0)
      setStudentData(test.flat());
    } catch (error) {
      console.error("Error fetching student data", error);
      throw error; // Re-throw the error to handle it outside if needed
    }
  }

  useEffect(() => {
    getStudentOfProjectData();
  });



    const handleSubmit = async () => {
    try {
      const data = projectData[selectedRowIndex];
      const updatedData = {
        id: data.id,
        user_id: data.user_id,
        name: name,
        description: description,
        location: location,
        quantity: quantity,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
      };
      const response = await updateProjectAPI(updatedData);
      setProjectData(projectData.map((project, index) => {
        if (index === selectedRowIndex) {
          return {
            ...updatedData
          }
        }
        return project;
      }));
      handleClose();
      console.log(response)
    }
    catch {

    }
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    const projectData = {
      name: e.target.name.value,
      description: e.target.description.value,
      location: e.target.location.value,
      uni_id: selectedUniversity,
      start_date: e.target.startDate.value,
      end_date: e.target.endDate.value,
      quantity: e.target.capacity.value,
    };
    await addProject(projectData);
    setIsEdited(!isEdited);
    setOpenAdd(false);
  };

  const handleDeleteRow = async (rowsDeleted) => {
    const selectedRowData = rowsDeleted.data
    if (selectedRowData.length > 0) {
      try {
        await Promise.all(
          selectedRowData.map(async (item) => {
            const projectIdToDelete = projectData[item.index].id; // Assuming your project ID is in the first position
            await deleteProject(projectIdToDelete);
            setIsEdited(!isEdited);
          })
        );
        // setSelectedRowData([]);
      } catch (error) {
        console.error('Error deleting projects:', error);
      }
    }
  };
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleCloseAdd = () => {
    setOpenAdd(false);
    setSelectedUniversity(null);
  }


  const renderEditModal = () => {
    return (
      <Modal
        isOpen={open}
        onRequestClose={handleClose}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h2 id="simple-modal-title">Update Project</h2>
        <MuiPickersUtilsProvider utils={DateFnsUtils} spacing={2}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField value={name} onChange={(e) => setName(e.target.value)} fullWidth label="Name" placeholder="Name" variant="outlined" multiline />
            </Grid>
            <Grid item xs={12}>
              <TextField value={description} onChange={(e) => setDescription(e.target.value)} fullWidth label="Description" placeholder="Description" variant="outlined" multiline />
            </Grid>
            <Grid item xs={6}>
              <TextField value={location} onChange={(e) => setLocation(e.target.value)} fullWidth label="Location" placeholder="Location" variant="outlined" />
            </Grid>
            <Grid item xs={6}>
              <TextField value={quantity} onChange={(e) => setQuantity(e.target.value)} fullWidth label="Quantity" placeholder="Quantity" variant="outlined" />
            </Grid>
            <Grid item xs={6}>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="date-picker-inline"
                label="Start Date"
                value={startDate}
                onChange={setStartDate}
                KeyboardButtonProps={{ 'aria-label': 'change date', }}
              />
            </Grid>
            <Grid item xs={6}>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="date-picker-inline"
                label="End Date"
                value={endDate}
                onChange={setEndDate}
                KeyboardButtonProps={{ 'aria-label': 'change date', }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button onClick={handleSubmit} variant="contained" color="primary">
                Update
              </Button>
              <Button variant="contained" color="primary" onClick={handleClose}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </MuiPickersUtilsProvider>

      </Modal>
    )
  }

  const AddProjectModal = (
    <div className={classes.paper}>
      <h2 id="simple-modal-title">Add Project</h2>
      <form onSubmit={handleSubmitAdd}>
        <label for="lang">University</label>
        <select name="university" id="lang"
          value={selectedUniversity}
          onChange={handleUniversityChange}
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            width: '250px', // Adjust the width as needed
          }}
        >
          {uniData.map(item => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <TextField name="name" label="Name" variant="outlined" margin="normal" required fullWidth />
        <TextField name="description" label="Description" variant="outlined" margin="normal" required fullWidth />
        <TextField name="location" label="Location" variant="outlined" margin="normal" required fullWidth />
        <TextField name="capacity" label="Quantity" variant="outlined" margin="normal" type="number" required fullWidth />
        <TextField
          name="startDate"
          label="Start Date"
          variant="outlined"
          margin="normal"
          type="datetime-local"
          InputLabelProps={{ shrink: true, }}
          required
          fullWidth
        />
        <TextField
          name="endDate"
          label="End Date"
          variant="outlined"
          margin="normal"
          type="datetime-local"
          InputLabelProps={{ shrink: true, }}
          required
          fullWidth
        />
        <div style={{ display: 'flex' }}>
          <Button type="submit" variant="contained" color="primary" style={{ marginRight: '10px' }} onClick={() => { setIsEdited(!isEdited); }}>
            Submit
          </Button>
          <Button variant="contained" color="primary" onClick={handleCloseAdd}>
            Close
          </Button>
        </div>

      </form>
    </div>
  );

  const openModalToEdit = (value, metaData) => {
    console.log('openModalToEdit')
    console.log('value', value)
    console.log('metaData', metaData)
    const rowIndex = metaData.rowIndex;
    const data = projectData[rowIndex];
    setSelectedRowIndex(rowIndex)
    setName(data.name)
    setDescription(data.description)
    setLocation(data.location)
    setQuantity(data.quantity)
    setStartDate(new Date(data.start_date))
    setEndDate(new Date(data.end_date))
    handleOpen();
  }
  const findUniOfStudent = (id) => {
    const uni = uniData.find(item => item.id === id);
    return uni;
  }

  return (
    <>
      {localStorage.getItem("role") === "1" ? (
        <>
          {renderEditModal()}
          <PageTitle title="Community" />
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Button variant="contained" color="secondary" onClick={() => { setOpenAdd(true); }}
                style={{ marginRight: '10px' }}
              >Add Project</Button>
            <Button variant="contained" color="primary" onClick={() => { setStudentView(!studentView); }}
                style={{ marginRight: '10px' }}
              >Student-based View</Button>

              <Modal
                isOpen={openAdd}
                onRequestClose={handleCloseAdd}
              >
                {AddProjectModal}
              </Modal>
            </Grid>

            <Grid item xs={12}>
              {projectData && !studentView
                ?
                <MUIDataTable
                  title="Project List"
                  data={getTableData()}
                  columns={["Name", "Description", "Location", "Quantity", "Start Date", "End Date", {
                    label: "Actions",
                    options: {
                      customBodyRender: (value, tableMeta, updateValue) => {
                        return (
                          <button className="accept-btn" onClick={() => openModalToEdit(value, tableMeta)}>
                            Edit
                          </button>
                        )
                      },
                    }
                  }]}
                  options={{
                    filterType: "multiselect",
                    onRowsDelete: handleDeleteRow,
                  }}
                />
                :(studentData && studentView)?
                <div>
                <Typography>Registered Student</Typography>
                <table className="project-table">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>University</th>
                      <th>Registered Project</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentData.map((student, index) => {
                      const uni = findUniOfStudent(student.uni_id)
                      const nameOfProject = projectData.filter(item => item.id === student.project_id)[0].name
                      return (
                        <tr key={student.id}>
                          <td>{index + 1}</td>
                          <td>{student.name}</td>
                          <td>{student.email}</td>
                          <td>{uni ? uni.name : ""}</td>
                          <td>{nameOfProject}</td>
                          <td>{student.is_checked === null ? "Pending" : student.is_checked === true ? "Accepted" : "Rejected"}</td>
                          <td>
                            {student.is_checked === null ?
                              <>
                                <button disabled={student.is_checked != null} className="accept-btn" 
                                onClick={() => handleAccept(student.project_id,22)}
                                >
                                  Accept
                                </button>
                                <button disabled={student.is_checked != null} className="reject-btn" 
                                onClick={() => handleReject(student.project_id,22)}
                                >
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
                :<p><i>Loading...</i></p>}
            </Grid>
            {/* <Grid item xs={12}>
          <Widget title="Applied Student Table" upperTitle noBodyPadding>
            <Table data={mock.table} />
          </Widget>
        </Grid> */}
          </Grid>
        </>
      ) : (<h1>You don't have permission to access this page</h1>)
      }
    </>
  );
}
