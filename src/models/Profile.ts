import mongoose, { Schema } from "mongoose";

const profileSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Ad Soyad alanı zorunludur"],
    },
    about: {
      type: String,
      required: [true, "Hakkımda alanı zorunludur"],
    },
    email: {
      type: String,
      required: [true, "Email alanı zorunludur"],
      match: [/^\S+@\S+\.\S+$/, "Geçerli bir email adresi giriniz"],
    },
    github: {
      type: String,
      required: false,
    },
    linkedin: {
      type: String,
      required: false,
    },
    profileImage: {
      type: String,
      required: false,
      default: "/images/default-profile.jpg",
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

// Eğer model zaten tanımlıysa onu kullan, değilse yeni model oluştur
const Profile =
  mongoose.models.Profile || mongoose.model("Profile", profileSchema);

export default Profile;
