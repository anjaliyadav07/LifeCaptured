const multer = require('multer')


const storage = multer.memoryStorage()


const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp'
])


const upload = multer({

  storage,

  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1
  },

  fileFilter: (
    req,
    file,
    callback
  ) => {

    if (
      !ALLOWED_MIME_TYPES.has(
        file.mimetype
      )
    ) {
      return callback(
        new Error(
          'Only JPG, PNG, and WEBP images are allowed'
        )
      )
    }


    callback(null, true)
  }
})


module.exports = upload