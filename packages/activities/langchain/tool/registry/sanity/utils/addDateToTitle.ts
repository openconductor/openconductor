export function addDateToTitle(title: string): string {
  const monthNames: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const dateObj: Date = new Date();
  const year: number = dateObj.getUTCFullYear();

  const month = monthNames[dateObj.getMonth()];

  return title + ' - ' + month + ' ' + year.toString();
}
