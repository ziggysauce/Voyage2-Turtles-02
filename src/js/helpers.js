function randomNumber(min, max) {
  const num = Math.floor(Math.random() * (max - min)) + min;
  return num;
}

function getHours() {
  const curTime = new Date();
  return parseInt(curTime.toLocaleString('en-US', {
    hour: 'numeric',
    hour12: false,
  }), 10);
}
