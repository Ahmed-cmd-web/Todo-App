import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import React, { useState } from 'react'
import './TodoItem.css'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AppDialog from '../AppDialog/AppDialog'
import Highlighter from 'react-highlight-words'
import { deleteTodo } from '../../services'

const TodoItem = (props) => {
  const {
    _id,
    title = 'Examplekjniunininniniferfrefkjnkjkjnkjn',
    description = 'Example',
    dueDate = '2023-04-02T00:00:00.000Z',
    creationDate = '2023-04-02T00:00:00.000Z',
    status = 'done',
    isLate = false,
    searchWord = '',
    reloadData,
    openNotification,
  } = props

  const [isOpen, setIsOpen] = useState(false)
  return (
    <Card>
      <AppDialog
        isEditing={true}
        {...props}
        isOpen={isOpen}
        setIsOpen={() => setIsOpen(false)}
        reloadData={reloadData}
      />
      <CardHeader
        title={title}
        component={() => (
          <Typography variant='h5' textOverflow={'ellipsis'} noWrap flex={1}>
            <Highlighter
              textToHighlight={title}
              searchWords={[String(searchWord)]}
              autoEscape
            />
          </Typography>
        )}
      />
      <CardContent
        sx={{
          textOverflow: 'ellipsis',
          overflow: 'scroll',
          maxHeight: '100px',
          flex: 1,
        }}
      >
        <Typography
          variant='body2'
          color='text.secondary'
          textOverflow={'ellipsis'}
          flex={1}
          noWrap
        >
          <Highlighter
            textToHighlight={description}
            searchWords={[String(searchWord)]}
            autoEscape
          />
        </Typography>
      </CardContent>
      <Stack
        divider={<Divider flexItem />}
        direction={'column'}
        minWidth={'max-content'}
        justifyContent={'space-evenly'}
        padding={'2px'}
      >
        <Typography>Due Date: {new Date(dueDate).toDateString()}</Typography>
        <Typography>
          Creation Date: {new Date(creationDate).toDateString()}
        </Typography>
        <Typography>Status: {status}</Typography>
        <Typography>
          Late: {isLate ? 'Yes,Brace yourself!' : 'Not yet...'}
        </Typography>
      </Stack>
      <Stack
        divider={<Divider flexItem />}
        direction={'column'}
        minWidth={'max-content'}
        justifyContent={'center'}
        padding={'2px'}
      >
        <IconButton title='Edit todo' onClick={() => setIsOpen(true)}>
          <EditIcon />
        </IconButton>
        <IconButton
          title='Delete Todo'
          onClick={async () => {
            try {
              await deleteTodo(_id)
              openNotification('success', 'Deleted successfully!')
              await reloadData()
            } catch (error) {
              openNotification('error', error.response.data)
              console.log(error)
            }
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Stack>
    </Card>
  )
}

export default TodoItem
