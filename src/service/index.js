import { Subject } from "rxjs";

const spinnerObservable = new Subject();
const charDataObservable = new Subject();
const Service = {
  spinnerObservable: spinnerObservable,
  charDataObservable: charDataObservable
};
export default Service;
