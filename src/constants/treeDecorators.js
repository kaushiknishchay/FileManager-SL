/* eslint-disable react/prop-types */
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import FolderIcon from '@material-ui/icons/Folder';
import InsertDriveFile from '@material-ui/icons/InsertDriveFile';
import React from 'react';
import TreeContainer from '../components/TreeContainer';


export default {
  Loading: props => (
    <ListItemText primary="loading..." style={props.style} />
  ),
  Toggle: (props) => {
    if (props.node.fileType) {
      return (
        <ListItemIcon style={props.style}>
          <InsertDriveFile />
        </ListItemIcon>
      );
    }
    if (props.node.toggled) {
      return (
        <ListItemIcon style={props.style} onClick={props.onClick}>
          <FolderOpenIcon />
        </ListItemIcon>
      );
    }
    return (
      <ListItemIcon style={props.style} onClick={props.onClick}>
        <FolderIcon />
      </ListItemIcon>
    );
  },
  Header: props => (
    <ListItemText primary={props.node.name} onClick={props.onClick} />
  ),
  Container: TreeContainer,
};
