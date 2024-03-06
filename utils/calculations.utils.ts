import { CalculationInput } from "../models/drug.model";

export const calculateInner = (
  data: CalculationInput[],
  formula: String
): any => {
  var vars = "";
  console.log("formula 1-> " + formula);

  data.forEach((element) => {
    if (isNaN(element.value)) {
      vars = vars + "var " + element.variable + '="' + element.value + '";\n';
    } else {
      vars = vars + "var " + element.variable + "=" + element.value + ";\n";
    }
  });

  //this._loggingService.debug("vars -> " + vars);
  vars = vars + formula;

  console.log("formula -> " + vars);
  //this._loggingService.debug("vars -> " + vars);
  return eval(vars);
};
