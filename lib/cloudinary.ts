import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

export async function uploadImage(file: File | Blob) {
    return new Promise<{ secure_url: string }>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            const base64 = reader.result as string;
            try {
                const res = await cloudinary.uploader.upload(base64, {
                    folder: "checklists",
                });
                resolve({ secure_url: res.secure_url });
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = (err) => reject(err);
    });
}
