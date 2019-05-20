import moment from 'moment';

export function DateFormat(date, format) {
  if (typeof date === 'undefined' || date === null || date === '') {
    return null;
  }
  if (format) {
    return moment(date).format(format);
  }
  return moment(date).format('DD-MM-YYYY');
}

export function DateTimeFormat(date, format) {
  if (typeof date === 'undefined' || date === null || date === '') {
    return null;
  }
  if (format) {
    return moment(date).format(format);
  }
  return moment(date).format('DD-MM-YYYY HH:mm');
}