// admin.js (thay thế file hiện tại bằng file này)
// Assumes firebase initialized in ./js/firebase.js and global 'db' exists (firebase.firestore())

document.getElementById('logoutBtn').addEventListener('click', () => {
    window.location.href = "index.html";
});

// ----------------------------
// SIDEBAR: chuyển section
// ----------------------------
const sidebarButtons = document.querySelectorAll('.sidebar button');
const sections = document.querySelectorAll('.section');

sidebarButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        sidebarButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const target = btn.dataset.section;
        sections.forEach(sec => {
            sec.style.display = sec.id === target ? 'block' : 'none';
        });

        if (target === "users") renderUsers();
        if (target === "champions") renderChampions();
        if (target === "news") renderNews();
    });
});

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

// Optional: simple CSS injection for form fields if your admin.css does not include classes.
// You can remove this block if you already have these styles in css/admin.css
(function injectAdminStyles(){
    const css = `
    .champ-input{ padding:8px; border-radius:6px; border:none; width:100%; }
    .champ-textarea{ padding:8px; border-radius:6px; border:none; width:100%; resize:vertical; max-height:120px; overflow-y:auto; }
    .btn-save{ padding:10px 15px; background:#4cc9f0; border:none; border-radius:6px; cursor:pointer; color:#000; }
    .btn-cancel{ padding:10px 15px; background:#e63946; border:none; border-radius:6px; cursor:pointer; color:#fff; }
    `;
    const s = document.createElement('style');
    s.textContent = css;
    document.head.appendChild(s);
})();

