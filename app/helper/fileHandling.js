const multer = require('multer');
const path = require('path');

async function fileHandling(app) {
    //Store Image using Multer
    var storage = multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, 'public/uploadedImages');
        },
        filename: (req, file, callback) => {
            const match = [".png", ".jpeg", ".jpg"];

            if (match.indexOf(path.extname(file.originalname)) === -1) {
                var message = `${file.originalname} is invalid. Only accept png, jpeg or jpg format.`;
                return callback(message, null);
            }

            var filename = file.fieldname + '_' + Date.now() + path.extname(file.originalname);
            callback(null, filename)
        }
    })
    app.use(multer({ storage: storage }).any("image"))
}

module.exports = fileHandling;