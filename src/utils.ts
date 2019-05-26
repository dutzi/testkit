import moment from 'moment';

export function navigateTo(
  path: string,
  e: React.MouseEvent | null,
  history: any,
) {
  if (e && (e.ctrlKey || e.metaKey)) {
    window.open(path);
  } else {
    history.push(path);
  }
}

export function formatDate(date: any) {
  return moment(date.seconds * 1000)
    .format('D/M/Y HH:mm')
    .replace(' ', '&nbsp;');
}
