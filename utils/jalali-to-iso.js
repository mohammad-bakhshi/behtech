import moment from "moment";

export const convertJalaliToISO = (jalaliDateString) => {
  const m = moment(jalaliDateString, "jYYYY/jMM/jDD", "fa");
  if (!m.isValid()) {
    console.error("Invalid Jalali date provided.");
    return null;
  }
  const isoString = m.toISOString();
  return isoString;
};

export const addMonthToDate = (date, count) => {
  const m = moment(date);
  m.add(count, "month");
  const isoString = m.toISOString();
  return isoString;
};
