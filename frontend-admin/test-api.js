const axios = require('axios');
axios.get('http://localhost:3000/api/v1/admin/reports/investments').then(res => {
  console.log("Response data keys:", Object.keys(res.data));
  console.log("Is res.data.data undefined?", res.data.data === undefined);
}).catch(err => console.error(err.message));
