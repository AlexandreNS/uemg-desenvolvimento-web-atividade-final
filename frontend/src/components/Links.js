import React from 'react';
import { Link } from 'react-router-dom';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import HomeIcon from '@material-ui/icons/Home';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import InfoIcon from '@material-ui/icons/Info';

export const linksList = (
  <>
    <ListItem button component={Link} to="/">
      <ListItemIcon>
        <HomeIcon />
      </ListItemIcon>
      <ListItemText primary="Pagina Inicial" />
    </ListItem>
    <ListItem button component={Link} to="/tasks">
      <ListItemIcon>
        <NoteAddIcon />
      </ListItemIcon>
      <ListItemText primary="Tarefas" />
    </ListItem>
  </>
);

export const aboutLink = (
  <>
    <ListItem button component={Link} to="/sobre">
      <ListItemIcon>
        <InfoIcon />
      </ListItemIcon>
      <ListItemText primary="Sobre" />
    </ListItem>
  </>
);