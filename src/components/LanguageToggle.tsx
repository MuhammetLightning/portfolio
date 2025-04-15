"use client";

import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  const handleToggle = () => {
    console.log("Dil değiştiriliyor... Şu anki dil:", language);
    toggleLanguage();
    console.log("Dil değiştirildi. Yeni dil:", language === "tr" ? "en" : "tr");
  };

  return (
    <motion.button
      onClick={handleToggle}
      className="fixed top-4 right-4 bg-gray-800/50 hover:bg-gray-700/50 text-white px-4 py-2 rounded-full backdrop-blur-sm
                 border border-gray-700/50 shadow-lg transition-all duration-300 z-50"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {language === "tr" ? "EN" : "TR"}
    </motion.button>
  );
}
