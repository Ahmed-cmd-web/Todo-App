import './App.css'
import {
  Alert,
  Button,
  Container,
  Snackbar,
  Stack,
  TextField,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import TodoItem from './components/TodoItem/TodoItem'
import AppDialog from './components/AppDialog/AppDialog'
import { useEffect, useRef, useState } from 'react'
import { getTodos } from './services'

function App() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchWord, setSearchWord] = useState('')
  const [data, setData] = useState([])
  const [dataSource, setDataSource] = useState(data)
  const [alert, setAlert] = useState({
    type: 'success',
    message: 'Success!',
    open: false,
    onClose: function () {
      setAlert({ ...alert, open: false })
    },
  })

  const searchBar = useRef(null)
  const filter = (word) => {
    setSearchWord(word)
    setDataSource(
      data.filter((e) =>
        Object.keys(e).some((k) =>
          String(e[k]).toUpperCase().includes(word.toUpperCase())
        )
      )
    )
  }

  const reloadData = () =>
    getTodos()
      .then(({ data }) => {
        setData(data)
        setDataSource(data)
        searchBar.current.value = ''
      })
      .catch((e) => console.log(e))

  const notify = (type = 'success', message) => {
    setAlert({ ...alert, type, message, open: true })
  }

  useEffect(() => {
    reloadData()
  }, [])
  return (
    <div className='App'>
      <AppDialog
        isOpen={isOpen}
        isEditing={false}
        setIsOpen={() => setIsOpen(!isOpen)}
        reloadData={reloadData}
        openNotification={notify}
      />
      <Container
        maxWidth='lg'
        disableGutters
        sx={{ display: 'flex', justifyContent: 'space-evenly' }}
      >
        <TextField
          ref={searchBar}
          placeholder='Search any item...'
          onChange={(e) => filter(e.target.value)}
        />
        <Button
          variant='contained'
          title='Add item'
          size='large'
          startIcon={<AddIcon />}
          onClick={() => setIsOpen(true)}
        >
          Add Item
        </Button>
      </Container>
      <Stack
        direction={'column'}
        sx={{ overflowY: 'scroll', maxHeight: '100%', width: '100%' }}
        spacing={1}
      >
        {dataSource.map((e, i) => (
          <TodoItem
            key={i}
            searchWord={searchWord}
            {...e}
            reloadData={reloadData}
            openNotification={notify}
          />
        ))}
      </Stack>
      <Snackbar autoHideDuration={3000} {...alert}>
        <Alert severity={alert.type} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default App
