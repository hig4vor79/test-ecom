import moment from "moment";

const getExpirationDate = (amount, unit) => {
  return moment().add(amount, unit).toDate();
};

export default getExpirationDate;
