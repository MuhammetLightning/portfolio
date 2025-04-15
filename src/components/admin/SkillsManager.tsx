"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Skill {
  _id: string;
  name: string;
  icon: string;
}

export default function SkillsManager() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState({ name: "", icon: "" });
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await fetch("/api/skills");
      const data = await res.json();
      setSkills(data);
    } catch (error) {
      console.error("Yetenekler yüklenemedi:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingSkill
        ? `/api/skills/${editingSkill._id}`
        : "/api/skills";
      const method = editingSkill ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingSkill || newSkill),
      });

      if (response.ok) {
        await fetchSkills();
        setNewSkill({ name: "", icon: "" });
        setEditingSkill(null);
      } else {
        alert("Bir hata oluştu");
      }
    } catch (error) {
      console.error("İşlem başarısız:", error);
      alert("Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu yeteneği silmek istediğinizden emin misiniz?")) return;

    try {
      const response = await fetch(`/api/skills/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchSkills();
      } else {
        alert("Silme işlemi başarısız oldu");
      }
    } catch (error) {
      console.error("Silme işlemi başarısız:", error);
      alert("Bir hata oluştu");
    }
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-lg space-y-4"
      >
        <h3 className="text-xl font-semibold mb-4">
          {editingSkill ? "Yetenek Düzenle" : "Yeni Yetenek Ekle"}
        </h3>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Yetenek Adı
          </label>
          <input
            type="text"
            value={editingSkill?.name || newSkill.name}
            onChange={(e) =>
              editingSkill
                ? setEditingSkill({ ...editingSkill, name: e.target.value })
                : setNewSkill({ ...newSkill, name: e.target.value })
            }
            className="w-full rounded-md bg-gray-700 border-gray-600 text-white p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            İkon (Emoji)
          </label>
          <input
            type="text"
            value={editingSkill?.icon || newSkill.icon}
            onChange={(e) =>
              editingSkill
                ? setEditingSkill({ ...editingSkill, icon: e.target.value })
                : setNewSkill({ ...newSkill, icon: e.target.value })
            }
            className="w-full rounded-md bg-gray-700 border-gray-600 text-white p-2"
            required
          />
        </div>
        <div className="flex justify-end space-x-2">
          {editingSkill && (
            <button
              type="button"
              onClick={() => setEditingSkill(null)}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              İptal
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Kaydediliyor..." : editingSkill ? "Güncelle" : "Ekle"}
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill) => (
          <motion.div
            key={skill._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 p-4 rounded-lg flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{skill.icon}</span>
              <span className="text-lg">{skill.name}</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setEditingSkill(skill)}
                className="text-blue-500 hover:text-blue-400"
              >
                Düzenle
              </button>
              <button
                onClick={() => handleDelete(skill._id)}
                className="text-red-500 hover:text-red-400"
              >
                Sil
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
