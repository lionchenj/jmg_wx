const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatDate = (data, n) => {
  var newDate = new Date(data.replace(/-/g, "/"));
  var newYear = new Date().getFullYear();
  const year = newDate.getFullYear();
  const month = newDate.getMonth() + 1;
  const day = newDate.getDate();
  const hour = newDate.getHours();
  const minute = newDate.getMinutes();
  const second = newDate.getSeconds();
  switch (n) {
    case 1:
      return year + '年' + month + '月' + day + '日';
      break;
    case 2:
      return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
      break;
    case 3:
      return { 'day': month + '月' + day + '日', 'time': [hour, minute].map(formatNumber).join(':') };
      break;
    case 4:
      return [newYear, month, day].map(formatNumber).join('-');
      break;
    case 5:
      return [month, day].map(formatNumber).join('.');
      break;
    default:
      return [year, month, day].map(formatNumber).join('.') + ' ' + [hour, minute].map(formatNumber).join(':');
      break;
  }
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate
}