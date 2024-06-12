const { Pool } = require('pg');
require('dotenv').config();
console.log({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
})
const pool = new Pool({
  user: "avnadmin",
  password: "AVNS_eWSevNy59gqCpOK_82M",
  host: "pet-match-stg-petmatch.e.aivencloud.com",
  port: 19951,
  database: "defaultdb",
  ssl: {
      rejectUnauthorized: true,
      ca: `-----BEGIN CERTIFICATE-----
MIIEQTCCAqmgAwIBAgIUf4waso87OJazLxNeE2dJKrjeUEkwDQYJKoZIhvcNAQEM
BQAwOjE4MDYGA1UEAwwvMTQ2YWIxMjEtNzY3YS00MjliLWIwMzctOTJhOWQ2Y2Nl
OTViIFByb2plY3QgQ0EwHhcNMjQwNjA0MTMwNjU5WhcNMzQwNjAyMTMwNjU5WjA6
MTgwNgYDVQQDDC8xNDZhYjEyMS03NjdhLTQyOWItYjAzNy05MmE5ZDZjY2U5NWIg
UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBAKoXDYg4
ACssdwlz5xHwqzyTIqz90vf55MBCbYCW/5fpgC134tAyIE9GclyXGuFT8b0bg/El
2TCEcbxqYeL8siZiJSP441nl8NzOVqHOA7umTZdo2etO5B/yaOqX1bpdii0pyYL+
5nroQvqNatLbwa+UEIcFqLw/TasB+z8Euuq0vc0Nb1nOQl6akOEf9DI/HvuHI4Zk
6JLGgWiO9uATnjjmkZuj8bgjV2X462HDSPV2jHCLWQjXZVG8mmjD27CLwEcuYTs7
jWhQEELw8Pi7eoYnWmDB9QDrbq5n90fwyS27fHzuVsWH9AhBVddL+SHHdbmos0Jt
BVv4FsSJwhegZTnNv+RtJNHKcCpX6dnF9LsFTrHAjA1zgmQjLSbamXj2Da1TqeYK
ffvAOl+s8oQDqI+vTBP83GS28vHBjMYwt4az8hQMbs2vDwnnMPjtfSYFLgex+62y
2CZtBr6uIZ64A37k5/rJSYVwBMQXwhK3x0ILpnlNIgTmYxIkYMBe5uUnqQIDAQAB
oz8wPTAdBgNVHQ4EFgQU3VT8rtEmDgfFVAxxBLwoHRLLPd4wDwYDVR0TBAgwBgEB
/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGBAIP1lhPLwW65/7N/
CV4J79to/y6ajp+gbyXMGsGmAMsFIxMMul5S3pV0v2p+V+1rlKT+8wbn0J/0PZot
emdOZjubFymci+vY5dBL06GOCCUhtBy+PPnsALKzakEn+Hsya3NiqC0HhGgMxr5u
L/F+/sF4oAxeKBXzSN97Aurxbo5sIep/UVgxb3uGiCZPiiAdyAGGS6/tTwot3tOs
+dk5A84PS7zh/gqRsypLGJg38rNRoQ47deTWKXe73ovbR8rfGPdo1sHsv67NewdV
7YZ5oWbnq1q64W/VBJpvGwcCZ3B7ZZ95OOVv9X1zPYYmDSJnQjDnMu43bobv8dcP
bBhX6RwmNWyKQ+Yfcne6PZM4TuTFvbOS/OGylRSmHxGAy/h2XW5ojzqCeuwX0/i/
ZsmAM3Bhob3Oc1G4yXmlnuUd2apa26OY3rXXIK09oh52YcCTCE9Wk7ju5z36X0Vw
fHg6Q2w8ANq9mjSxFqLPb+A7px1PzCUAwpPcdauP1fBKg+NLXg==
-----END CERTIFICATE-----`,
  },
});

module.exports = pool;
