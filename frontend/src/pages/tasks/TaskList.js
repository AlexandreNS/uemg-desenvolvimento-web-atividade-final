import React, { useEffect, useState } from 'react';
import { format } from 'date-fns'
import api from '../../services/api';

import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import TaskTable from '../../components/TaskTable';

const initialItemForm = { title: '', concluded: false, description_task: '', deadline: '', priority: 0 };

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    flex: "1 auto"
  },
  centerMargin: {
    margin: "0 auto"
  }
}));

export default function TaskList() {
  const classes = useStyles();
  const [dataTable, setDataTable] = useState([]);
  const [alertError, setAlertError] = useState(false);
  const [alertErrorForm, setAlertErrorForm] = useState(false);
  const [itemForm, setItemForm] = useState(initialItemForm);
  const [validated, setValidated] = useState(false);
  const [openForm, setOpenForm] = useState(false);

  useEffect(() => {
    fetchNotesList();
  }, []);

  const fetchNotesList = async () => {
    try {
      const response = await api.get('/api/notes?order=concluded|asc,priority|desc,date_created|desc,id_note|desc');
      const tableData = response.data?.results;
      setDataTable([...tableData]);
    } catch (err) {
      setAlertError(true)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      setAlertErrorForm(true)
      return
    }

    try {
      const objSend = {
        title: itemForm.title,
        concluded: itemForm.concluded ? 1 : 0,
        description_task: itemForm.description_task,
        deadline: format(new Date(itemForm.deadline), 'yyyy-MM-dd HH:mm:ss'),
        priority: itemForm.priority
      }

      if (itemForm.id_notes) {
        await api.patch('/api/notes/' + itemForm.id_notes, {
          ...objSend,
        });
      } else {
        await api.post('/api/notes', {
          ...objSend,
          created: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
        });
      }
    } catch (err) {
      setAlertError(true)
    }

    setItemForm(initialItemForm);
    setValidated(false);
    setOpenForm(false);
    fetchNotesList();
  };

  const handleDelete = async (id_notes) => {
    try {
      await api.delete('/api/notes/' + id_notes);
    } catch (err) {
      setAlertError(true)
    }

    fetchNotesList();
  };

  const handleChange = event => {
    const field = event.target.name
    setItemForm({ ...itemForm, [field]: event.target.value })
  }

  const handleChangeChecked = event => {
    const field = event.target.name
    setItemForm({ ...itemForm, [field]: event.target.checked })
  }

  const handleClickOpenForm = () => {
    setOpenForm(true);
  };

  const handleClickOpenFormEdit = (idx) => {
    setItemForm({ ...dataTable[idx] })
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setItemForm(initialItemForm);
    setOpenForm(false);
  };

  const handleFormatDate = () => {
    try {
      return format(new Date(itemForm.deadline), "yyyy-MM-dd'T'HH:mm")
    } catch (err) {
      return ''
    }
  };

  return (
    <>
      {
        alertError ? (
          <Alert severity="error" onClose={() => setAlertError(false)}>
            Parece que houve algum erro para se conectar ao servidor :C !!!
          </Alert>
        ) : ('')
      }
      <Box alignItems="center" display="flex" p={1}>
        <Box p={1} flexGrow={1}>
          <h2>Lista de Tarefas</h2>
        </Box>
        <Box p={1}>
          <Button variant="contained" color="primary" onClick={handleClickOpenForm}>
            Criar&nbsp;&nbsp;Tarefa
          </Button>
        </Box>
      </Box>
      <TaskTable rows={dataTable} onClickEdit={handleClickOpenFormEdit} onClickDelete={handleDelete} />

      {/* Formulário de Cadastro */}
      <Dialog fullWidth={true} maxWidth='md' open={openForm} onClose={handleCloseForm} aria-labelledby="form-dialog-title">
        <form noValidate autoComplete="off" validated={validated ? 'validated' : undefined} onSubmit={handleSubmit}>
          <DialogTitle id="form-dialog-title">{itemForm.id_notes ? 'Editar Tarefa' : 'Criar nova Tarefa'}</DialogTitle>
          {
            alertErrorForm ? (
              <Alert severity="error" onClose={() => setAlertErrorForm(false)}>
                É necessário preencher todos os campos corretamente ;) !!!
              </Alert>
            ) : ('')
          }
          <DialogContent>
            <Grid
              container
              direction="column"
              alignItems="stretch"
            >
              <Grid
                container
                alignContent="space-around"
                direction="row"
                alignItems="baseline"
              >
                <FormControl className={classes.formControl}>
                  <TextField
                    fullWidth
                    required
                    autoFocus
                    margin="normal"
                    id="title"
                    name="title"
                    label="Título"
                    type="text"
                    value={itemForm.title}
                    onChange={handleChange}
                  />
                </FormControl>

                <FormControl className={classes.formControl}>
                  <TextField
                    required
                    id="deadline"
                    name="deadline"
                    label="Data Limite"
                    type="datetime-local"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={itemForm.deadline ? handleFormatDate(itemForm.deadline) : ''}
                    onChange={handleChange}
                  />
                </FormControl>

                <FormControl className={classes.formControl}>
                  <FormControlLabel
                    className={classes.centerMargin}
                    control={<Checkbox checked={itemForm.concluded} onChange={handleChangeChecked} name="concluded" />}
                    label="Tarefa Concluída"
                  />
                </FormControl>

              </Grid>
              <FormControl className={classes.formControl}>
                <InputLabel id="simple-select-label">Prioridade</InputLabel>
                <Select
                  required
                  labelId="simple-select-label"
                  id="priority"
                  name="priority"
                  value={itemForm.priority}
                  onChange={handleChange}
                  fullWidth
                >
                  <MenuItem value={0}>Baixa</MenuItem>
                  <MenuItem value={1}>Media</MenuItem>
                  <MenuItem value={2}>Alta</MenuItem>
                  <MenuItem value={3}>Urgente</MenuItem>
                </Select>
              </FormControl>

              <FormControl className={classes.formControl}>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={5}
                  variant="outlined"
                  margin="normal"
                  id="description_task"
                  name="description_task"
                  label="Descrição"
                  type="text"
                  value={itemForm.description_task}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button type="submit" color="primary">
              Salvar
            </Button>
            <Button onClick={handleCloseForm} color="primary">
              Cancelar
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}