// js/champion.js

// Lấy id tướng từ URL
const params = new URLSearchParams(window.location.search);
const championId = params.get("id");

// Container hiển thị
const box = document.getElementById("championDetail");

// ----------------------------
// HELPERS
// ----------------------------
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

function escapeAttr(str) {
    return escapeHtml(str);
}

// ----------------------------
// HIỂN THỊ TƯỚNG
// ----------------------------
if (!championId) {
    box.innerHTML = "<p>Chưa có tướng nào được thêm.</p>";
} else {
    db.collection("champions").doc(championId).get()
    .then(doc => {
        if (!doc.exists) {
            box.innerHTML = "<p>Tướng không tồn tại!</p>";
            return;
        }

        const c = doc.data();

        // đảm bảo có các trường skills và skillDescriptions
        const skills = c.skills || {};
        const skillDescriptions = c.skillDescriptions || {};

        // hiển thị
        box.innerHTML = `
    <img src="${escapeAttr(c.image || '')}" alt="${escapeAttr(c.name || '')}">
    <h1>${escapeHtml(c.name || '')}</h1>
    <p><strong>Vai trò:</strong> ${escapeHtml(c.role || '')}</p>

    <hr style="margin:20px 0; border-color: rgba(255,255,255,0.08)">

    <h2>Mô tả</h2>
    <p>${escapeHtml(c.description || 'Chưa có mô tả')}</p>

    <h2 style="margin-top:16px;">Kỹ năng</h2>
    <div class="skills">
        <div class="skill">
            <strong>Q — ${escapeHtml(skills.Q || '')}</strong>
            <div style="margin-top:6px; font-size:14px; color:#e8f1ff;">
                ${escapeHtml(skillDescriptions.Q || 'Chưa có mô tả')}
            </div>
        </div>

        <div class="skill">
            <strong>W — ${escapeHtml(skills.W || '')}</strong>
            <div style="margin-top:6px; font-size:14px; color:#e8f1ff;">
                ${escapeHtml(skillDescriptions.W || 'Chưa có mô tả')}
            </div>
        </div>

        <div class="skill">
            <strong>E — ${escapeHtml(skills.E || '')}</strong>
            <div style="margin-top:6px; font-size:14px; color:#e8f1ff;">
                ${escapeHtml(skillDescriptions.E || 'Chưa có mô tả')}
            </div>
        </div>

        <div class="skill">
            <strong>R — ${escapeHtml(skills.R || '')}</strong>
            <div style="margin-top:6px; font-size:14px; color:#e8f1ff;">
                ${escapeHtml(skillDescriptions.R || 'Chưa có mô tả')}
            </div>
        </div>
    </div>
`;
       
    })
    .catch(err => {
        console.error(err);
        box.innerHTML = "<p>Có lỗi khi tải dữ liệu. Kiểm tra console.</p>";
    });
}
