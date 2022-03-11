import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';

export default function Home() {
  return (
    <>
      <h2>Desenvolvimento WEB</h2>
      <Alert severity="info">
        <AlertTitle>Info</AlertTitle>
        Comece <strong>criando</strong> uma tarefa a ser concluída ou <strong>edite</strong> uma já existente
      </Alert>
      <p>Desenvolvido por Alexandre Silva</p>
    </>
  );
}