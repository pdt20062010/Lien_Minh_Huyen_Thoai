// more2.js
// Firebase đã init trong more2.html

const newsGrid = document.getElementById("newsGrid");

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

// ----------------------------
// RENDER NEWS LIST
// ----------------------------
async function renderNews() {
    newsGrid.innerHTML = "<p style='color:white'>Đang tải...</p>";

    const snapshot = await firebase.firestore().collection("news").orderBy("date", "desc").get();
    if (snapshot.empty) {
        newsGrid.innerHTML = "<p style='color:white'>Chưa có sự kiện nào.</p>";
        return;
    }

    newsGrid.innerHTML = "";

    snapshot.forEach(doc => {
        const n = doc.data();
        const id = doc.id;

        const card = document.createElement("div");
        card.className = "news-card";
        card.style.cursor = "pointer";
        card.innerHTML = `
            ${n.image ? `<img src="${escapeHtml(n.image)}" alt="${escapeHtml(n.title)}">` : ""}
            <div class="news-card-content">
                <h3>${escapeHtml(n.title)}</h3>
                <p>${escapeHtml(n.description)}</p>
                <div class="date">${escapeHtml(n.date || '')}</div>
            </div>
        `;

        // Khi click vào card, chuyển sang trang chi tiết
        card.addEventListener("click", () => {
            window.location.href = `news-detail.html?id=${id}`;
        });

        newsGrid.appendChild(card);
    });
}

// ----------------------------
// INIT
// ----------------------------
renderNews();
