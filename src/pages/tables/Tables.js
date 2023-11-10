import React from "react";
import { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import MUIDataTable from "mui-datatables";

// components
import PageTitle from "../../components/PageTitle";
import Widget from "../../components/Widget";
import Table from "../dashboard/components/Table/Table";
// data
import { getProject, updateProjectAPI } from "../../api";

import Modal from 'react-modal';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import './styles.css';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

// Modal.setAppElement('#yourAppElement');


export default function Tables() {
  const [projectData, setProjectData] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    async function getProjectData() {
      try {
        const result = await getProject();
        if(result !== undefined)
        {
          const arrays = [];
          result.map(item => arrays.push([
          item.user_id,
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

    const handleRowClick = (rowData, rowMeta) => {
      console.log(rowData, rowMeta);
    };

    const handleSubmit = async () => {
      try {
        const updatedData = {
          id: selectedRow[1],
          user_id: selectedRow[0],
          name: name,
          description: description,
          location: location,
          quantity: quantity,
          start_date: selectedRow[6],
          end_date: selectedRow[7],
        };
        console.log(updatedData)
        const response = await updateProjectAPI(updatedData);
        setProjectData(projectData.map(project => {
          if(project[1] !== selectedRow[1]) {
            return project;
          }
          return [
            selectedRow[0],
            selectedRow[1],
            name,
            description,
            location,
            quantity,
            selectedRow[6],
            selectedRow[7]
          ]
        }));
        handleClose();
        console.log(response)
      }
      catch{

      }
    };

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
  
  const renderEditModal = () => {
    return (
      <Modal
        isOpen={open}
        onRequestClose={handleClose}
        style={customStyles}
        contentLabel="Example Modal"
      >        
        <form>
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
            <TextField  fullWidth label="Start Date" placeholder="Start Date" variant="outlined" />
          </Grid>
          <Grid item xs={6}>
            <TextField  fullWidth label="End Date" placeholder="End Date" variant="outlined" />
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
        </form>
      </Modal>
    )
  }

  const openModalToEdit = (value, metaData) => {
    setSelectedRow(metaData.rowData)
    setName(metaData.rowData[2])
    setDescription(metaData.rowData[3])
    setLocation(metaData.rowData[4])
    setQuantity(metaData.rowData[5])
    handleOpen();
  }
 return (
    <>
      {renderEditModal()}
      <PageTitle title="Admin Board" />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          {projectData
          ?
          <MUIDataTable
            title="Project List"
            data={projectData}
            columns={[{"name": "user_id", options: {display: false}},{"name": "id", options: {display: false}},"Name", "Description",  "Location", "Quantity", "Start Day", "End Day", {
              label: "Actions",
              options: {
                  customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                      <button  onClick={() => openModalToEdit(value, tableMeta) }>
                          Edit
                      </button>
                    )
                  }
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