// ----------------------------
// RENDER CHAMPIONS (danh sách)
// ----------------------------
async function renderChampions() {
    const tbody = document.getElementById('championList');
    tbody.innerHTML = "<tr><td colspan='4'>Đang tải...</td></tr>";

    const snapshot = await db.collection("champions").orderBy("name").get();
    tbody.innerHTML = "";

    if (snapshot.empty) {
        tbody.innerHTML = "<tr><td colspan='4'>Chưa có tướng nào</td></tr>";
        return;
    }

    snapshot.forEach(doc => {
        const c = doc.data();
        const tr = document.createElement('tr');

        // nút Sửa chỉ truyền id
        tr.innerHTML = `
            <td>${escapeHtml(c.name)}</td>
            <td>${escapeHtml(c.role)}</td>
            <td><img src="${escapeAttr(c.image)}" alt="${escapeAttr(c.name)}" width="80"></td>
            <td>
                <button onclick="startEditChampion('${doc.id}')">Sửa</button>
                <button onclick="deleteChampion('${doc.id}')">Xóa</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ----------------------------
// ADD CHAMPION (form đẹp, gồm tên + mô tả từng chiêu)
// ----------------------------
function addChampion() {
    const tbody = document.getElementById('championList');

    if (document.getElementById('newChampionForm')) return;

    const tr = document.createElement('tr');
    tr.id = 'newChampionForm';

    tr.innerHTML = `
        <td colspan="4">
            <div style="
                display: grid;
                grid-template-columns: 150px 1fr;
                gap: 12px;
                padding: 15px;
                background: #0e1e33;
                border-radius: 10px;
                color: white;
            ">

                <h3 style="grid-column: span 2; margin:0 0 10px 0; color:#4cc9f0;">
                    ➕ Thêm tướng mới
                </h3>

                <label>Tên tướng</label>
                <input type="text" id="newName" placeholder="Ví dụ: Ahri" class="champ-input">

                <label>Vai trò</label>
                <input type="text" id="newRole" placeholder="Ví dụ: Pháp Sư" class="champ-input">

                <label>URL ảnh</label>
                <input type="text" id="newImage" placeholder="Dán link ảnh vào đây" class="champ-input">

                <label>Mô tả</label>
                <textarea id="newDescription" rows="2" placeholder="Giới thiệu tướng..." class="champ-textarea"></textarea>

                <!-- Q -->
                <label>Kỹ năng Q</label>
                <input type="text" id="newQ" placeholder="Tên kỹ năng Q" class="champ-input">
                <label>Mô tả Q</label>
                <textarea id="newDescQ" rows="2" placeholder="Mô tả chiêu Q..." class="champ-textarea"></textarea>

                <!-- W -->
                <label>Kỹ năng W</label>
                <input type="text" id="newW" placeholder="Tên kỹ năng W" class="champ-input">
                <label>Mô tả W</label>
                <textarea id="newDescW" rows="2" placeholder="Mô tả chiêu W..." class="champ-textarea"></textarea>

                <!-- E -->
                <label>Kỹ năng E</label>
                <input type="text" id="newE" placeholder="Tên kỹ năng E" class="champ-input">
                <label>Mô tả E</label>
                <textarea id="newDescE" rows="2" placeholder="Mô tả chiêu E..." class="champ-textarea"></textarea>

                <!-- R -->
                <label>Kỹ năng R</label>
                <input type="text" id="newR" placeholder="Tên kỹ năng R" class="champ-input">
                <label>Mô tả R</label>
                <textarea id="newDescR" rows="2" placeholder="Mô tả chiêu R..." class="champ-textarea"></textarea>

                <div style="grid-column: span 2; display:flex; gap:10px; margin-top:10px;">
                    <button id="saveChampionBtn" class="btn-save">Lưu</button>
                    <button id="cancelChampionBtn" class="btn-cancel">Hủy</button>
                </div>

            </div>
        </td>
    `;

    tbody.prepend(tr);

    // Cancel
    document.getElementById('cancelChampionBtn').addEventListener('click', () => tr.remove());

    // Save
    document.getElementById('saveChampionBtn').addEventListener('click', async () => {
        const name = document.getElementById('newName').value.trim();
        const role = document.getElementById('newRole').value.trim();
        const image = document.getElementById('newImage').value.trim();
        const description = document.getElementById('newDescription').value.trim();

        const Q = document.getElementById('newQ').value.trim();
        const descQ = document.getElementById('newDescQ').value.trim();

        const W = document.getElementById('newW').value.trim();
        const descW = document.getElementById('newDescW').value.trim();

        const E = document.getElementById('newE').value.trim();
        const descE = document.getElementById('newDescE').value.trim();

        const R = document.getElementById('newR').value.trim();
        const descR = document.getElementById('newDescR').value.trim();

        if (!name || !role || !image || !description || !Q || !descQ || !W || !descW || !E || !descE || !R || !descR) {
            alert("Vui lòng nhập đầy đủ tất cả thông tin!");
            return;
        }

        await db.collection("champions").add({
            name,
            role,
            image,
            description,
            skills: { Q, W, E, R },
            skillDescriptions: { Q: descQ, W: descW, E: descE, R: descR },
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        tr.remove();
        renderChampions();
    });
}

// ----------------------------
// START EDIT MODE (render form giống ADD nhưng preload data)
// ----------------------------
// We create a wrapper startEditChampion that fetches doc and calls renderEditForm
async function startEditChampion(id) {
    const docRef = db.collection("champions").doc(id);
    const snap = await docRef.get();
    if (!snap.exists) {
        alert("Tướng không tồn tại!");
        return;
    }
    const data = snap.data();
    renderEditChampionForm(id, data);
}

function renderEditChampionForm(id, c) {
    const tbody = document.getElementById('championList');

    // remove existing edit form if any
    const existing = document.getElementById('editChampionForm');
    if (existing) existing.remove();

    const tr = document.createElement('tr');
    tr.id = 'editChampionForm';

    // Ensure nested fields exist
    c.skills = c.skills || { Q: '', W: '', E: '', R: '' };
    c.skillDescriptions = c.skillDescriptions || { Q: '', W: '', E: '', R: '' };

    tr.innerHTML = `
        <td colspan="4">
            <div style="
                display: grid;
                grid-template-columns: 150px 1fr;
                gap: 12px;
                padding: 15px;
                background: #112233;
                border-radius: 10px;
                color: white;
            ">

                <h3 style="grid-column: span 2; margin:0 0 10px 0; color:#ffca3a;">
                    ✏️ Chỉnh sửa tướng
                </h3>

                <label>Tên tướng</label>
                <input id="editName" class="champ-input" value="${escapeAttr(c.name || '')}">

                <label>Vai trò</label>
                <input id="editRole" class="champ-input" value="${escapeAttr(c.role || '')}">

                <label>URL ảnh</label>
                <input id="editImage" class="champ-input" value="${escapeAttr(c.image || '')}">

                <label>Mô tả</label>
                <textarea id="editDescription" rows="2" class="champ-textarea">${escapeHtml(c.description || '')}</textarea>

                <!-- Q -->
                <label>Kỹ năng Q</label>
                <input id="editQ" class="champ-input" value="${escapeAttr((c.skills && c.skills.Q) || '')}">
                <label>Mô tả Q</label>
                <textarea id="editDescQ" rows="2" class="champ-textarea">${escapeHtml((c.skillDescriptions && c.skillDescriptions.Q) || '')}</textarea>

                <!-- W -->
                <label>Kỹ năng W</label>
                <input id="editW" class="champ-input" value="${escapeAttr((c.skills && c.skills.W) || '')}">
                <label>Mô tả W</label>
                <textarea id="editDescW" rows="2" class="champ-textarea">${escapeHtml((c.skillDescriptions && c.skillDescriptions.W) || '')}</textarea>

                <!-- E -->
                <label>Kỹ năng E</label>
                <input id="editE" class="champ-input" value="${escapeAttr((c.skills && c.skills.E) || '')}">
                <label>Mô tả E</label>
                <textarea id="editDescE" rows="2" class="champ-textarea">${escapeHtml((c.skillDescriptions && c.skillDescriptions.E) || '')}</textarea>

                <!-- R -->
                <label>Kỹ năng R</label>
                <input id="editR" class="champ-input" value="${escapeAttr((c.skills && c.skills.R) || '')}">
                <label>Mô tả R</label>
                <textarea id="editDescR" rows="2" class="champ-textarea">${escapeHtml((c.skillDescriptions && c.skillDescriptions.R) || '')}</textarea>

                <div style="grid-column: span 2; display:flex; gap:10px; margin-top:10px;">
                    <button id="updateChampionBtn" class="btn-save">Cập nhật</button>
                    <button id="cancelEditChampionBtn" class="btn-cancel">Hủy</button>
                </div>

            </div>
        </td>
    `;

    // Prepend edit form so it appears on top
    tbody.prepend(tr);

    document.getElementById('cancelEditChampionBtn').addEventListener('click', () => {
        tr.remove();
        renderChampions();
    });

    document.getElementById('updateChampionBtn').addEventListener('click', async () => {
        const name = document.getElementById('editName').value.trim();
        const role = document.getElementById('editRole').value.trim();
        const image = document.getElementById('editImage').value.trim();
        const description = document.getElementById('editDescription').value.trim();

        const Q = document.getElementById('editQ').value.trim();
        const descQ = document.getElementById('editDescQ').value.trim();

        const W = document.getElementById('editW').value.trim();
        const descW = document.getElementById('editDescW').value.trim();

        const E = document.getElementById('editE').value.trim();
        const descE = document.getElementById('editDescE').value.trim();

        const R = document.getElementById('editR').value.trim();
        const descR = document.getElementById('editDescR').value.trim();

        if (!name || !role || !image || !description || !Q || !descQ || !W || !descW || !E || !descE || !R || !descR) {
            alert("Vui lòng nhập đầy đủ tất cả thông tin!");
            return;
        }

        await db.collection("champions").doc(id).update({
            name,
            role,
            image,
            description,
            skills: { Q, W, E, R },
            skillDescriptions: { Q: descQ, W: descW, E: descE, R: descR },
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        tr.remove();
        renderChampions();
    });
}

// ----------------------------
// DELETE
// ----------------------------
async function deleteChampion(id) {
    if (!confirm("Xóa tướng này?")) return;
    await db.collection("champions").doc(id).delete();
    renderChampions();
}

// ----------------------------
// NEWS (giữ logic cũ, không đổi)
// ----------------------------
// ----------------------------
// RENDER NEWS LIST
// ----------------------------
async function renderNews() {
    const tbody = document.getElementById('newsList');
    tbody.innerHTML = "<tr><td colspan='4'>Đang tải...</td></tr>";

    const snapshot = await db.collection("news").orderBy("date", "desc").get();
    tbody.innerHTML = "";

    if (snapshot.empty) {
        tbody.innerHTML = "<tr><td colspan='4'>Chưa có tin tức nào</td></tr>";
        return;
    }

    snapshot.forEach(doc => {
        const n = doc.data();
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${escapeHtml(n.title)}</td>
            <td>${escapeHtml(n.description)}</td>
            <td><img src="${escapeAttr(n.image)}" alt="${escapeAttr(n.title)}" width="100"></td>
            <td>
                <button onclick="startEditNews('${doc.id}')">Sửa</button>
                <button onclick="deleteNews('${doc.id}')">Xóa</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ----------------------------
// ADD NEWS
// ----------------------------
function addNews() {
    const tbody = document.getElementById('newsList');
    if (document.getElementById('newNewsForm')) return;

    const tr = document.createElement('tr');
    tr.id = 'newNewsForm';
    tr.innerHTML = `
        <td colspan="4">
            <div style="
                display: grid;
                grid-template-columns: 150px 1fr;
                gap: 12px;
                padding: 15px;
                background: #0e1e33;
                border-radius: 10px;
                color: white;
            ">
                <h3 style="grid-column: span 2; margin:0 0 10px 0; color:#4cc9f0;">
                    ➕ Thêm tin tức mới
                </h3>

                <label>Tiêu đề</label>
                <input type="text" id="newTitle" class="news-input" placeholder="Tên sự kiện">

                <label>Mô tả</label>
                <textarea id="newDescription" class="news-textarea" rows="2" placeholder="Mô tả sự kiện"></textarea>

                <label>URL ảnh</label>
                <input type="text" id="newImage" class="news-input" placeholder="Link ảnh">

                <div style="grid-column: span 2; display:flex; gap:10px; margin-top:10px;">
                    <button id="saveNewsBtn" class="btn-save">Lưu</button>
                    <button id="cancelNewsBtn" class="btn-cancel">Hủy</button>
                </div>
            </div>
        </td>
    `;
    tbody.prepend(tr);

    document.getElementById('cancelNewsBtn').addEventListener('click', () => tr.remove());

    document.getElementById('saveNewsBtn').addEventListener('click', async () => {
        const title = document.getElementById('newTitle').value.trim();
        const description = document.getElementById('newDescription').value.trim();
        const image = document.getElementById('newImage').value.trim();
        const date = new Date().toLocaleDateString();

        if (!title || !description || !image) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        await db.collection("news").add({ title, description, image, date, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
        tr.remove();
        renderNews();
    });
}

// ----------------------------
// EDIT NEWS
// ----------------------------
async function startEditNews(id) {
    const docRef = db.collection("news").doc(id);
    const snap = await docRef.get();
    if (!snap.exists) {
        alert("Tin tức không tồn tại!");
        return;
    }
    renderEditNewsForm(id, snap.data());
}

function renderEditNewsForm(id, n) {
    const tbody = document.getElementById('newsList');
    const existing = document.getElementById('editNewsForm');
    if (existing) existing.remove();

    const tr = document.createElement('tr');
    tr.id = 'editNewsForm';
    tr.innerHTML = `
        <td colspan="4">
            <div style="
                display: grid;
                grid-template-columns: 150px 1fr;
                gap: 12px;
                padding: 15px;
                background: #112233;
                border-radius: 10px;
                color: white;
            ">
                <h3 style="grid-column: span 2; margin:0 0 10px 0; color:#ffca3a;">
                    ✏️ Chỉnh sửa tin tức
                </h3>

                <label>Tiêu đề</label>
                <input id="editTitle" class="news-input" value="${escapeAttr(n.title || '')}">

                <label>Mô tả</label>
                <textarea id="editDescription" class="news-textarea" rows="2">${escapeHtml(n.description || '')}</textarea>

                <label>URL ảnh</label>
                <input id="editImage" class="news-input" value="${escapeAttr(n.image || '')}">

                <div style="grid-column: span 2; display:flex; gap:10px; margin-top:10px;">
                    <button id="updateNewsBtn" class="btn-save">Cập nhật</button>
                    <button id="cancelEditNewsBtn" class="btn-cancel">Hủy</button>
                </div>
            </div>
        </td>
    `;
    tbody.prepend(tr);

    document.getElementById('cancelEditNewsBtn').addEventListener('click', () => {
        tr.remove();
        renderNews();
    });

    document.getElementById('updateNewsBtn').addEventListener('click', async () => {
        const title = document.getElementById('editTitle').value.trim();
        const description = document.getElementById('editDescription').value.trim();
        const image = document.getElementById('editImage').value.trim();
        const date = new Date().toLocaleDateString();

        if (!title || !description || !image) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        await db.collection("news").doc(id).update({ title, description, image, date, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
        tr.remove();
        renderNews();
    });
}

// ----------------------------
// DELETE NEWS
// ----------------------------
async function deleteNews(id) {
    if (!confirm("Xóa tin tức này?")) return;
    await db.collection("news").doc(id).delete();
    renderNews();
}

// ----------------------------
// ESCAPE HELPERS
// ----------------------------
function escapeHtml(str) {
    if (!str) return '';
    return String(str).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}
function escapeAttr(str) {
    if (!str) return '';
    return String(str).replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

// addNews, editNews... keep as before

// ----------------------------
// USERS (giữ logic cũ)
// ----------------------------
async function renderUsers() {
    const tbody = document.getElementById("userList");
    tbody.innerHTML = "<tr><td colspan='3'>Đang tải...</td></tr>";
    
    const snapshot = await db.collection("users").orderBy("createdAt", "desc").get();
    tbody.innerHTML = "";

    const ADMIN_EMAIL = "ADMIN@gmail.com";
    if (snapshot.empty) {
        tbody.innerHTML = "<tr><td colspan='3'>Chưa có người dùng nào</td></tr>";
        return;
    }

    snapshot.forEach(doc => {
        const u = doc.data();
        if (u.email === ADMIN_EMAIL) return;
        const status = u.isOnline ? "🟢 Online" : "🔴 Offline";
        tbody.innerHTML += `
            <tr>
                <td>${escapeHtml(u.email)}</td>
                <td>${escapeHtml(u.username)}</td>
                <td>${status}</td>
            </tr>
        `;
    });
}
