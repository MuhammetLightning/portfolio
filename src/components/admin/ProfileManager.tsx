"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface Profile {
  fullName: string;
  about: string;
  email: string;
  github: string;
  linkedin: string;
  profileImage: string;
}

const defaultProfile: Profile = {
  fullName: "",
  about: "",
  email: "",
  github: "",
  linkedin: "",
  profileImage: "",
};

export default function ProfileManager() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        console.log("Gelen profil verisi:", data); // Debug için
        setProfile({
          fullName: data.fullName || "",
          about: data.about || "",
          email: data.email || "",
          github: data.github || "",
          linkedin: data.linkedin || "",
          profileImage: data.profileImage || "/images/default-profile.jpg",
        });
      } else {
        console.error("Profil verisi alınamadı:", await res.text());
        setMessage({
          text: "Profil bilgileri alınırken bir hata oluştu",
          type: "error",
        });
      }
    } catch {
      setMessage({
        text: "Profil bilgileri alınırken bir hata oluştu",
        type: "error",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({
          text: "Profil başarıyla güncellendi",
          type: "success",
        });
      } else {
        setMessage({
          text: data.message || "Profil güncellenirken bir hata oluştu",
          type: "error",
        });
      }
    } catch {
      setMessage({
        text: "Profil güncellenirken bir hata oluştu",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    const file = e.target.files[0];

    // Dosya boyutu kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({
        text: "Dosya boyutu 5MB'dan büyük olamaz",
        type: "error",
      });
      return;
    }

    // Dosya tipi kontrolü
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setMessage({
        text: "Sadece JPEG, PNG ve WEBP formatları desteklenir",
        type: "error",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploadLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setProfile((prev) => ({ ...prev, profileImage: data.url }));
        setMessage({
          text: "Profil fotoğrafı başarıyla yüklendi",
          type: "success",
        });
      } else {
        setMessage({
          text: data.message || "Resim yüklenirken bir hata oluştu",
          type: "error",
        });
      }
    } catch {
      setMessage({
        text: "Resim yüklenirken bir hata oluştu",
        type: "error",
      });
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold mb-4">Profil Düzenle</h2>

      {message.text && (
        <div
          className={`p-4 rounded-md ${
            message.type === "success" ? "bg-green-600" : "bg-red-600"
          } text-white`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Profil Fotoğrafı
          </label>
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 bg-gray-700 rounded-full overflow-hidden relative">
              {profile.profileImage && (
                <Image
                  src={profile.profileImage}
                  alt="Profil"
                  fill
                  sizes="(max-width: 96px) 100vw, 96px"
                  className="object-cover"
                />
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="text-gray-300"
                disabled={uploadLoading}
              />
              {uploadLoading && (
                <p className="text-sm text-gray-400">Fotoğraf yükleniyor...</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Ad Soyad
          </label>
          <input
            type="text"
            name="fullName"
            value={profile.fullName}
            onChange={handleChange}
            className="w-full rounded-md bg-gray-700 border-gray-600 text-white p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Hakkımda
          </label>
          <textarea
            name="about"
            value={profile.about}
            onChange={handleChange}
            rows={4}
            className="w-full rounded-md bg-gray-700 border-gray-600 text-white p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            className="w-full rounded-md bg-gray-700 border-gray-600 text-white p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            GitHub
          </label>
          <input
            type="url"
            name="github"
            value={profile.github}
            onChange={handleChange}
            className="w-full rounded-md bg-gray-700 border-gray-600 text-white p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            LinkedIn
          </label>
          <input
            type="url"
            name="linkedin"
            value={profile.linkedin}
            onChange={handleChange}
            className="w-full rounded-md bg-gray-700 border-gray-600 text-white p-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading || uploadLoading}
          className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors ${
            loading || uploadLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
        </button>
      </form>
    </motion.div>
  );
}
