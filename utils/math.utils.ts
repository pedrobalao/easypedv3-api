export const round = (num: number, decimalPlaces: number = 0): number => {
  var p = Math.pow(10, decimalPlaces);
  var n = num * p * (1 + Number.EPSILON);
  return Math.round(n) / p;
};

export const calculatePercentile = (
  percentileL: number,
  valpL: number,
  percentileH: number,
  valpH: number,
  val: number
): number => {
  let jumps =
    (Number(valpH) - Number(valpL)) /
    (Number(percentileH) - Number(percentileL));

  let percentil = Number(percentileL);
  let valPercentil = Number(valpL);
  //console.log('jumps '+jumps);
  //console.log(valPercentil +' '+ percentil+' '+ val);
  while (val >= valPercentil) {
    //console.log(valPercentil +' '+ percentil);
    valPercentil = valPercentil + jumps;
    percentil = percentil + 1;
    //console.log('new ' + valPercentil +' '+ percentil);
  }
  //console.log(percentileL +' '+ valpL +' '+ percentileH +' '+ valpH +' '+ val)
  return percentil;
};
