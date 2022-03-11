import { format } from 'date-fns';

import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Button from '@material-ui/core/Button';

function Row(props) {
  const { row } = props;

  return (
    <>
      <TableRow>
        <TableCell>{row.id}</TableCell>
        <TableCell style={{ width: "50%" }}>{row.title}</TableCell>
        <TableCell>{format(new Date(row.created), 'dd/MM/yyyy HH:mm:ss')}</TableCell>
        <TableCell>{format(new Date(row.deadline), 'dd/MM/yyyy HH:mm')}</TableCell>
        <TableCell>{row.concluded ? 'Sim' : 'Não'}</TableCell>
        <TableCell style={{ width: "50%" }} align='right'>
          <Button
            variant="contained"
            color="default"
            onClick={() => row.onClickEdit(row.id)}
          >
            Editar / Ver
          </Button>
          &nbsp;&nbsp;&nbsp;
          <Button
            variant="contained"
            color="secondary"
            onClick={() => row.onClickDelete(row.id_notes)}
          >
            Excluir
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function TaskTable(props) {
  const { rows = [], onClickEdit = () => { }, onClickDelete = () => { } } = props;

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Título</TableCell>
            <TableCell>Criado em</TableCell>
            <TableCell>Data Limite</TableCell>
            <TableCell>Completado</TableCell>
            <TableCell align='right'>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, idx) => (
            <Row key={idx} row={{ ...row, id: idx, onClickEdit, onClickDelete }} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}