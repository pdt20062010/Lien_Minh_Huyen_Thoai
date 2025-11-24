  // --- Lấy phần tử ---
  const themeSelect = document.getElementById('theme');
  const fontSizeRange = document.getElementById('fontsize');
  const notifNews = document.getElementById('notif-news');
  const notifChamps = document.getElementById('notif-champs');
  const notifEvents = document.getElementById('notif-events');
  const saveBtn = document.querySelector('.save-btn');



  // --- Load cài đặt từ localStorage ---
  const settings = JSON.parse(localStorage.getItem('settings')) || {
    theme: 'dark',
    fontSize: 16,
    notifNews: true,
    notifChamps: true,
    notifEvents: true
  };

  // Áp dụng cài đặt khi mở trang
  themeSelect.value = settings.theme;
  fontSizeRange.value = settings.fontSize;
  notifNews.checked = settings.notifNews;
  notifChamps.checked = settings.notifChamps;
  notifEvents.checked = settings.notifEvents;
  document.body.style.fontSize = settings.fontSize + "px";
  applyTheme(settings.theme);

  // --- Hàm đổi theme ---
  function applyTheme(theme) {
    switch(theme){
      case "dark":
        document.body.style.backgroundColor = "#0a0f1a";
        break;
      
      case "arcane":
        document.body.style.backgroundColor = "#3a0ca3";
        break;
      case "blue-spirit":
        document.body.style.backgroundColor = "#1e3a8a";
        break;
      default:
        document.body.style.backgroundColor = "#0a0f1a";
    }
  }

  // --- Sự kiện thay đổi font và theme ---
  themeSelect.addEventListener('change', () => applyTheme(themeSelect.value));
  fontSizeRange.addEventListener('input', () => {
    document.body.style.fontSize = fontSizeRange.value + "px";
  });

  // --- Lưu cài đặt ---
  saveBtn.addEventListener('click', () => {
    const newSettings = {
      theme: themeSelect.value,
      fontSize: parseInt(fontSizeRange.value),
      notifNews: notifNews.checked,
      notifChamps: notifChamps.checked,
      notifEvents: notifEvents.checked
    };
    localStorage.setItem('settings', JSON.stringify(newSettings));
    alert("Đã lưu cài đặt! ✅");
        window.location.href = 'index.html';

  });

auth.onAuthStateChanged(async (user) => {
  const tenHienThi = document.getElementById("TenHienThi");

  if (user) {
    // Lấy UID từ user
    const uid = user.uid;

    try {
      // Lấy dữ liệu trong Firestore
      const userDoc = await db.collection("users").doc(uid).get();

      if (userDoc.exists) {
        const data = userDoc.data();
        tenHienThi.textContent = data.username; // Hiển thị username
      } else {
        tenHienThi.textContent = "Không tìm thấy tài khoản!";
      }

    } catch (error) {
      console.error("Lỗi lấy username:", error);
      tenHienThi.textContent = "Lỗi tải tên!";
    }

  } else {
    // Chưa đăng nhập
    tenHienThi.textContent = "Chưa đăng nhập";
  }
});


auth.onAuthStateChanged(async (user) => {
  const tenHienThi = document.getElementById("TenHienThi");
  const emailHienThi = document.getElementById("EmailHienThi");

  if (user) {
    // Lấy UID từ user
    const uid = user.uid;

    try {
      // Lấy dữ liệu trong Firestore
      const userDoc = await db.collection("users").doc(uid).get();

      if (userDoc.exists) {
        const data = userDoc.data();
        tenHienThi.textContent = data.username; // Hiển thị username
        emailHienThi.textContent = data.email;   // Hiển thị email
      } else {
        tenHienThi.textContent = "Không tìm thấy tài khoản!";
        emailHienThi.textContent = "Không tìm thấy email!";
      }

    } catch (error) {
      console.error("Lỗi lấy dữ liệu user:", error);
      tenHienThi.textContent = "Lỗi tải tên!";
      emailHienThi.textContent = "Lỗi tải email!";
    }

  } else {
    // Chưa đăng nhập
    tenHienThi.textContent = "Chưa đăng nhập";
    emailHienThi.textContent = "Chưa đăng nhập";
  }
});