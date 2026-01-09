

import { CLOUDINARY_URL, CLOUDINARY_UPLOAD_PRESET } from './cloudinaryConfig';

export const uploadToCloudinary = async (uri: string): Promise<string> => {
  const formData = new FormData();
  formData.append("file", {
    uri,
    type: "image/jpeg",
    name: "qr-code.jpg",
  } as any);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(CLOUDINARY_URL, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  if (data.secure_url) {
    return data.secure_url;
  } else {
    throw new Error("Failed to upload image to Cloudinary");
  }
};
