const axios = require("axios");

const checkPNR = async (req, res) => {
  try {
    const { pnr } = req.query; // GET /api/train/pnr?pnr=1234567890

    // Validate PNR
    if (!pnr || pnr.length !== 10) {
      return res.status(400).json({ success: false, message: "Invalid PNR" });
    }

    // Step 1️⃣: Get PNR Status
    const pnrOptions = {
      method: 'GET',
      url: `https://irctc-indian-railway-pnr-status.p.rapidapi.com/getPNRStatus/${pnr}`,
      headers: {
        'x-rapidapi-key': '33208efa56msh95c3093f3049a9ep11c5bejsn5fb66d942e0c',
        'x-rapidapi-host': 'irctc-indian-railway-pnr-status.p.rapidapi.com'
      },
      timeout: 10000
    };

    const pnrResponse = await axios.request(pnrOptions);

    const trainNumber = pnrResponse.data.data.trainNumber;

    if (!trainNumber) {
      return res.status(400).json({ success: false, message: "Train number not found in PNR data" });
    }

    // Step 2️⃣: Get Train Details by train number
    const trainDetailsOptions = {
      method: 'POST',
      url: 'https://irctc-insight.p.rapidapi.com/api/v1/train-details',
      headers: {
        'x-rapidapi-key': '33208efa56msh95c3093f3049a9ep11c5bejsn5fb66d942e0c',
        'x-rapidapi-host': 'irctc-insight.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      data: { trainNo: trainNumber },
      timeout: 10000
    };

    const trainDetailsResponse = await axios.request(trainDetailsOptions);

    // ✅ Final Combined Response
    res.json({
      success: true,
      pnrDetails: pnrResponse.data.data,
      trainDetails: trainDetailsResponse.data
    });

  } catch (error) {
    console.error("Train Controller Error:", error.response ? error.response.data : error.message);
    res.status(500).json({
      success: false,
      message: "Could not fetch PNR and Train details",
      error: error.response ? error.response.data : error.message
    });
  }
};

module.exports = { checkPNR };
