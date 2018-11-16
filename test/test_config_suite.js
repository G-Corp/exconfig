const { suite, test, assertTrue, assertFalse } = require('ttf');

suite('Simple suite one', () => {
  test('should be true', () => {
    assertTrue(true);
  });
});
