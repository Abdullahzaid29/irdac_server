const axios = require( "axios");
// const getdata = axios.get("http://localhost:7000/api/fetchppm");
const data = axios.get("https://thingspeak.com/channels/2125069/feed.json")

 const ppm =  
[
    data
    // {
    //     "registration_no":"TNXXADXX",
    //     "ppm":2000,
    //     "status":true
    // },
    // {
    //     "registration_no":"TNXXASXX",
    //     "ppm":1500,
    //     "status":true
    // },
    // {
    //     "registration_no":"211420104001",
    //     "ppm":"200",
    //     "status":false
    // },
    // {
    //     "registration_no":"TNXX57XX",
    //     "ppm":3000,
    //     "status":true
    // },
    // {
    //     "registration_no":"TNXX12XX",
    //     "ppm":1700,
    //     "status":true
    // },
    
]

console.log(data);

module.exports = {
    ppm
  };