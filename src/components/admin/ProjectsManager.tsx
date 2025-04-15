"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface Project {
  _id: string;
  title: string;
  description: string;
  images: string[];
  technologies: string[];
  link: string;
  github: string;
  featured: boolean;
}

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    images: [] as string[],
    technologies: [] as string[],
    link: "",
    github: "",
    featured: false,
  });
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data || []);
    } catch {
      setMessage({
        text: "Projeler yüklenirken bir hata oluştu",
        type: "error",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const url = editingProject
        ? `/api/projects/${editingProject._id}`
        : "/api/projects";
      const method = editingProject ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingProject || newProject),
      });

      if (response.ok) {
        await fetchProjects();
        setNewProject({
          title: "",
          description: "",
          images: [],
          technologies: [],
          link: "",
          github: "",
          featured: false,
        });
        setEditingProject(null);
        setMessage({
          text: editingProject
            ? "Proje başarıyla güncellendi"
            : "Proje başarıyla eklendi",
          type: "success",
        });
      } else {
        const data = await response.json();
        setMessage({
          text: data.message || "Bir hata oluştu",
          type: "error",
        });
      }
    } catch {
      setMessage({
        text: "Proje eklenirken bir hata oluştu",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu projeyi silmek istediğinizden emin misiniz?")) return;

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchProjects();
        setMessage({
          text: "Proje başarıyla silindi",
          type: "success",
        });
      } else {
        setMessage({
          text: "Proje silinirken bir hata oluştu",
          type: "error",
        });
      }
    } catch {
      setMessage({
        text: "Bir hata oluştu",
        type: "error",
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

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
        if (editingProject) {
          setEditingProject((prev) => ({
            ...prev!,
            images: [...prev!.images, data.url],
          }));
        } else {
          setNewProject((prev) => ({
            ...prev,
            images: [...prev.images, data.url],
          }));
        }
        setMessage({
          text: "Resim başarıyla yüklendi",
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

  const handleTechnologyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const techs = e.target.value.split(",").map((tech) => tech.trim());
    if (editingProject) {
      setEditingProject((prev) => ({
        ...prev!,
        technologies: techs,
      }));
    } else {
      setNewProject((prev) => ({
        ...prev,
        technologies: techs,
      }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold mb-4">Proje Yönetimi</h2>

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
            Proje Başlığı
          </label>
          <input
            type="text"
            value={editingProject?.title || newProject.title}
            onChange={(e) =>
              editingProject
                ? setEditingProject({
                    ...editingProject,
                    title: e.target.value,
                  })
                : setNewProject({ ...newProject, title: e.target.value })
            }
            className="w-full rounded-md bg-gray-700 border-gray-600 text-white p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Açıklama
          </label>
          <textarea
            value={editingProject?.description || newProject.description}
            onChange={(e) =>
              editingProject
                ? setEditingProject({
                    ...editingProject,
                    description: e.target.value,
                  })
                : setNewProject({ ...newProject, description: e.target.value })
            }
            rows={4}
            className="w-full rounded-md bg-gray-700 border-gray-600 text-white p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Proje Görselleri
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {(editingProject?.images || newProject.images).map(
              (image, index) => (
                <div key={index} className="relative aspect-video">
                  <Image
                    src={image}
                    alt={`Proje görseli ${index + 1}`}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
              )
            )}
          </div>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageUpload}
            className="text-gray-300"
            disabled={uploadLoading}
          />
          {uploadLoading && (
            <p className="text-sm text-gray-400 mt-2">Resim yükleniyor...</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Kullanılan Teknolojiler (virgülle ayırın)
          </label>
          <input
            type="text"
            value={(
              editingProject?.technologies || newProject.technologies
            ).join(", ")}
            onChange={handleTechnologyChange}
            className="w-full rounded-md bg-gray-700 border-gray-600 text-white p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Proje Linki
          </label>
          <input
            type="url"
            value={editingProject?.link || newProject.link}
            onChange={(e) =>
              editingProject
                ? setEditingProject({ ...editingProject, link: e.target.value })
                : setNewProject({ ...newProject, link: e.target.value })
            }
            className="w-full rounded-md bg-gray-700 border-gray-600 text-white p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            GitHub Linki
          </label>
          <input
            type="url"
            value={editingProject?.github || newProject.github}
            onChange={(e) =>
              editingProject
                ? setEditingProject({
                    ...editingProject,
                    github: e.target.value,
                  })
                : setNewProject({ ...newProject, github: e.target.value })
            }
            className="w-full rounded-md bg-gray-700 border-gray-600 text-white p-2"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="featured"
            checked={editingProject?.featured || newProject.featured}
            onChange={(e) =>
              editingProject
                ? setEditingProject({
                    ...editingProject,
                    featured: e.target.checked,
                  })
                : setNewProject({ ...newProject, featured: e.target.checked })
            }
            className="h-4 w-4 text-blue-600 rounded border-gray-600"
          />
          <label htmlFor="featured" className="ml-2 text-sm text-gray-300">
            Öne Çıkan Proje
          </label>
        </div>

        <div className="flex space-x-4">
          {editingProject && (
            <button
              type="button"
              onClick={() => setEditingProject(null)}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              İptal
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Kaydediliyor..." : editingProject ? "Güncelle" : "Ekle"}
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects?.map((project) => (
          <motion.div
            key={project._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-lg overflow-hidden"
          >
            <div className="relative aspect-video">
              <Image
                src={project.images[0]}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
              <p className="text-gray-300 mb-4 line-clamp-2">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies?.map((tech, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-700 text-sm rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingProject(project)}
                    className="text-blue-500 hover:text-blue-400"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="text-red-500 hover:text-red-400"
                  >
                    Sil
                  </button>
                </div>
                {project.featured && (
                  <span className="text-yellow-500 text-sm">Öne Çıkan</span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
