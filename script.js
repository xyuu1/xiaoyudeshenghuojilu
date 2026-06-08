const emojis = ['😊', '🤗', '🥰', '😘', '😍', '🤩', '😇', '🙂', '😁', '😆', '🤗', '🤭', '🤔', '😋', '🥳'];

function getRandomEmoji() {
    return emojis[Math.floor(Math.random() * emojis.length)];
}

function getCurrentTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// 加载保存的头像
function loadAvatar() {
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) {
        document.getElementById('avatar-img').src = savedAvatar;
    }
}

// 页面加载时调用
loadAvatar();

// 头像上传功能
document.getElementById('avatar-upload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const avatarImg = document.getElementById('avatar-img');
            avatarImg.src = event.target.result;
            // 保存到localStorage
            localStorage.setItem('userAvatar', event.target.result);
            // 添加动画效果
            avatarImg.style.animation = 'pulse 0.5s ease';
            setTimeout(() => {
                avatarImg.style.animation = '';
            }, 500);
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('send-btn').addEventListener('click', function() {
    const nameInput = document.getElementById('message-name');
    const contentInput = document.getElementById('message-content');
    
    const name = nameInput.value.trim();
    const content = contentInput.value.trim();
    
    if (!name || !content) {
        alert('请填写名字和留言内容哦~');
        return;
    }
    
    const messageList = document.getElementById('message-list');
    
    const messageItem = document.createElement('div');
    messageItem.className = 'message-item';
    messageItem.innerHTML = `
        <div class="message-avatar">${getRandomEmoji()}</div>
        <div class="message-content">
            <div class="message-name">${name}</div>
            <div class="message-text">${content}</div>
            <div class="message-time">${getCurrentTime()}</div>
        </div>
    `;
    
    messageList.insertBefore(messageItem, messageList.firstChild);
    
    nameInput.value = '';
    contentInput.value = '';
    
    messageItem.style.animation = 'fadeInUp 0.5s ease';
});

document.getElementById('file-upload').addEventListener('change', function(e) {
    const files = e.target.files;
    const galleryGrid = document.getElementById('gallery-grid');
    
    // 隐藏提示文字
    const emptyText = galleryGrid.querySelector('.gallery-empty');
    if (emptyText) {
        emptyText.style.display = 'none';
    }
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        
        reader.onload = function(event) {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            
            if (file.type.startsWith('video/')) {
                galleryItem.innerHTML = `
                    <video src="${event.target.result}" controls class="gallery-video">
                    <div class="gallery-overlay">🎬 ${file.name}</div>
                `;
            } else {
                galleryItem.innerHTML = `
                    <img src="${event.target.result}" alt="${file.name}">
                    <div class="gallery-overlay">📷 ${file.name}</div>
                `;
            }
            
            galleryGrid.insertBefore(galleryItem, galleryGrid.firstChild);
            galleryItem.style.animation = 'fadeInUp 0.5s ease';
        };
        
        reader.readAsDataURL(file);
    }
    
    e.target.value = '';
});

document.getElementById('message-content').addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.ctrlKey) {
        document.getElementById('send-btn').click();
    }
});

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.1);
        }
    }
    
    .gallery-video {
        width: 100%;
        height: 150px;
        object-fit: cover;
    }
`;
document.head.appendChild(style);