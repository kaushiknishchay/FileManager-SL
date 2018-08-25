import React, { Component } from 'react';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import MoreVertical from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';


import { addNewFile, addNewFolder, deleteItem, renameItem } from '../actions';


class TreeContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      modalOpen: false,
      renameModalOpen: false,
      newType: null,
      newName: null,
      folderId: null,
    };
  }

  handleClick = (event) => {
    event.preventDefault();
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleModalClose = () => {
    this.setState({
      anchorEl: null,
      folderId: null,
      modalOpen: false,
      newType: null,
      newName: null,
    });
  };

  handleRenameModalClose = () => {
    this.setState({
      anchorEl: null,
      folderId: null,
      renameModalOpen: false,
      newName: null,
    });
  };

  handleNewFile = (id) => {
    this.setState({
      folderId: id,
      modalOpen: true,
      newType: 'file',
      newName: null,
    });
  };

  handleNewFolder = (id) => {
    this.setState({
      folderId: id,
      modalOpen: true,
      newType: 'folder',
      newName: null,
    });
  };

  handleDeleteNode = (id) => {
    this.props.deleteItem(id);
    this.handleClose();
  };

  handleRenameNode = (id, name) => {
    this.setState({
      folderId: id,
      renameModalOpen: true,
      newName: name,
    });
  };

  handleNameChange = (e) => {
    this.setState({ newName: e.target.value || '' });
  };

  handleModalSubmit = () => {
    if (this.state.newType === 'file') {
      this.props.addNewFile(this.state.folderId, this.state.newName);
    } else {
      this.props.addNewFolder(this.state.folderId, this.state.newName);
    }
    this.handleModalClose();
  };

  handleRenameModalSubmit = () => {
    this.props.renameItem(this.state.folderId, this.state.newName);
    this.handleRenameModalClose();
  };

  render() {
    const {
      style, decorators, terminal, onClick, node,
    } = this.props;
    const { anchorEl } = this.state;

    if (node.deleted) {
      return null;
    }

    return (
      <React.Fragment>
        <ListItem button onClick={onClick}>
          <decorators.Toggle {...this.props} onClick={onClick} />
          <decorators.Header {...this.props} onClick={onClick} />

          <IconButton
            style={{
              zIndex: 999,
            }}
            aria-label="Actions"
            aria-owns={anchorEl ? `actionsMenu-${node.name}` : null}
            aria-haspopup="true"
            onClick={this.handleClick}
          >
            <MoreVertical />
          </IconButton>
          <Menu
            id={`actionsMenu-${node.name}`}
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={this.handleClose}
          >
            {
              (!node.fileType) &&
              ([
                <MenuItem
                  key="newFile"
                  onClick={() => this.handleNewFile(node.id)}
                >
                  New File
                </MenuItem>,
                <MenuItem
                  key="newFolder"
                  onClick={() => this.handleNewFolder(node.id)}
                >
                  New Folder
                </MenuItem>])
            }
            {
              !(node.name === '/') &&
              ([
                <MenuItem
                  key="rename"
                  onClick={() => this.handleRenameNode(node.id, node.name)}
                >
                  Rename
                </MenuItem>,
                <MenuItem
                  key="delete"
                  onClick={() => this.handleDeleteNode(node.id)}
                >
                  Delete
                </MenuItem>])
            }
          </Menu>
        </ListItem>

        <Dialog
          open={this.state.modalOpen}
          onClose={this.handleModalClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Enter Name</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Name"
              type="text"
              onChange={this.handleNameChange}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleModalClose}
              color="secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={this.handleModalSubmit}
              color="primary"
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.renameModalOpen}
          onClose={this.handleRenameModalClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Rename</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Name"
              type="text"
              value={this.state.newName || ''}
              onChange={this.handleNameChange}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleRenameModalClose}
              color="secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={this.handleRenameModalSubmit}
              color="primary"
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

TreeContainer.propTypes = {};

function initMapDispatchToProps(dispatch) {
  return bindActionCreators({
    addNewFile,
    addNewFolder,
    deleteItem,
    renameItem,
  }, dispatch);
}

export default connect(null, initMapDispatchToProps)(TreeContainer);
