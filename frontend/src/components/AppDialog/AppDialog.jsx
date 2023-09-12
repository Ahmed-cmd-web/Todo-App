import {
  Button,
  Dialog,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import React, { useState } from 'react'
import './AppDialog.css'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { createTodo, updateTodo } from '../../services'
import moment from 'moment'

const AppDialog = ({
  isOpen = false,
  isEditing,
  _id,
  title,
  description,
  dueDate,
  status,
  setIsOpen,
  reloadData,
  openNotification,
}) => {
  const [data, setData] = useState({
    title,
    description,
    dueDate: dueDate ?? moment(Date.now() + 1e6),
    status,
  })
  return (
    <Dialog
      open={isOpen}
      fullWidth
      maxWidth={'sm'}
      onClose={() => {
        setIsOpen()
        setData({ dueDate: dueDate ?? moment(Date.now() + 1e6) })
      }}
    >
      <Stack
        spacing={2}
        sx={{
          padding: '25px',
        }}
      >
        <Typography variant='h4'>
          {isEditing ? 'Edit Todo' : 'Add Todo'}
        </Typography>
        <Stack direction={'row'} spacing={1}>
          <TextField
            label='Title'
            defaultValue={title ?? ''}
            variant='standard'
            fullWidth
            onChange={(e) => setData({ ...data, title: e.target.value })}
          />
          <TextField
            label='Description'
            defaultValue={description ?? ''}
            variant='standard'
            fullWidth
            multiline
            onChange={(e) => setData({ ...data, description: e.target.value })}
          />
        </Stack>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <Stack direction={'row'} spacing={1}>
            <DateTimePicker
              label='Due Date'
              defaultValue={moment(data?.dueDate ?? Date.now() + 1e6)}
              minDateTime={moment(Date.now() + 1e5)}
              renderInput={(props) => (
                <TextField variant='standard' fullWidth {...props} />
              )}
              onChange={(e) => setData({ ...data, dueDate: e.toISOString() })}
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                onChange={(e) => setData({ ...data, status: e.target.value })}
                label='Status'
                value={status}
                placeholder='Status'
              >
                {['pending', 'done'].map((e, i) => (
                  <MenuItem value={e} key={i}>
                    {e}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </LocalizationProvider>
        <Button
          title={isEditing ? 'Finish Editing' : 'Add Todo'}
          variant='contained'
          fullWidth
          onClick={async () => {
            try {
              let res
              if (isEditing) res = await updateTodo(_id, data)
              else res = await createTodo(data)
              if (res.status === 200 || res.status === 201)
                openNotification(
                  'success',
                  `${isEditing ? 'Editing' : 'Creation'} Successful`
                )
              else openNotification('warning', `Something went wrong!`)
              await reloadData()
              setIsOpen()
              setData({ dueDate: dueDate ?? moment(Date.now() + 1e6) })
            } catch (error) {
              openNotification('error', error.response.data)
              console.log(error.response.data)
            }
          }}
        >
          {isEditing ? 'Finish Editing' : 'Add Todo'}
        </Button>
      </Stack>
    </Dialog>
  )
}

export default AppDialog
