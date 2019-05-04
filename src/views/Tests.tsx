import React, { useState } from 'react';
import styled from 'styled-components';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import './react-table.css';
import moment from 'moment';
import { Check, X } from 'react-feather';
import Checkbox from '../components/Checkbox';

const Wrapper = styled.div`
  padding: 15px;
`;

const TestsView = () => {
  const [selectAll, setSelectAll] = useState(false);
  const [state, setState] = useState({});
  const data = [
    {
      id: 1,
      name: 'Post comment actions closeevents are sent',
      state: 'ready',
      status: 'passed',
      lastRun: new Date(),
      modified: new Date(),
      component: 'Conversation',
      subComponent: 'Registration',
      // friend: {
      //   name: 'Jason Maurer',
      //   age: 23,
      // },
    },
    {
      id: 2,
      name: 'Second test',
      state: 'ready',
      status: 'failed',
      lastRun: new Date(),
      modified: new Date(),
      component: 'Conversation',
      subComponent: 'Registration',
    },
  ];

  const toggleRow = (id: string) => {
    setState({
      ...state,
      [id]: !state[id],
    });
  };

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);

    let newSelected = {};

    if (!selectAll) {
      data.forEach((row: any) => {
        newSelected[row.id] = true;
      });
    }

    setState(newSelected);
  };

  const columns = [
    {
      id: 'checkbox',
      accessor: '',
      Cell: ({ original }) => {
        return (
          <Checkbox
            checked={state[original.id] === true}
            onChange={() => toggleRow(original.id)}
          />
        );
      },
      Header: (x: any) => {
        return (
          <Checkbox
            checked={selectAll}
            // ref={input => {
            //   if (input) {
            //     input.indeterminate = this.state.selectAll === 2;
            //   }
            // }}
            onChange={() => toggleSelectAll()}
          />
        );
      },
      sortable: false,
      width: 60,
    },
    {
      id: 'id',
      Header: 'Id',
      accessor: 'id',
      width: 45,
    },
    {
      Header: 'Name',
      accessor: 'name',
    },
    // {
    //   Header: 'State',
    //   accessor: 'state',
    //   width: 70,
    // },
    {
      Header: 'Status',
      accessor: 'status',
      width: 70,
      Cell: (props: any) => (
        <span className="number">
          {props.value === 'passed' && <Check color="#554DF5" />}
          {props.value === 'failed' && <X color="#f44336" />}
        </span>
      ), // Custom cell components!
    },
    {
      Header: 'Last Run',
      id: 'lastRun',
      accessor: (d: any) => (
        <span className="number">{moment(d.lastRun).format('LLL')}</span>
      ),
      width: 200,
    },
    // {
    //   Header: 'Modified',
    //   accessor: 'modified',
    // },
    {
      Header: 'Component',
      accessor: 'component',
      width: 200,
    },
    {
      Header: 'Sub Component',
      accessor: 'subComponent',
      width: 200,
    },
    // {
    //   Header: 'Actions',
    //   accessor: (d: any) => <span>hey</span>,
    // },
    // {
    //   Header: 'Age',
    //   accessor: 'age',
    //   Cell: (props: any) => <span className="number">{props.value}</span>, // Custom cell components!
    // },
    // {
    //   id: 'friendName', // Required because our accessor is not a string
    //   Header: 'Friend Name',
    //   accessor: (d: any) => d.friend.name, // Custom value accessors!
    // },
    // {
    //   Header: (props: any) => <span>Friend Age</span>, // Custom header components!
    //   accessor: 'friend.age',
    // },
  ];

  return (
    <Wrapper>
      <ReactTable
        data={data}
        columns={columns}
        defaultSorted={[
          {
            id: 'id',
            asc: true,
          },
        ]}
      />
    </Wrapper>
  );
};

export default TestsView;
