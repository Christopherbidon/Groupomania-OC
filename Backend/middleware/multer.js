const multer = require("multer");

/* Vérification de l'extention du fichier et le remplace par le bon */
const MIME_TYPES = {
   "image/jpg": "jpg",
   "image/jpeg": "jpg",
   "image/png": "png",
   "image/gif": "gif",
};
/* Définition de ou sera stocker l'image et le nom quelle portera */
const storage = multer.diskStorage({
   destination: (req, file, callback) => {
      callback(null, "medias");
   },
   filname: (req, file, callback) => {
      const name = file.originalname.split(" ").join("_");
      const extension = MIME_TYPES[file.mimetype];
      callback(null, name + Date.now() + "." + extension);
   },
});

module.exports = multer({ storage }).single("image");
