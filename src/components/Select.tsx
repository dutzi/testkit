import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';

export function mapData(data: any[]) {
  return data.map(item => ({ name: item.label, id: item.name }));
}

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
      <NativeSelect
        value={value}
        onChange={onChange}
        inputProps={{
          name: name,
          id: name,
        }}
      >
        {allowNone && (
          <option key="-1" value="-1">
            None
          </option>
        )}
        {data.map(item => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </NativeSelect>
    </FormControl>
  );
};

export default Select;
