import multer, { type Multer, type StorageEngine } from "multer";
import path from "path";

const storage: StorageEngine = multer.diskStorage({
    destination: "./uploads/",
    filename: function(req, file, cb) {
        cb(
            null,
            file.fieldname + '-' + Date.now() + path.extname(file.originalname)
        )
    }
})

const MAX_SIZE: number = 1 * 1024 * 1024;  // 1MB in bytes

const checkFileType = (file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = filetypes.test(file.mimetype);

    if(extname && mimeType){
        return cb(null, true)
    }else{
        cb(new Error("Error: Images only! (jpeg, jpg, png)"))
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: MAX_SIZE
    },
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb)
    },
});

export default upload;