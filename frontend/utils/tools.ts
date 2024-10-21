export function truncateMessage(message, maxLength) {
    if (message.length > maxLength)
      return message.substring(0, maxLength) + '...';
    return message;
  }