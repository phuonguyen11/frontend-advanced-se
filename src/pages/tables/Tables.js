import React from "react";
import { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import MUIDataTable from "mui-datatables";

// components
import PageTitle from "../../components/PageTitle";
import Widget from "../../components/Widget";
import Table from "../dashboard/components/Table/Table";
// data
import { getProject } from "../../api";

export default function Tables() {
  const [projectData, setProjectData] = useState([]);

  const getProjectData = async () => {
    try {
      const result = await getProject();
      // get role of user
      const role = localStorage.getItem("id_token");
      console.log(`role = ${role}`);

      console.log(result, "aaaaa");
      if (result !== undefined) {
        const arrays = [];
        result.map((item) =>
          arrays.push([
            item.name,
            item.description,
            item.location,
            item.quantity,
            item.start_date,
            item.end_date,
          ]),
        );
        setProjectData(arrays);
      }
    } catch (error) {
      console.error("Error fetching project data", error);
      throw error; // Re-throw the error to handle it outside if needed
    }
  };

  getProjectData();

  return (
    <>
      <PageTitle title="Admin Board" />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <MUIDataTable
            title="Project List"
            data={projectData}
            columns={[
              "Name",
              "Description",
              "Location",
              "Quantity",
              "Start Day",
              "End Day",
            ]}
            options={{
              filterType: "multiselect",
            }}
          />
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
