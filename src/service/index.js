import { Subject } from "rxjs";
import * as axios from "axios";

const spinnerObservable = new Subject();
const charDataObservable = new Subject();

function getConsumptionData(facilityId,fDate,tDate,resolution){
  return axios.get(`https://demo-api.greenely.com/v1/facility/${facilityId}/consumption?from=${fDate}&to=${tDate}&resolution=${resolution}`);
}
function getFacilityId(){
  return new Promise((resolve,reject)=>{
    axios.get("https://demo-api.greenely.com/v1/facility").then((response)=>{
      if (response.status === 200 && response.data.data && response.data.data.length)
      resolve(response.data.data[0].id);
      else resolve(false);
    });
  });
}
const Service = {
  spinnerObservable: spinnerObservable,
  charDataObservable: charDataObservable,
  getConsumptionData:getConsumptionData,
  getFacilityId:getFacilityId
};
export default Service;
