import { Subject } from "rxjs";
import * as axios from "axios";

axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Authorization'] = 'Bearer LWgUxt7aMmyQuoEWUxlcUPbfUpRpVM';


const baseUrl = "https://demo-api.greenely.com/v1";
const spinnerObservable = new Subject();
const charDataObservable = new Subject();

/**
 * getting consumption data according to filter value
 * @param {*} facilityId 
 * @param {*} fDate 
 * @param {*} tDate 
 * @param {*} resolution 
 */
function getConsumptionData(facilityId, fDate, tDate, resolution) {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${baseUrl}/facility/${facilityId}/consumption?from=${fDate}&to=${tDate}&resolution=${resolution}`
      )
      .then(response => {
        if (response.status === 200 && response.data.data && response.data.data.consumption)
          resolve(response.data.data.consumption);
        else resolve(false);
      });
  });
}
/**
 * 
 */
function getFacilityId() {
  return new Promise((resolve, reject) => {
    axios.get(`${baseUrl}/facility`).then(response => {
      if (
        response.status === 200 &&
        response.data.data &&
        response.data.data.length
      )
        resolve(response.data.data[0].id);
      else resolve(false);
    });
  });
}
const Service = {
  spinnerObservable: spinnerObservable,
  charDataObservable: charDataObservable,
  getConsumptionData: getConsumptionData,
  getFacilityId: getFacilityId
};
export default Service;
