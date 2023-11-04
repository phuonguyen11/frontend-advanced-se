import React from "react";
import { Grid } from "@material-ui/core";
import MUIDataTable from "mui-datatables";

// components
import PageTitle from "../../components/PageTitle";
import Widget from "../../components/Widget";
import Table from "../dashboard/components/Table/Table";

// data
import mock from "../dashboard/mock";

const datatableData = [
  ["Làm đường", "Đường bê tông", "Có sức khoẻ", "Đồng Nai","300","11-04-2023","12-04-2023"],
  ["Làm đường", "Đường bê tông", "Có sức khoẻ", "Đồng Nai","300","11-04-2023","12-04-2023"],
  ["Làm đường", "Đường bê tông", "Có sức khoẻ", "Đồng Nai","300","11-04-2023","12-04-2023"],
  
];

export default function Tables() {
  return (
    <>
      <PageTitle title="Tables" />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <MUIDataTable
            title="Project List"
            data={datatableData}
            columns={["Name", "Description", "Skill", "Location", "Quantity", "Start Day", "End Day"]}
            options={{
              filterType: "checkbox",
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Widget title="Applied Student Table" upperTitle noBodyPadding>
            <Table data={mock.table} />
          </Widget>
        </Grid>
      </Grid>
    </>
  );
}
