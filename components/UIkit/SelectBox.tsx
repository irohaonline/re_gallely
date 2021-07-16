import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
  formcontrol: {
    width: '100%',
    minWidth: 120,
    marginBottom: 16,
  },
}));

type Props = {
  label: string;
  value: string;
  required: boolean;
  select: any;
  options: any;
};

const SelectBox: FC<Props> = (props: Props) => {
  const classes = useStyles();

  return (
    <FormControl className={classes.formcontrol}>
      <InputLabel>{props.label}</InputLabel>
      <Select
        value={props.value}
        required={props.required}
        onChange={(e) => props.select(e.target.value)}
      >
        {props.options.map((value) => {
          return (
            <MenuItem key={value.id} value={value.id}>
              {value.name}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default SelectBox;
