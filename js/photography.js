function openPhotoModal() {
    let modal = document.getElementById("photoModal");
    if (!modal) return;
    modal.style.display = "flex";

    let gallery = document.getElementById("photoGallery");
    gallery.innerHTML = ""; // Clear existing

    // Using photographyImages array from photography_data.js
    if (typeof photographyImages !== 'undefined' && photographyImages.length > 0) {
        let grid = document.createElement("div");
        grid.style.display = "grid";
        grid.style.gridTemplateColumns = "repeat(auto-fill, minmax(150px, 1fr))";
        grid.style.gap = "15px";
        grid.style.padding = "20px";
        grid.style.width = "100%";
        
        photographyImages.forEach(imgName => {
            let item = document.createElement("div");
            item.className = "photo-item";
            item.style.position = "relative";
            item.style.overflow = "hidden";
            item.style.borderRadius = "8px";
            item.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
            item.style.aspectRatio = "1 / 1"; // Square thumbnail
            item.style.cursor = "pointer";
            
            // On hover, text overlay
            let overlay = document.createElement("div");
            overlay.className = "photo-overlay";
            overlay.style.position = "absolute";
            overlay.style.bottom = "0";
            overlay.style.left = "0";
            overlay.style.right = "0";
            overlay.style.background = "rgba(0, 0, 0, 0.7)";
            overlay.style.color = "white";
            overlay.style.padding = "10px";
            overlay.style.textAlign = "center";
            overlay.style.transition = "transform 0.3s";
            overlay.style.transform = "translateY(100%)";
            overlay.style.fontSize = "14px";
            overlay.innerText = imgName; // Show image name
            
            let img = document.createElement("img");
            img.src = "images/photography/" + imgName;
            img.alt = imgName;
            img.style.width = "100%";
            img.style.height = "100%";
            img.style.objectFit = "cover";
            img.style.transition = "transform 0.3s";
            
            item.appendChild(img);
            item.appendChild(overlay);
            
            // Hover logic
            item.addEventListener('mouseenter', () => {
                overlay.style.transform = "translateY(0)";
                img.style.transform = "scale(1.05)";
            });
            item.addEventListener('mouseleave', () => {
                overlay.style.transform = "translateY(100%)";
                img.style.transform = "scale(1)";
            });
            
            // Optional: click to expand?
            item.addEventListener('click', () => {
                window.open("images/photography/" + imgName, '_blank');
            });

            grid.appendChild(item);
        });
        gallery.appendChild(grid);
    } else {
        gallery.innerHTML = "<p style='padding: 20px; text-align: center; color: #666;'>暂无摄影作品，请在 images/photography 目录下添加图片。</p>";
    }
}

function closePhotoModal() {
    let modal = document.getElementById("photoModal");
    if (modal) {
        modal.style.display = "none";
    }
}
