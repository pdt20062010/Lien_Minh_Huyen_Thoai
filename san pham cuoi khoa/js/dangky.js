const btnRegister = document.getElementById("BtnRegister");

const signUp = async (e) => {
  e.preventDefault();

  // Lấy giá trị từ form (IDs trong HTML phải khớp)
  const email = document.getElementById("email").value.trim();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("passwordConfirm").value;

  // Basic validation
  if (!email || !username || !password || !confirmPassword) {
    alert("Vui lòng điền đủ thông tin.");
    return;
  }

  // Email format cơ bản
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Email không hợp lệ.");
    return;
  }

  if (password.length < 6) {
    alert("Mật khẩu phải có ít nhất 6 ký tự.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Mật khẩu không khớp.");
    return;
  }

  // Vô hiệu hóa nút để tránh submit nhiều lần
  btnRegister.disabled = true;
  btnRegister.textContent = "Đang xử lý...";

  try {
    // 1) Kiểm tra username đã tồn tại trong Firestore chưa
    const usernameQuery = await db.collection("users")
      .where("usernameLower", "==", username.toLowerCase())
      .limit(1)
      .get();

    if (!usernameQuery.empty) {
      alert("Tên người dùng đã có người dùng. Vui lòng chọn tên khác.");
      btnRegister.disabled = false;
      btnRegister.textContent = "Đăng ký";
      return;
    }

    // 2) Tạo user bằng Firebase Auth (email/password)
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const uid = userCredential.user.uid;

    // 3) Lưu thông tin user vào Firestore (không lưu password)
    const userData = {
  uid: uid,
  email: email,
  username: username,
  usernameLower: username.toLowerCase(),
  createdAt: firebase.firestore.FieldValue.serverTimestamp()
};
await db.collection("users").doc(uid).set(userData);



    alert("Đăng ký thành công! Bạn sẽ được chuyển đến trang đăng nhập.");
    window.location.href = "dangnhap.html";
  } catch (error) {
    console.error("Register error:", error);

    // Xử lý lỗi phổ biến của Firebase Auth
    if (error.code === "auth/email-already-in-use") {
      alert("Email này đã được sử dụng. Vui lòng dùng email khác.");
    } else if (error.code === "auth/invalid-email") {
      alert("Email không hợp lệ.");
    } else if (error.code === "auth/weak-password") {
      alert("Mật khẩu quá yếu. Vui lòng chọn mật khẩu khó hơn (ít nhất 6 ký tự).");
    } else {
      alert("Đăng ký thất bại. Vui lòng thử lại sau.");
    }
  } finally {
    btnRegister.disabled = false;
    btnRegister.textContent = "Đăng ký";
  }
};

btnRegister.addEventListener("click", signUp);