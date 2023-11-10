import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
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
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';



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
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [quantity, setQuantity] = useState("");
  const [selectedRowIndex, setSelectedRowIndex] = useState(0);
  const [startDate, setStartDate] = useState(new Date('2014-08-18T21:11:54'))
  const [endDate, setEndDate] = useState(new Date('2014-08-18T21:11:54'))

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
