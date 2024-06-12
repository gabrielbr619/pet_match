const multer = require('multer');

// Configuração de armazenamento para `multer`

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

module.exports = upload;
