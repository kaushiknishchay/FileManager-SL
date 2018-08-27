/* eslint-disable react/forbid-prop-types */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { Treebeard } from 'react-treebeard';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import SubDirRight from '@material-ui/icons/SubdirectoryArrowRight';
import DeleteIcon from '@material-ui/icons/Delete';
import { bindActionCreators } from 'redux';
import map from 'lodash/map';
import keys from 'lodash/keys';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import compact from 'lodash/compact';
import flattenDeep from 'lodash/flattenDeep';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField/TextField';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Button from '@material-ui/core/Button/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel/FormControlLabel';
import Switch from '@material-ui/core/Switch/Switch';
import FormGroup from '@material-ui/core/FormGroup/FormGroup';


import shortFolderData from './data/short.json';
import longFolderData from './data/long.json';
import './App.css';
import treeBeardStyles from './constants/treeBeardStyles';
import treeDecorators from './constants/treeDecorators';
import { changeStructure, restoreItem } from './actions';
import * as filters from './utils/filters';

import { persistor } from './store';


const drawerWidth = 350;

const styles = theme => ({
  root: {
    flex: 1,
    minHeight: 500,
    // height: '100vh',
    zIndex: 1,
    display: 'flex',
    overflow: 'scroll',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    minWidth: 0,
  },
  toolbar: theme.mixins.toolbar,
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterData: null,
      showRecycleBin: false,
      cursor: props.folderList,
      longData: false,
      // data2: props.folderList,
    };
  }


  componentDidMount() {
    if (this.props.folderList.name !== '/') {
      this.props.changeStructure({
        name: '/',
        toggled: true,
        children: this.convertFolderObj(shortFolderData),
      });
    }
  }

  getI = () => {
    this.index += 1;
    return this.index;
  };

  index = 1;

  handleLongShortChange = (event, checked) => {
    this.setState({
      longData: checked,
      cursor: null,
    }, () => {
      persistor.purge()
        .then(() => {
          const data = this.state.longData ? longFolderData : shortFolderData;
          this.props.changeStructure({
            name: '/',
            toggled: true,
            children: this.convertFolderObj(data),
          });
        });
    });
  };


  onToggle = (node, toggled) => {
    if (!node.fileType) {
      const newNode = node;
      if (this.state.cursor) {
        newNode.active = false;
      }
      newNode.active = true;
      if (node.children) {
        newNode.toggled = toggled;
      }
      this.setState({
        cursor: newNode,
        showRecycleBin: false,
      });
    }
  };

  onFilterMouseUp = (e) => {
    const filter = e.target.value.trim();
    if (!filter) {
      return this.setState({
        filterData: null,
      });
    }
    let filtered = filters.filterTree(this.props.folderList, filter);
    filtered = filters.expandFilteredNodes(filtered, filter);
    this.setState({
      filterData: filtered,
    });
  };

  convertFolderObj = (obj, i = 1) => {
    if (isArray(obj)) {
      return map(obj, item => this.convertFolderObj(item, i + 1));
    } else if (isObject(obj)) {
      const keysArr = keys(obj);

      if (keysArr.includes('file_name')) {
        return {
          id: this.getI(),
          name: obj.file_name,
          fileType: obj.type,
          toggled: false,
          deleted: false,
        };
      } else if (!keysArr.includes('title')) {
        return compact(map(keysArr, (key) => {
          if (key === 'title') {
            return null;
          }
          return {
            id: this.getI(),
            name: key,
            toggled: false,
            children: [...this.convertFolderObj(obj[key], i + 1)],
            deleted: false,
          };
        }));
      }

      const children = compact(map(keysArr, (key) => {
        if (key === 'title') {
          return null;
        }
        return {
          id: this.getI(),
          name: key,
          toggled: false,
          children: [...this.convertFolderObj(obj[key], i + 1)],
          deleted: false,
        };
      }));

      return {
        id: this.getI(),
        name: obj.title,
        toggled: false,
        children: [...children],
        deleted: false,
      };
    }
  };


  renderSubFolders = (obj, type = 'all', i = 0) => {
    if (type === 'deleted') {
      const mappedChildren = map(
        obj.children,
        child => this.renderSubFolders(child, type, i + 1),
      );

      const deletedItems = compact(flattenDeep(mappedChildren));

      return ([
        (obj.deleted || deletedItems.length > 0) &&
        <TableRow key={obj.name}>
          <TableCell component="td" scope="row">
            {
              i > 0 &&
              <SubDirRight
                style={{
                  marginRight: 20,
                  marginLeft: i * 20,
                }}
              />
            }
            {obj.name}
          </TableCell>
          <TableCell numeric>
            {new Date().toLocaleDateString()}
          </TableCell>
          <TableCell>
            {
              (i === 0) &&
              <Button
                color="secondary"
                onClick={() => {
                  this.props.restoreItem(obj.id);
                }}
              >
                Restore
              </Button>
            }&nbsp;
          </TableCell>
        </TableRow>,
        deletedItems,
      ]);
    }
    return ([
      !obj.deleted &&
      <TableRow key={obj.name}>
        <TableCell component="td" scope="row">
          {
            i > 0 &&
            <SubDirRight
              style={{
                marginRight: 20,
                marginLeft: i * 20,
              }}
            />
          }
          {obj.name}
        </TableCell>
        <TableCell numeric>
          {new Date().toLocaleDateString()}
        </TableCell>
        <TableCell numeric>
          {!!obj.fileType && `${(Math.random() * 10).toFixed(2)} MB`}
        </TableCell>
        <TableCell>
          {
            !!obj.fileType &&
            obj.fileType
          }
          &nbsp;
        </TableCell>
      </TableRow>,
      (obj.toggled || obj.name === '/') && map(obj.children, child => this.renderSubFolders(child, type, i + 1)),
    ]);
  };

  render() {
    const { classes, folderList: data } = this.props;
    const {
      cursor, filterData,
      showRecycleBin,
      longData,
    } = this.state;


    return (
      <div className={classes.root}>
        <AppBar position="absolute" className={classes.appBar}>
          <Toolbar>
            <Typography
              variant="title"
              color="inherit"
              noWrap
              style={{
                flexGrow: 1,
              }}
            >
              File Manager
            </Typography>
            <FormGroup>
              <FormControlLabel
                style={{
                  color: '#fff',
                }}
                control={
                  <Switch
                    checked={longData}
                    onChange={this.handleLongShortChange}
                    aria-label="LongShorySwitch"
                  />
                }
                label={longData ? 'Long Data' : 'Short Data'}
              />
            </FormGroup>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
          style={{
            maxHeight: 'calc(100vh - 20px)',
            overflow: 'scroll',
          }}
        >
          <div className={classes.toolbar} />
          <Divider />
          <ListItem
            style={{
              padding: 20,
              minHeight: 60,
            }}
            button
            onClick={() => {
              this.setState({
                showRecycleBin: true,
              });
            }}
          >
            <ListItemIcon>
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText primary="Recycle Bin" />
          </ListItem>
          <Divider />
          <List>
            <Treebeard
              style={treeBeardStyles}
              data={filterData || data}
              onToggle={this.onToggle}
              decorators={treeDecorators}
            />
          </List>
          <Divider />
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Paper style={{
            background: '#fff',
            padding: 10,
            marginBottom: 20,
          }}
          >
            <TextField
              id="name"
              label="Search"
              fullWidth
              className={classes.textField}
              onChange={this.onFilterMouseUp}
            />
          </Paper>
          <Paper
            className={classes.root}
            style={{
              maxHeight: 'calc(500px - 20px)',
              paddingBottom: 20,
            }}
          >
            {cursor && (
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell numeric>Date</TableCell>
                    <TableCell numeric>Size</TableCell>
                    <TableCell>
                      {showRecycleBin ? '&nbsp;' : 'File Type'}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(showRecycleBin &&
                    data.children
                      .map(child =>
                        this.renderSubFolders(child, 'deleted')))
                  }
                  {(!showRecycleBin && cursor) &&
                  (
                    this.renderSubFolders(cursor, 'all', 0)
                  )}

                </TableBody>
              </Table>)}
          </Paper>
        </main>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  folderList: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  changeStructure: PropTypes.func.isRequired,
  restoreItem: PropTypes.func.isRequired,
};

function initMapStateToProps(state) {
  return {
    folderList: state.folderList.data,
  };
}

function initMapDispatchToProps(dispatch) {
  return bindActionCreators({
    changeStructure,
    restoreItem,
  }, dispatch);
}

export default connect(initMapStateToProps, initMapDispatchToProps)(withStyles(styles)(App));
