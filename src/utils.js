export function compareDate(a, b) {
  const aTime = Date.parse(a.time);
  const bTime = Date.parse(b.time);

  if (aTime < bTime) return -1;

  if (aTime > bTime) return 1;

  return 0;
}

export function cleanSessionName(session) {
  const split = session.split('_');
  return `${split[2]} ${split[0].split('T')[1].split('.')[0]}`;
}

