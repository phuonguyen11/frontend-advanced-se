import React from "react";
import { useState, useEffect } from "react";
import { Grid, Button, Modal, TextField, makeStyles, Snackbar} from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';

import MUIDataTable from "mui-datatables";



// components
import PageTitle from "../../components/PageTitle";
// data
import { getProject, deleteProject } from "../../api";

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

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}




export default function Tables() {
  const [projectData, setProjectData] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const classes = useStyles();
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Name:', e.target.name.value);
    console.log('Location:', e.target.location.value);
    console.log('Capacity:', e.target.capacity.value);
    console.log('StartDate:', e.target.startDate.value);
    console.log('EndDate:', e.target.endDate.value);
  };

  const handleEdit = () => 
  {
    if(selectedRowData.length !== 1)
    {
      setOpenSnackBar(true);
    }
    else
      setOpenEdit(true);
  }

  const AddProjectModal = (
    <div className={classes.paper}>
      <h2 id="simple-modal-title">Add Project</h2>
      <form onSubmit={handleSubmit}>
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
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Submit
        </Button>
      </form>
    </div>
  );

  const EditProjectModal = (
    <div className={classes.paper}>
      <h2 id="simple-modal-title">Edit Project</h2>
      <form onSubmit={handleSubmit}>
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
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Submit
        </Button>
      </form>
    </div>
  );

  
  useEffect(() => {
    async function getProjectData() {
      try {
        const result = await getProject();
        if(result !== undefined)
        {
          const arrays = [];
          result.map(item => arrays.push([
          item.id,
          item.name,
          item.description,
          item.location,
          item.quantity,
          item.start_date,
          item.end_date,
        ]));
        setProjectData(arrays);
        }
    
      } catch (error) {
        console.error("Error fetching project data", error);
        throw error; // Re-throw the error to handle it outside if needed
      }  
    }
    getProjectData();
    }, []);

    const handleDeleteRow = async () => {
      if (selectedRowData.length > 0) {
        try {
          await Promise.all(
            selectedRowData.map(async (item) => {
              const projectIdToDelete = item[0]; // Assuming your project ID is in the first position
              await deleteProject(projectIdToDelete);
            })
          );
          setSelectedRowData([]);
        } catch (error) {
          console.error('Error deleting projects:', error);
        }
      }
    };
  
   return (
    <>
      <PageTitle title="Admin Board" />
      <Grid container spacing={4}>
        <Grid item xs={12}>
        <Button variant="contained" color="secondary" onClick={() => {setOpenAdd(true);}}
        style={{marginRight: '10px'}}
        >Add Project</Button>
        <Modal
        open={openAdd}
        onClose={() => {setOpenAdd(false);}}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {AddProjectModal}
        </Modal>
        <Button variant="contained" color="primary" onClick={handleEdit}>Edit Project</Button>
        <Snackbar open={openSnackBar}  onClose={() => {setOpenSnackBar(false);}}
        anchorOrigin={{ vertical: 'top', horizontal: 'right'}}
        autoHideDuration={1000}
        >
        <Alert onClose={() => {setOpenSnackBar(false);}} severity="error">
        {selectedRowData.length === 0
            ? 'Please choose one row to edit!'
            : 'You can only edit one row at a time!'}
        </Alert>
        </Snackbar>
        <Modal
        open={openEdit}
        onClose={() => {setOpenEdit(false);}}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        >
        {EditProjectModal}
        </Modal>


        </Grid>
        <Grid item xs={12}>
          {projectData
          ?
          <MUIDataTable
            title="Project List"
            data={projectData}
            columns={["Id", "Name", "Description",  "Location", "Quantity", "Start Day", "End Day"]}
            options={{
              filterType: "multiselect",
              selectableRowsOnClick: true,
              onRowsSelect: (currentRowsSelected, allRowsSelected) => {
                setSelectedRowData((prev) => [
                  ...prev,
                  ...currentRowsSelected.map((selectedRow) => projectData[selectedRow.dataIndex])
                ]);
                console.log(selectedRowData.length, "hihiihi");
              },
            onRowsDelete: handleDeleteRow,

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
