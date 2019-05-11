import React from 'react';
import styled from 'styled-components';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import MaterialSelect from '@material-ui/core/Select';
import { firestore } from '../firebase';

const Select = ({
  title,
  name,
  onChange,
  allowNone,
  data,
  value,
}: {
  title: string;
  name: string;
  onChange: (e: any) => void;
  allowNone: boolean;
  data: any;
  value: any;
}) => {
  return (
    <FormControl fullWidth>
      <InputLabel htmlFor={name}>{title}</InputLabel>
      <MaterialSelect
        value={value}
        onChange={onChange}
        inputProps={{
          name: name,
          id: name,
        }}
      >
        {allowNone && (
          <MenuItem key="-1" value="-1">
            None
          </MenuItem>
        )}
        {data.map(item => (
          <MenuItem key={item.id} value={item.id}>
            {item.name}
          </MenuItem>
        ))}
      </MaterialSelect>
    </FormControl>
  );
};

export default Select;
