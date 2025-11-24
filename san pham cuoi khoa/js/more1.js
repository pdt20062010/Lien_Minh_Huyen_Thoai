// js/more1.js
const container = document.createElement('div');
container.classList.add('news-grid');
document.body.appendChild(container);

// Render tướng
function renderChampionsMore1(snapshot) {
    container.innerHTML = '';

    if (snapshot.empty) {
        // Tạo thông báo khi không có tướng
        const emptyDiv = document.createElement('div');
        emptyDiv.style.cssText = `
            grid-column: 1 / -1; /* chiếm cả hàng */
            color: #fff;
            text-align: center;
            padding: 50px 0;
            font-size: 1.2rem;
        `;
        emptyDiv.textContent = 'Chưa có tướng nào';
        container.appendChild(emptyDiv);
        return;
    }

    snapshot.forEach(doc => {
        const c = doc.data();
        const card = document.createElement('div');
        card.className = 'news-card';
        card.innerHTML = `
            <img src="${c.image || 'https://via.placeholder.com/600x335?text=No+Image'}" alt="${c.name}">
            <div class="news-card-content">
                <h3>${escapeHtml(c.name)}</h3>
                <p class="desc">Vai trò: ${escapeHtml(c.role)}</p>
                <a class="detail-link">Xem chi tiết →</a>
            </div>
        `;

        card.addEventListener('click', () => {
            window.location.href = `champion.html?id=${doc.id}`;
        });

        container.appendChild(card);
    });
}

// helper escapeHtml
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

// listener realtime
db.collection("champions").orderBy("name").onSnapshot(renderChampionsMore1);
