import { Schema, model, models } from "mongoose";

const ProjectSchema = new Schema({
  title: {
    type: String,
    required: [true, "Proje başlığı zorunludur"],
    trim: true,
    maxlength: [100, "Başlık en fazla 100 karakter olabilir"],
  },
  description: {
    type: String,
    required: [true, "Proje açıklaması zorunludur"],
    trim: true,
  },
  images: {
    type: [String],
    required: [true, "En az bir proje görseli gereklidir"],
  },
  technologies: {
    type: [String],
    required: [true, "Kullanılan teknolojiler zorunludur"],
  },
  link: {
    type: String,
    trim: true,
  },
  github: {
    type: String,
    trim: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Güncelleme tarihini otomatik olarak güncelle
ProjectSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export default models.Project || model("Project", ProjectSchema);
