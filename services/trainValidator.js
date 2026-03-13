exports.validateTrain = (trainNo) => {

  const regex = /^[0-9]{5}$/;

  return regex.test(trainNo);

};