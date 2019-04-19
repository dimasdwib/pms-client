import moment from 'moment';

export function DateFormat(date, format) {
  if (format) {
    return moment(date).format(format);
  }
  return moment(date).format('DD-MM-YYYY');
}

export function DateTimeFormat(date, format) {
  if (format) {
    return moment(date).format(format);
  }
  return moment(date).format('DD-MM-YYYY HH:mm');
}