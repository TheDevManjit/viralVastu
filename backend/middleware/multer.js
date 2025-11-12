import multer from 'multer'

const storage= multer.memoryStorage()

// sinlge Upload

export const singleUpload = multer({storage}).single("file")

// upload multiple

export const multipleUpload = multer({storage}).array("files",5)