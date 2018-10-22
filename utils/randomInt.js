export default function randomInt(a, b) {
  a = parseInt(a, 10);
  b = parseInt(b, 10);
  if (isNaN(a) || isNaN(b)) {
    throw new Error('Unexpected Input');
  }
  return parseInt(Math.random() * (b - a + 1), 10) + a;
}