import React from 'react';

const DisplayDate = ({date}) => {
    const event = new Date(date);
    const options = {year: 'numeric', month: 'numeric', day: 'numeric' };
    const formattedDate = event.toLocaleDateString('en-UK', options);
  return (
    <span>{formattedDate}</span>
  );
}

export default DisplayDate;
