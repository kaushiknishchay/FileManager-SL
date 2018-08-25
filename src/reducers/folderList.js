import largeFolderData from '../data/long.json';


const initialState = {
  data: [],
  dataLarge: largeFolderData,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'SAVE_CHANGES':
      return {
        data: payload,
        dataLarge: payload,
      };
    case 'CHANGE_STRUCTURE':
      return {
        data: payload,
      };
    default:
      return state;
  }
};
