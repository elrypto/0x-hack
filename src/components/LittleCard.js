
import React from "react";

import ReactTable from "react-table";
import "react-table/react-table.css";



export default class LittleCard extends React.Component {

  render() {
    //console.log(typeof this.props.online_now != 'undefined'))

    /*  display: flex;
        flex-direction: column-reverse;
*/

    return(
    <React.Fragment>

          <ReactTable
            data={this.props.portfolio}
            columns={[
              {
                Header: "Portfolio",
                columns: [
                  {
                    Header: 'Icon',
                    accessor: 'token_icon',
                    Cell: row => (
                      <div>
                        <img height="45" width="45" src={row.value} alt="" class="mr-2 rounded"/>
                      </div>
                    )
                  },
                  {
                    Header: "Allocation %",
                    accessor: "alloc_perc"   
                  },
                  {
                    Header: "Token",
                    accessor: "token_name"
                  },
                  {
                    Header: "Token",
                    accessor: "token_name"
                  },
                  {
                    Header: "More Information",
                    accessor: "more_info"
                  }
                ]
              } 
            ]}
            defaultPageSize={5}
            className="-striped -highlight"
          />

    </React.Fragment>
  );}
}

