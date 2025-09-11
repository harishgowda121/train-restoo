const axios = require("axios");

const checkPNR = async (req, res) => {
  try {
    const { pnr } = req.query; // GET /api/train/pnr?pnr=1234567890

    // Validate PNR
    if (!pnr || pnr.length !== 10) {
      return res.status(400).json({ success: false, message: "Invalid PNR" });
    }

    // RapidAPI PNR endpoint options
    const options = {
      method: 'GET',
      url: `https://irctc-indian-railway-pnr-status.p.rapidapi.com/getPNRStatus/${pnr}`,
      headers: {
        'x-rapidapi-key': '33208efa56msh95c3093f3049a9ep11c5bejsn5fb66d942e0c',
        'x-rapidapi-host': 'irctc-indian-railway-pnr-status.p.rapidapi.com'
      },
      timeout: 10000, // 10 seconds timeout
    };

    // Make API request
    const response = await axios.request(options);

    // Send API response to client
    res.json({
      success: true,
      data: response.data
    });

  } catch (error) {
    console.error("PNR API error:", error.response ? error.response.data : error.message);
    res.status(500).json({
      success: false,
      message: "Could not fetch PNR details",
      error: error.response ? error.response.data : error.message
    });
  }
};

module.exports = { checkPNR };
