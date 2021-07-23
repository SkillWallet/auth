export const getCommunity = async () => {
  const res = await fetch('https://api.distributed.town/api/community/0xB433eE0b9F10575218D9ba7A2FA5993cd08cb953', {
    method: 'GET'
  })   
    const comm = await res.json();
    return comm;
}

export function format(first: string, middle: string, last: string): string {
  return (first || '') + (middle ? ` ${middle}` : '') + (last ? ` ${last}` : '');
}
