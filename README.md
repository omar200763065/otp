# Enterprise OTP SaaS Platform (Production Ready) 🚀

منصة OTP احترافية كاملة متكاملة مخصصة كخدمة مستقلة (OTP SaaS Platform) مماثلة لخدمات Twilio Verify و MessageBird و Firebase Phone Auth، تعمل بنظام أمان مشدد ومبنية على أحدث التقنيات القابلة للتوسع للعمل على خادم VPS مستقل عبر Docker و Nginx.

---

## 🌟 الميزات الرئيسية (Key Features)

1. **محرك الواتساب المزدوج (Dual WhatsApp Engine)**:
   - **الخيار الأول (QR Code Pairing)**: ربط سريع جداً عن طريق مسح رمز QR Code مباشرة من لوحة التحكم من أي رقم واتساب عادي أو أعمال بدون توكن أو موافقة من Meta.
   - **الخيار الثاني (Meta Cloud API)**: للتوسع والإنتاج الضخم عبر Meta Graph API وقوالب الرسائل المعتمدة.
2. **أمان عالي وشديد (Military-Grade OTP Security)**:
   - تشفير الرموز في قاعدة البيانات باستعمال **HMAC/SHA-256**.
   - عدم حفظ الرمز كنص صريح إطلاقاً.
   - انتهاء الصلاحية بعد 5 دقائق تلقائياً.
   - حظر محاولات Brute-Force (حد أقصى 3 محاولات خاطئة).
   - حماية Cooldown بين الطلبات (60 ثانية).
   - حماية ضد Spam والـ IP Blacklist / Whitelist.
   - حماية Helmet, CORS, CSRF, SQL Injection Protection.
3. **إدارة مفاتيح API Keys**: مفاتيح مشفرة مخصصة لكل تطبيق (`otp_live_...` / `otp_test_...`).
4. **لوحة تحكّم عصرية (React 19 Dashboard)**:
   - تصميم **Glassmorphism** عصري يدعم الوضع الليلي والنهاري (Dark / Light Mode).
   - دعم للغة العربية والإنجليزية RTL / LTR.
   - إحصائيات تفاعلية مباشرة ورسم بياني لعدّاد الرسائل والنجاح بـ Recharts.
   - عرض مباشر لـ QR Code الواتساب ومتابعة الاتصال لحظياً.
   - متابعة حالة الخوادم وقواعد البيانات (PostgreSQL, Redis, BullMQ).
5. **تطبيق Flutter العميل (SDK Sample)**: كلاس `OtpClientService` وشاشة Flutter مع حقول 6 أرقام تلقائية وعداد تنازلي.
6. **جاهزة للنشر بـ Docker & Nginx**: ملف `docker-compose.yml` يضمن التشغيل الفوري بأمر واحد.

---

## 📁 هيكل المجلدات وشرح الملفات (Project Structure)

```text
otp/
├── backend/                        # خادم NestJS (Clean Architecture)
│   ├── prisma/
│   │   ├── schema.prisma           # مخطط قاعدة البيانات (Prisma ORM)
│   │   └── seed.ts                 # البيانات الأساسية المبدئية (Seed Data)
│   ├── src/
│   │   ├── common/                 # الحمايات والمساعدات (Guards, Utils, Decorators)
│   │   │   ├── guards/             # ApiKeyGuard, JwtAuthGuard, RolesGuard
│   │   │   └── utils/              # CryptoUtil (HMAC SHA-256 Hashing)
│   │   ├── modules/
│   │   │   ├── auth/               # تسجيل دخول المدراء بـ JWT
│   │   │   ├── api-key/            # إدارة وتوليد API Keys
│   │   │   ├── apps/               # إدارة التطبيقات المرتبطة
│   │   │   ├── otp/                # المحرك الرئيسي لـ (send, verify, resend, cancel)
│   │   │   ├── whatsapp/           # Dual Engine (Baileys QR Session & Meta Cloud API)
│   │   │   ├── security/           # Blacklist / Whitelist / Audit Logs
│   │   │   └── dashboard/          # تجميع الإحصائيات ورصد الخدمة
│   │   ├── app.module.ts
│   │   └── main.ts                 # تفعيل Swagger UI, Helmet, CORS
├── frontend/                       # لوحة التحكم (React 19 + Vite + MUI)
│   ├── src/
│   │   ├── components/Layout/      # Navbar, Glassmorphism Drawer Sidebar
│   │   ├── context/                # AuthContext, ColorModeContext (Dark/Light/RTL)
│   │   ├── i18n/                   # ترجمة عربية وإنجيزية (i18next)
│   │   ├── pages/                  # Overview, AppsKeys, WhatsApp (QR Code Pairing), Logs, Security
│   │   ├── theme/                  # ثيم MUI العصري
│   │   └── App.tsx
├── flutter_example/                # كود تطبيق Flutter للربط السريع
│   ├── lib/
│   │   ├── services/otp_service.dart   # OtpClientService المتصل بالـ API
│   │   └── screens/otp_verification_screen.dart # واجهة الإدخال والعداد
├── docker/
│   └── nginx/nginx.conf            # Nginx Reverse Proxy & Rate Limiter
├── Dockerfile.backend              # بناء تطبيق NestJS
├── Dockerfile.frontend             # بناء لوحة React + Nginx
└── docker-compose.yml              # تشغيل PostgreSQL + Redis + Backend + Gateway
```

---

## 🛠️ التشغيل والنشر المباشر (Deployment with Docker)

### 1. الاستنساخ وإعداد البيئة
قم بإنشاء ملف `.env` بناءً على `.env.example`:
```bash
cp .env.example .env
```

### 2. تشغيل المشروع بالكامل عبر Docker
```bash
docker compose up --build -d
```

بعد التشغيل، ستكون المنصة متاحة في الرابط التالي:
- **لوحة التحكم (Frontend Dashboard)**: `http://localhost` أو `http://your-vps-ip`
- **توثيق Swagger API**: `http://localhost/api/docs` أو `http://localhost:3000/api/docs`

---

## 🔑 بيانات التسجيل المبدئية (Initial Admin Credentials)

- **البريد الإلكتروني**: `admin@otpsaas.com`
- **كلمة المرور**: `AdminPassword123!`
- **مفتاح API التجريبي المبدئي (Live Key)**: `otp_live_demo_key_998877665544332211`

---

## 📲 مسح كود الـ QR Code وربط الواتساب
1. سجل الدخول إلى لوحة التحكم `http://localhost`.
2. اذهب إلى تبويب **إعدادات WhatsApp**.
3. ستجد رمز **QR Code** الظاهر على الشاشة.
4. من تطبيق الواتساب على هاتفك، اختر **الأجهزة المرتبطة > ربط جهاز** وقم بمسح الـ QR.
5. سيتصل رقمك فوراً بالمنصة وتصبح جاهزة لإرسال الرسائل فورياً!
