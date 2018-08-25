export const addNewFile = (folderName, name) => ({
  type: 'ADD_NEW_FILE',
  payload: {
    folderId: folderName,
    name,
  },
});

export const addNewFolder = (folderId, name) => ({
  type: 'ADD_NEW_FOLDER',
  payload: {
    folderId,
    name,
  },
});

export const renameItem = (itemId, name) => ({
  type: 'RENAME_ITEM',
  payload: {
    itemId,
    name,
  },
});

export const deleteItem = itemId => ({
  type: 'DELETE_ITEM',
  payload: {
    itemId,
  },
});

export const restoreItem = itemId => ({
  type: 'RESTORE_ITEM',
  payload: {
    itemId,
  },
});

export const changeStructure = data => ({
  type: 'CHANGE_STRUCTURE',
  payload: data,
});
