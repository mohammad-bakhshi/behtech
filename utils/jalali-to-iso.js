import moment from "moment-jalaali";
import { logger } from "../config/winston.js";

export const convertJalaliToISO = (jalaliDateString) => {
  const m = moment(jalaliDateString, "jYYYY/jMM/jDD", "fa");
  if (!m.isValid()) {
    logger.error("Invalid Jalali date provided.");
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
