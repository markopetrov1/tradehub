export const timeAgo = (timestamp) => {
  if (!timestamp) return null;
  const seconds = Math.floor((new Date() - timestamp.toDate()) / 1000);

  const intervals = {
    year: Math.floor(seconds / 31536000),
    month: Math.floor(seconds / 2592000),
    day: Math.floor(seconds / 86400),
    hour: Math.floor(seconds / 3600),
    minute: Math.floor(seconds / 60),
    second: Math.floor(seconds),
  };

  let timeAgoString;
  switch (true) {
    case intervals.year > 1:
      timeAgoString = `${intervals.year} years ago`;
      break;
    case intervals.year === 1:
      timeAgoString = `1 year ago`;
      break;
    case intervals.month > 1:
      timeAgoString = `${intervals.month} months ago`;
      break;
    case intervals.month === 1:
      timeAgoString = `1 month ago`;
      break;
    case intervals.day > 1:
      timeAgoString = `${intervals.day} days ago`;
      break;
    case intervals.day === 1:
      timeAgoString = `1 day ago`;
      break;
    case intervals.hour > 1:
      timeAgoString = `${intervals.hour} hours ago`;
      break;
    case intervals.hour === 1:
      timeAgoString = `1 hour ago`;
      break;
    case intervals.minute > 1:
      timeAgoString = `${intervals.minute} minutes ago`;
      break;
    case intervals.minute === 1:
      timeAgoString = `1 minute ago`;
      break;
    case intervals.second > 1:
      timeAgoString = `${intervals.second} seconds ago`;
      break;
    default:
      timeAgoString = `1 second ago`;
  }

  return timeAgoString;
};
