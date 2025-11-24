document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById("emailLogin").value.trim();
    const password = document.getElementById("passwordLogin").value;

try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

    

// Check admin
if (user.email.toLowerCase() === "admin@gmail.com") {
    alert("XIN THÔNG BÁO BẠN ĐÃ ĐĂNG NHẬP VÀO TÀI KHOẢN ADMIN!");
}

else alert("Đăng nhập thành công!");


// CHỜ 300ms ĐỂ ALERT HIỆN
setTimeout(() => {
    window.location.href = "index.html";
}, 300);

        

    } catch (error) {
        if (error.code === "auth/user-not-found") alert("Email chưa đăng ký!");
        else if (error.code === "auth/wrong-password") alert("Sai mật khẩu!");
        else alert("Lỗi đăng nhập: Sai tên tài khoản hoặc mật khẩu");
    }
});
