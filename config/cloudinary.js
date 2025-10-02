const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: "diikhxlin",
    api_key: "475722897576441",
    api_secret: "sjGXCAr5mrkCtrFANjazFRiy_bA"
});

// Different storage for hotel documents
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        let folder = 'hotels';
        if (file.fieldname === 'gst_license') folder = 'gst_licenses';
        if (file.fieldname === 'fssai_license') folder = 'fssai_licenses';
        if (file.fieldname === 'background_image') folder = 'backgrounds';
        if (file.fieldname === 'logo') folder = 'logos';

        return {
            folder: folder,
            allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'],
            public_id: `${Date.now()}-${file.originalname.split('.')[0]}`
        };
    },
});

const upload = multer({ storage });

module.exports = { cloudinary, upload };
