"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import SkillsManager from "@/components/admin/SkillsManager";
import ProfileManager from "@/components/admin/ProfileManager";
import ProjectsManager from "@/components/admin/ProjectsManager";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (res.ok) {
        router.push("/admin/login");
      }
    } catch (error) {
      console.error("Çıkış yapılırken hata oluştu:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Admin Paneli</h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
            >
              Çıkış Yap
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-4 mb-8 border-b border-gray-700">
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-2 px-4 ${
                activeTab === "profile"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-400"
              }`}
            >
              Profil
            </button>
            <button
              onClick={() => setActiveTab("skills")}
              className={`py-2 px-4 ${
                activeTab === "skills"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-400"
              }`}
            >
              Yetenekler
            </button>
            <button
              onClick={() => setActiveTab("projects")}
              className={`py-2 px-4 ${
                activeTab === "projects"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-400"
              }`}
            >
              Projeler
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-gray-800 p-6 rounded-lg">
            {activeTab === "profile" && <ProfileManager />}
            {activeTab === "skills" && <SkillsManager />}
            {activeTab === "projects" && <ProjectsManager />}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
