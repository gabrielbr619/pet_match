const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");

exports.uploadSinglePicture = async (req, name_of_folder) => {
  const result = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: name_of_folder },
      (error, result) => {
        if (error) {
          console.error("Error uploading image to Cloudinary:", error);
          return reject(new Error("Error uploading image to Cloudinary"));
        }
        resolve(result);
      }
    );
    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  });
  return result.secure_url;
};

exports.uploadManyPictures = async (req, name_of_folder) => {
  const uploadPromises = req.files.map((file, index) => {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: name_of_folder },
        (error, result) => {
          if (error) {
            return reject(new Error("Error uploading image to Cloudinary"));
          }
          resolve(result.secure_url);
        }
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  });
  imageUrls = await Promise.all(uploadPromises);
  return imageUrls;
};
