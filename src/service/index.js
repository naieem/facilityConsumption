import { Subject } from 'rxjs';

const spinnerObservable = new Subject();
const Service = {
    spinnerObservable:spinnerObservable
}
export default Service;