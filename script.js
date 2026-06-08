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

// 格式化日期时间用于显示
function formatDateTime(dateStr) {
    if (!dateStr) return getCurrentTime();
    try {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    } catch (e) {
        return dateStr;
    }
}

// 照片数据
let photos = [];
let pendingPhoto = null;

// 加载保存的头像
function loadAvatar() {
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) {
        document.getElementById('avatar-img').src = savedAvatar;
    }
}

// 加载保存的照片
function loadPhotos() {
    const savedPhotos = localStorage.getItem('userPhotos');
    if (savedPhotos) {
        photos = JSON.parse(savedPhotos);
        renderPhotos();
    }
}

// 保存照片到localStorage
function savePhotos() {
    localStorage.setItem('userPhotos', JSON.stringify(photos));
}

// 渲染照片列表
function renderPhotos() {
    const galleryGrid = document.getElementById('gallery-grid');
    const emptyText = galleryGrid.querySelector('.gallery-empty');
    
    if (emptyText) {
        emptyText.style.display = photos.length === 0 ? 'block' : 'none';
    }
    
    galleryGrid.innerHTML = '';
    
    if (photos.length === 0) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'gallery-empty';
        emptyDiv.textContent = '还没有照片哦，快上传一些吧~ 📷';
        galleryGrid.appendChild(emptyDiv);
        return;
    }
    
    // 按时间倒序渲染（最新的在最前面）
    const sortedPhotos = [...photos].sort((a, b) => new Date(b.time || b.createdAt) - new Date(a.time || a.createdAt));
    
    sortedPhotos.forEach((photo, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.style.animation = 'fadeInUp 0.5s ease';
        
        if (photo.type === 'video') {
            galleryItem.innerHTML = `
                <video src="${photo.src}" muted playsinline></video>
                <div class="gallery-overlay"><span>👁️ 点击查看</span></div>
                <div class="gallery-info">
                    <div class="gallery-title">${photo.title || '未命名'}</div>
                    <div class="gallery-desc">${photo.desc || ''}</div>
                    <div class="gallery-time">${formatDateTime(photo.time)}</div>
                </div>
            `;
        } else {
            galleryItem.innerHTML = `
                <img src="${photo.src}" alt="${photo.title || '照片'}">
                <div class="gallery-overlay"><span>👁️ 点击查看</span></div>
                <div class="gallery-info">
                    <div class="gallery-title">${photo.title || '未命名'}</div>
                    <div class="gallery-desc">${photo.desc || ''}</div>
                    <div class="gallery-time">${formatDateTime(photo.time)}</div>
                </div>
            `;
        }
        
        galleryItem.addEventListener('click', () => openModal(photo));
        galleryGrid.appendChild(galleryItem);
    });
}

// 打开模态框
function openModal(photo) {
    const modal = document.getElementById('photo-modal');
    const modalMedia = document.getElementById('modal-media');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalTime = document.getElementById('modal-time');
    
    if (photo.type === 'video') {
        modalMedia.innerHTML = `<video src="${photo.src}" controls autoplay></video>`;
    } else {
        modalMedia.innerHTML = `<img src="${photo.src}" alt="${photo.title || '照片'}">`;
    }
    
    modalTitle.textContent = photo.title || '未命名';
    modalDesc.textContent = photo.desc || '';
    modalTime.textContent = formatDateTime(photo.time);
    
    modal.classList.add('active');
}

// 关闭模态框
function closeModal() {
    const modal = document.getElementById('photo-modal');
    modal.classList.remove('active');
    const modalMedia = document.getElementById('modal-media');
    modalMedia.innerHTML = '';
}

// 重置上传表单
function resetUploadForm() {
    const uploadForm = document.getElementById('upload-form');
    const uploadPreview = document.getElementById('upload-preview');
    const photoTitle = document.getElementById('photo-title');
    const photoDesc = document.getElementById('photo-desc');
    const photoTime = document.getElementById('photo-time');
    
    uploadForm.classList.remove('active');
    uploadPreview.classList.remove('show');
    uploadPreview.src = '';
    photoTitle.value = '';
    photoDesc.value = '';
    photoTime.value = '';
    pendingPhoto = null;
}

// 页面加载时调用
loadAvatar();
loadPhotos();

// 头像上传功能
document.getElementById('avatar-upload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const avatarImg = document.getElementById('avatar-img');
            avatarImg.src = event.target.result;
            localStorage.setItem('userAvatar', event.target.result);
            avatarImg.style.animation = 'pulse 0.5s ease';
            setTimeout(() => {
                avatarImg.style.animation = '';
            }, 500);
        };
        reader.readAsDataURL(file);
    }
});

// 文件上传 - 显示表单
document.getElementById('file-upload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const uploadForm = document.getElementById('upload-form');
            const uploadPreview = document.getElementById('upload-preview');
            const photoTime = document.getElementById('photo-time');
            
            // 设置默认时间为现在
            const now = new Date();
            const localDateTime = now.toISOString().slice(0, 16);
            photoTime.value = localDateTime;
            
            uploadPreview.src = event.target.result;
            uploadPreview.classList.add('show');
            uploadForm.classList.add('active');
            
            pendingPhoto = {
                src: event.target.result,
                type: file.type.startsWith('video/') ? 'video' : 'image',
                createdAt: getCurrentTime()
            };
        };
        reader.readAsDataURL(file);
    }
    e.target.value = '';
});

// 取消上传
document.getElementById('cancel-btn').addEventListener('click', function() {
    resetUploadForm();
});

// 确认上传
document.getElementById('confirm-btn').addEventListener('click', function() {
    if (!pendingPhoto) {
        alert('请先选择照片或视频哦~');
        return;
    }
    
    const photoTitle = document.getElementById('photo-title').value.trim();
    const photoDesc = document.getElementById('photo-desc').value.trim();
    const photoTime = document.getElementById('photo-time').value;
    
    const newPhoto = {
        ...pendingPhoto,
        title: photoTitle || '未命名',
        desc: photoDesc || '',
        time: photoTime || getCurrentTime()
    };
    
    photos.unshift(newPhoto);
    savePhotos();
    renderPhotos();
    resetUploadForm();
});

// 留言功能
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

document.getElementById('message-content').addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.ctrlKey) {
        document.getElementById('send-btn').click();
    }
});

// 模态框关闭按钮
document.getElementById('modal-close').addEventListener('click', function() {
    closeModal();
});

// 点击模态框外部关闭
document.getElementById('photo-modal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// ESC键关闭模态框
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
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
`;
document.head.appendChild(style);
