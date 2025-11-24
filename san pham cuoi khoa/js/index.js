auth.onAuthStateChanged(async (user) => {
    const tenHienThi = document.getElementById("TenHienThi");
    const trangThai = document.getElementById("TRANGTHAI");

    if (user) {
        // Lấy UID
        const uid = user.uid;

        try {
            const userDoc = await db.collection("users").doc(uid).get();

            if (userDoc.exists) {
                const data = userDoc.data();
                tenHienThi.textContent = data.username;  // 👉 Hiện username
            } else {
                tenHienThi.textContent = "Không tìm thấy tài khoản!";
            }

        } catch (error) {
            tenHienThi.textContent = "Lỗi tải tên!";
        }

        // 👉 Khi đã đăng nhập → hiển thị trạng thái online
        trangThai.textContent = "🟢 Online";

        // 👉 Cập nhật Firestore (để nếu bạn cần admin xem ai online)
        await db.collection("users").doc(uid).set({
            isOnline: true
        }, { merge: true });

    } else {
        // Chưa đăng nhập
        tenHienThi.textContent = "Chưa đăng nhập";
        trangThai.textContent = "🔴 Không hoạt động";
    }
});


// Hàm chuyển trang khi nhấn nút
function chuyenTrang() {
  window.location.href = "dangky.html"; // Thay bằng đường dẫn
}

function chuyenTrangNhap() {
  window.location.href = "dangnhap.html"; // Thay bằng đường dẫn
}


        // Lấy nút di chuyển lên đầu trang
        var scrollToTopBtn = document.getElementById("scrollToTopBtn");

        // Đặt một biến để kiểm soát khi nào cần thay đổi trạng thái của nút
        var isButtonVisible = false;

        // Hàm xử lý cuộn trang
        function handleScroll() {
            var scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;
            var pageHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

            // Kiểm tra nếu cuộn xuống dưới 2/3 trang thì nút sẽ luôn hiển thị
            if (scrollPosition > pageHeight * 2 / 3) {
                if (!isButtonVisible) {
                    isButtonVisible = true;  // Đánh dấu nút đã hiện
                    scrollToTopBtn.style.display = "flex";  // Hiển thị nút
                    setTimeout(function () {
                        scrollToTopBtn.style.opacity = 1;  // Hiệu ứng mờ dần
                        scrollToTopBtn.style.transform = "translateY(0)";  // Hiệu ứng di chuyển lên
                    }, 100);  // Delay để tạo hiệu ứng
                }
            } else if (scrollPosition <= pageHeight / 3) { // Khi cuộn lên trên 1/3 trang, ẩn nút
                if (isButtonVisible) {
                    isButtonVisible = false;  // Đánh dấu nút đã ẩn
                    scrollToTopBtn.style.opacity = 0;   // Mờ dần khi cuộn lên
                    scrollToTopBtn.style.transform = "translateY(50px)";  // Đưa nút xuống dưới
                    setTimeout(function () {
                        scrollToTopBtn.style.display = "none";  // Ẩn nút khi cuộn lên
                    }, 400);  // Đợi cho đến khi hiệu ứng mờ hoàn tất
                }
            } else {
                if (!isButtonVisible) {
                    isButtonVisible = true;  // Đánh dấu nút đã hiện
                    scrollToTopBtn.style.display = "flex";  // Hiển thị nút
                    setTimeout(function () {
                        scrollToTopBtn.style.opacity = 1;  // Hiệu ứng mờ dần
                        scrollToTopBtn.style.transform = "translateY(0)";  // Hiệu ứng di chuyển lên
                    }, 100);  // Delay để tạo hiệu ứng
                }
            }
        }

        // Gọi ngay khi tải trang để kiểm tra vị trí cuộn ban đầu
        window.addEventListener("load", function () {
            handleScroll();  // Kiểm tra ngay khi trang tải xong
        });

        // Sử dụng sự kiện scroll với debounce
        let scrollTimeout;
        window.addEventListener("scroll", function () {
            // Nếu đang cuộn, đặt timeout để trì hoãn việc xử lý
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(handleScroll, 50); // Đặt thời gian trì hoãn 50ms
        });

        // Khi người dùng nhấp vào nút, cuộn trang lên đầu
        scrollToTopBtn.onclick = function (e) {
            e.preventDefault();  // Ngăn chặn hành động mặc định của thẻ <a>
            window.scrollTo({
                top: 0,
                behavior: "smooth"  // Hiệu ứng cuộn mượt
            });
        };



        // Animation on scroll
        document.addEventListener('scroll', () => {
            const elements = document.querySelectorAll('.fade-up');
            elements.forEach(element => {
                if (element.getBoundingClientRect().top < window.innerHeight) {
                    element.classList.add('visible');
                }
            });
        });
        let lastScrollTop = 0; // Biến lưu vị trí cuộn trang trước đó
        const nav = document.querySelector('nav'); // Lấy phần tử thanh điều hướng

        // Lắng nghe sự kiện scroll (cuộn trang)
        window.addEventListener('scroll', () => {
            let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

            // Kiểm tra nếu cuộn xuống
            if (currentScroll > lastScrollTop) {
                nav.style.top = "-60px"; // Ẩn thanh điều hướng (60px là chiều cao của navbar, có thể thay đổi theo ý)
            } else {
                nav.style.top = "0"; // Hiện thanh điều hướng
            }

            // Cập nhật vị trí cuộn trang mới
            lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // Đảm bảo không bị âm
        });
        // Scroll and highlight active link
        const links = document.querySelectorAll('nav a');
        const sections = document.querySelectorAll('.section');
        const officialLink = document.getElementById('official-link');

        window.addEventListener('scroll', () => {
            let currentSection = "";
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.scrollY >= sectionTop - 100) {
                    currentSection = section.getAttribute('id');
                }
            });

            links.forEach(link => {
                link.classList.remove('active');
                if (currentSection === link.getAttribute('href').slice(1)) {
                    link.classList.add('active');
                }
            });
        });

        // Keep "Trang Chính Thức" always glowing
        officialLink.addEventListener('mouseover', () => {
            officialLink.style.color = "#f0e130";
            officialLink.style.textShadow = "0 0 15px #f0e130";
        });

        officialLink.addEventListener('mouseleave', () => {
            officialLink.style.color = "#fff";
            officialLink.style.textShadow = "none";
        });



