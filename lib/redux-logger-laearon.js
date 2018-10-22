module.exports = ({ getState }) => next => action => {
  const returnValue = next(action);
  console.log(getState());
  return returnValue;
}