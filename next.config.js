/* eslint-disable @typescript-eslint/no-var-requires */
const withTM = require('next-transpile-modules')([
  '@fullcalendar/common',
  '@fullcalendar/daygrid',
  '@fullcalendar/interaction',
  '@fullcalendar/list',
  '@fullcalendar/react',
  '@fullcalendar/timegrid',
  '@fullcalendar/timeline',
]);

module.exports = withTM({
  swcMinify: false,
  trailingSlash: true,
  env: {
    HOST_API_KEY: 'https://minimal-assets-api.vercel.app',
    // FIREBASE AUTH
    FIREBASE_API_KEY: 'AIzaSyBce4VQuzRQHblcwmN61NuXc3jxWuBSlvU',
    FIREBASE_AUTH_DOMAIN: 'erp-demo-af350.firebaseapp.com',
    FIREBASE_PROJECT_ID: 'erp-demo-af350',
    FIREBASE_STORAGE_BUCKET: 'erp-demo-af350.appspot.com',
    FIREBASE_MESSAGING_SENDER_ID: '19507710467',
    FIREBASE_APPID: '1:19507710467:web:7b8bc218f25d2e02005c36',
    FIREBASE_MEASUREMENT_ID: 'G-NMEC4ZPKQ7',
    // AWS COGNITO AUTH
    AWS_COGNITO_USER_POOL_ID: '',
    AWS_COGNITO_CLIENT_ID: '',
    // AUTH0 AUTH
    AUTH0_CLIENT_ID: '',
    AUTH0_DOMAIN: '',
    //
    MAPBOX: '',
  },
});
