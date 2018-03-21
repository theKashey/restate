let loopers = [];

const ADD_LOOPER = 'REACT-REDUX-LOOP/ADD';
const REMOVE_LOOPER = 'REACT-REDUX-LOOP/REMOVE';

const addLooper = looper => loopers.push(looper);
const removeLooper = looper => {loopers = loopers.filter(x => x !== looper)};

const loop = () => next => action => {
  switch (action.type) {
    case ADD_LOOPER:
      return addLooper(action.payload);

    case REMOVE_LOOPER:
      return removeLooper(action.payload);

    default:
      loopers.forEach(looper => looper(action));
      return next(action);
  }
};

export {
  ADD_LOOPER,
  REMOVE_LOOPER
}

export default loop;