const userMenuBtn = document.getElementById("userMenuBtn");
const userMenu = document.getElementById("userMenu");
const logoutItem = document.getElementById("logoutItem");

// Toggle menu khi bấm icon
userMenuBtn.addEventListener("click", () => {
    userMenu.style.display = userMenu.style.display === "block" ? "none" : "block";
});

// Ẩn menu khi bấm ra ngoài
document.addEventListener("click", (e) => {
    if (!userMenu.contains(e.target) && !userMenuBtn.contains(e.target)) {
        userMenu.style.display = "none";
    }
});

const btnDangKy = document.getElementById("dangky");
const btnDangNhap = document.getElementById("dangnhap");

auth.onAuthStateChanged(async (user) => {
    if (user) {
        // Đã đăng nhập → hiện nút Đăng xuất
        logoutItem.style.display = "block";

        // Ẩn nút Đăng ký + Đăng nhập
        btnDangKy.style.display = "none";
        btnDangNhap.style.display = "none";

    } else {
        // Chưa đăng nhập → ẩn nút Đăng xuất
        logoutItem.style.display = "none";

        // Hiện lại nút Đăng ký + Đăng nhập
        btnDangKy.style.display = "block";
        btnDangNhap.style.display = "block";
    }
});


// Xử lý đăng xuất
logoutItem.addEventListener("click", async () => {

    const user = auth.currentUser;
    if (user) {
        await db.collection("users").doc(user.uid).set({
            isOnline: false
        }, { merge: true });
    }

    document.getElementById("TRANGTHAI").textContent = "🔴 Offline";

    await auth.signOut();
    alert("Đã đăng xuất.");
    window.location.reload();
});

    window.addEventListener("beforeunload", async () => {
    const user = auth.currentUser;
    if(user){
        await db.collection("users").doc(user.uid).update({ isOnline: false });
    }
});



 // Trang cài đặt
  const settingsBtn = document.getElementById('SettingItem');

  settingsBtn.addEventListener('click', () => {
    window.location.href = 'setting.html'; // Chuyển trang
  });


const email = document.getElementById("emailLogin");
const password = document.getElementById("passwordLogin");
auth.onAuthStateChanged(async (user) => {
    const adminMenu = document.getElementById("ADMIN");

    if (user) {
        // Nếu là admin → hiện nút ADMIN
        if (user.email.toLowerCase() === "admin@gmail.com") {
            adminMenu.style.display = "block";
        } else {
            adminMenu.style.display = "none";
        }
    } else {
        // Chưa đăng nhập → ẩn
        adminMenu.style.display = "none";
    }
});



// 👉 Khi click vào ADMIN → chuyển trang admin.html
document.getElementById("ADMIN").addEventListener("click", () => {
    window.location.href = "admin.html";
});



