exports.validatePNR = (pnr) => {

  if (!pnr) return false;

  const pnrRegex = /^[0-9]{10}$/;

  return pnrRegex.test(pnr);

};