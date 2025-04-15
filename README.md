# Modern Portfolyo Websitesi

Bu proje, modern ve etkileyici bir portfolyo websitesi oluşturmak için geliştirilmiştir. Next.js, MongoDB ve Tailwind CSS kullanılarak oluşturulmuştur.

## Özellikler

- Modern ve responsive tasarım
- Admin paneli ile içerik yönetimi
- MongoDB veritabanı entegrasyonu
- JWT tabanlı kimlik doğrulama
- İletişim formu ve email bildirimleri
- Proje ve yetenek yönetimi

## Kurulum

1. Projeyi klonlayın:

```bash
git clone https://github.com/your-username/portfolio.git
cd portfolio
```

2. Bağımlılıkları yükleyin:

```bash
npm install
```

3. `.env` dosyasını oluşturun ve gerekli değişkenleri ayarlayın:

```
MONGODB_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=your-secret-key-here
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
```

4. MongoDB'yi başlatın ve veritabanını oluşturun.

5. Geliştirme sunucusunu başlatın:

```bash
npm run dev
```

## Kullanım

- Ana sayfa: `http://localhost:3000`
- Admin paneli: `http://localhost:3000/admin/login`

## Teknolojiler

- Next.js
- MongoDB
- Tailwind CSS
- JWT
- Nodemailer
- Framer Motion

## Lisans

MIT
