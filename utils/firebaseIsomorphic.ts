/**
 * get firebase client suitable for each environment (client/server)
 */

const firebase = process.browser
  ? require('./firebase')
  : require('./firebaseAdmin');

export default firebase.default;
