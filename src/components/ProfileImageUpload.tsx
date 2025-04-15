"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function ProfileImageUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
      setSuccess(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Lütfen bir resim seçin");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Yükleme başarısız oldu");
      }

      setSuccess(true);
      // Burada yüklenen resmin URL'ini kullanabilir veya bir callback'e iletebilirsiniz
      console.log("Yüklenen resim URL:", data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Profil Resmi Yükle
          </h2>
          <p className="text-gray-600">
            PNG, JPG veya GIF formatında bir resim seçin
          </p>
        </div>

        <div className="flex flex-col items-center space-y-4">
          {previewUrl && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-blue-500"
            >
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                style={{ objectFit: "cover" }}
              />
            </motion.div>
          )}

          <label className="w-full">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-4 text-center bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors"
            >
              Resim Seç
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </motion.div>
          </label>

          {selectedFile && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUpload}
              disabled={uploading}
              className={`w-full py-3 px-4 rounded-lg text-white transition-colors ${
                uploading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {uploading ? "Yükleniyor..." : "Yükle"}
            </motion.button>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full p-3 bg-red-100 text-red-700 rounded-lg text-center"
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full p-3 bg-green-100 text-green-700 rounded-lg text-center"
            >
              Resim başarıyla yüklendi!
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
