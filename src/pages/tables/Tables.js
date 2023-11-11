import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import React from "react";
import { useState, useEffect } from "react";
import { Grid, makeStyles } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import MuiAlert from '@material-ui/lab/Alert';

// components
import PageTitle from "../../components/PageTitle";
import Widget from "../../components/Widget";
import Table from "../dashboard/components/Table/Table";
// data
import { getProject, updateProjectAPI, deleteProject, addProject, getUni, getAbility } from "../../api";

import Modal from 'react-modal';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import './styles.css';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

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

// Modal.setAppElement('#yourAppElement');



export default function Tables() {
  const [projectData, setProjectData] = useState([]);
  const [uniData, setUniData] = useState([]);
  const [abilityData, setAbilityData] = useState([]);

  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [quantity, setQuantity] = useState("");
  const [selectedRowIndex, setSelectedRowIndex] = useState(0);
  const [startDate, setStartDate] = useState(new Date('2014-08-18T21:11:54'))
  const [endDate, setEndDate] = useState(new Date('2014-08-18T21:11:54'))
  const [selectedRowData, setSelectedRowData] = useState([]);
  const classes = useStyles();
  const [openAdd, setOpenAdd] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState('');

  const handleUniversityChange = (event) => {
    setSelectedUniversity(event.target.value);
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
    }, [isEdited]);


    useEffect(() => {
      async function getUniData() {
        try {
          const result = await getUni();
          if(result !== undefined)
          {
            setUniData(result);
          }
      
        } catch (error) {
          console.error("Error fetching uni data", error);
          throw error; // Re-throw the error to handle it outside if needed
        }  
      }
      getUniData();
      console.log(uniData, "aaaaa")
      }, [openAdd]);
  
    
  



    const handleRowClick = (rowData, rowMeta) => {
      console.log(rowData, rowMeta);
    };

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
          if(index === selectedRowIndex) {
            return {
              ...updatedData
            }
          }
          return project;
        }));
        handleClose();
        console.log(response)
      }
      catch{

      }
    };

    const handleSubmitAdd = async (e) => {
      e.preventDefault();
      console.log(selectedUniversity);
      const projectData = {
      name: e.target.name.value,
      description: e.target.description.value, 
      location: e.target.location.value,
      user_id: 1,
      uni_ids: [selectedUniversity],
      start_date: e.target.startDate.value,
      end_date: e.target.endDate.value,
      quantity: e.target.capacity.value,
    };
    await addProject(projectData);
    setIsEdited(!isEdited);
    setOpenAdd(false);
    };

    const handleDeleteRow = async () => {
      if (selectedRowData.length > 0) {
        try {
          await Promise.all(
            selectedRowData.map(async (item) => {
              const projectIdToDelete = item[0]; // Assuming your project ID is in the first position
              console.log(projectIdToDelete)
              await deleteProject(projectIdToDelete);
              setIsEdited(!isEdited);
            })
          );
          setSelectedRowData([]);
        } catch (error) {
          console.error('Error deleting projects:', error);
        }
      }
    };




    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleCloseAdd = () =>
    {
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
      <MuiPickersUtilsProvider utils={DateFnsUtils} spacing={2}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
              <TextField value={name} onChange={(e) => setName(e.target.value)}  fullWidth label="Name" placeholder="Name" variant="outlined" multiline />
          </Grid>
          <Grid item xs={12}>
            <TextField value={description} onChange={(e) => setDescription(e.target.value)}  fullWidth label="Description" placeholder="Description" variant="outlined" multiline />
          </Grid>
          <Grid item xs={6}>
            <TextField value={location} onChange={(e) => setLocation(e.target.value)} fullWidth label="Location" placeholder="Location" variant="outlined" />
          </Grid>
          <Grid item xs={6}>
            <TextField value={quantity} onChange={(e) => setQuantity(e.target.value)}  fullWidth label="Quantity" placeholder="Quantity" variant="outlined" />
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
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
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
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              Submit
            </Button>
            <Button  variant="contained" color="primary" onClick={handleClose}>
              Close
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
          InputLabelProps={{
            shrink: true,
          }}
          required
          fullWidth
        />
        <TextField
          name="endDate"
          label="End Date"
          variant="outlined"
          margin="normal"
          type="datetime-local"
          InputLabelProps={{
            shrink: true,
          }}
          required
          fullWidth
        />
        <div style={{display: 'flex'}}>
        <Button type="submit" variant="contained" color="primary" style={{marginRight: '10px'}}  onClick={()=>{setIsEdited(!isEdited);}}>
          Submit
        </Button>
        <Button  variant="contained" color="primary" onClick={handleCloseAdd}>
              Close
            </Button>
            </div>

      </form>
    </div>
  );


  const getTableData = () => {
    return projectData.map(item => {
      return [
        item.name,
        item.description,
        item.location,
        item.quantity,
        new Date(item.start_date).toLocaleDateString(),
        new Date(item.end_date).toLocaleDateString(),
      ]
    })
  }

  const openModalToEdit = (value, metaData) => {
    console.log(value, metaData)
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
 return (
    <>
      {renderEditModal()}
      <PageTitle title="Admin Board" />
      <Grid container spacing={4}>
      <Grid item xs={12}>
        <Button variant="contained" color="secondary" onClick={() => {setOpenAdd(true);}}
        style={{marginRight: '10px'}}
        >Add Project</Button>
        {/* <Modal
        open={openAdd}
        onClose={() => {setOpenAdd(false);}}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        >
        {AddProjectModal}
        </Modal> */}
        
        <Modal
        isOpen={openAdd}
        onRequestClose={handleCloseAdd}
        >        
        {AddProjectModal}
        </Modal>
        </Grid>

        <Grid item xs={12}>
          {projectData
          ?
          <MUIDataTable
            title="Project List"
            data={getTableData()}
            columns={["Name", "Description",  "Location", "Quantity", "Start Day", "End Day", {
              label: "Actions",
              options: {
                  customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                      <button  onClick={() => openModalToEdit(value, tableMeta) }>
                          Edit
                      </button>
                    )
                  },
                  onRowsSelect: (currentRowsSelected, allRowsSelected) => {
                    setSelectedRowData((prev) => [
                      ...prev,
                      ...currentRowsSelected.map((selectedRow) => projectData[selectedRow.dataIndex])
                    ]);
                    console.log(selectedRowData.length, "hihiihi");
                  },
                onRowsDelete: handleDeleteRow,
    
              }
          }]}
            options={{
              filterType: "multiselect",
            }}
          />
          :
          <p><i>Loading...</i></p>}
        </Grid>
        {/* <Grid item xs={12}>
          <Widget title="Applied Student Table" upperTitle noBodyPadding>
            <Table data={mock.table} />
          </Widget>
        </Grid> */}
      </Grid>
    </>
  );
}
