import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import url from "url";
import dotenv from 'dotenv';
dotenv.config();
// Configuração Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

// Corrige __dirname em ES modules
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho da imagem de teste
const imagePath = path.join(__dirname, "teste.jpg"); // coloque uma imagem teste na raiz

async function main() {
    try {
        if (!fs.existsSync(imagePath)) {
            console.error("Coloque um arquivo teste.jpg na raiz do projeto");
            return;
        }

        const uploadResponse = await cloudinary.uploader.upload(imagePath, {
            folder: "checklists_test",
        });

        console.log("Upload realizado com sucesso!");
        console.log("URL da imagem:", uploadResponse.secure_url);
    } catch (err) {
        console.error("Erro ao enviar para Cloudinary:", err);
    }
}

main();
