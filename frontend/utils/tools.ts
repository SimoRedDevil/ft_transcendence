export function truncateMessage(message, maxLength) {
    if (message.length > maxLength)
      return message.substring(0, maxLength) + '...';
    return message;
}

export function checkStringEmpty(str) {
    return str === null || str === undefined || str === '' || !str.trim();
}

export function get_human_readable_time() {
  const date = new Date();

  const optionsDate = { weekday: 'long' }; 
  const optionsTime = { hour: 'numeric', minute: '2-digit', hour12: true };
  
  const day = date.toLocaleDateString('en-US', optionsDate);
  const time = date.toLocaleTimeString('en-US', optionsTime);
  
  const formattedDateTime = `${day}, ${time}`;
  return formattedDateTime;
}