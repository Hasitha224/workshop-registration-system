export const day = (offset: number, hour: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  d.setHours(hour, 0, 0, 0);
  return d;
};

export const emailFor = (name: string) => {
  const first = name.split(' ')[0] ?? 'attendee';
  return `${first.toLowerCase()}@mail.com`;
};