/* ==========================================================
   إعدادات المتجر
   ========================================================== */
const STORE_CONFIG = {
  brandName: "Onefournine",
  footerText: "Senior 2027",
  developer: "Developed BY HAMZA",
  socialLinks: {
    instagram: "https://www.instagram.com/q_7vmza/",
    tiktok: "https://www.tiktok.com/@q_7amza?_r=1&_t=ZS-97S7RofomcK"
  },
  // رقم واتساب الدولي بدون + ولا صفر (مصر = 20)
  whatsappNumber: "201066350362",
  // لغة رسالة واتساب اللي بتوصل لصاحب المتجر: "ar" = عربي دايمًا، "auto" = نفس لغة العميل
  waLang: "ar",
  // عدد المنتجات اللي بتظهر لكل قسم في الصفحة الرئيسية (الباقي في صفحة القسم)
  sectionPreview: 8,
  // الشحن: فعّله (true) لإظهار حقلي المحافظة والعنوان
  shippingEnabled: true,
  shippingFee: 100,   // رسوم الشحن الثابتة (ج.م)
  governorates: ["القاهرة","الجيزة","الإسكندرية","القليوبية","الشرقية","الدقهلية","الغربية","المنوفية","كفر الشيخ","البحيرة","دمياط","بورسعيد","الإسماعيلية","السويس","شمال سيناء","جنوب سيناء","الفيوم","بني سويف","المنيا","أسيوط","سوهاج","قنا","الأقصر","أسوان","البحر الأحمر","الوادي الجديد","مطروح"],
  // أضف هنا رابط الخادم عند تشغيل Backend. فارغ = لا يتم حفظ الطلب على خادم
  ordersEndpoint: "",   // مثال: "https://your-server.com/api/orders"
  uploadEndpoint: "",   // مثال: "https://your-server.com/api/upload" (يرجع { url })
  maxProofMB: 5,
  // دليل المقاسات (سم). ⚠ راجع الأرقام دي بقياسات الهودي الفعلية قبل النشر وعدّلها من هنا.
  sizeChart: {
    unit: "سم",
    columns: ["عرض الصدر", "الطول", "طول الكم"],
    rows: {
      S:   [56, 68, 60],
      M:   [58, 70, 62],
      L:   [60, 72, 63],
      XL:  [62, 74, 64],
      XXL: [64, 76, 65]
    }
  },
  // اتركهم فارغين = المتجر يستخدم قايمة المنتجات الموجودة تحت في الملف فقط
  firebase: { projectId: "onefournine-64aac", apiKey: "AIzaSyBB6IiTJsuc3okPZINrsayYl6fU1m9fsYY" },
  payments: {
    cod: { label: "الدفع عند الاستلام (COD)", type: "cod", value: "", recipient: "" },
    instapay: { label: "Instapay", type: "egp", value: "hamzayousry12@instapay", recipient: "حمزه", link: "https://ipn.eg/S/hamzayousry12/instapay/7mnK13" },
    vodafone: { label: "Vodafone Cash", type: "egp", value: "01066350362", recipient: "حمزه", link: "http://vf.eg/vfcash?id=mt&qrId=o6CZUu" }
  },
  imgbbUrl: "https://api.imgbb.com/1/upload",
  // ⚠ لا تضع المفتاح هنا في الملف المنشور: أي زائر يقدر يشوفه. استخدم Backend
  imgbbKey: "5b5b9be41904239d9320e800dfe90db8"
};
