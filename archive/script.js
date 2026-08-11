document.addEventListener('DOMContentLoaded', () => {
    // Input Elements
    const inputTitle = document.getElementById('input-title');
    const inputSubtitle = document.getElementById('input-subtitle');
    const inputBody = document.getElementById('input-body');
    const radioPositions = document.getElementsByName('logo-position');
    const inputLayout = document.getElementById('input-layout');
    const inputTheme = document.getElementById('input-theme');
    const inputImage = document.getElementById('input-image');
    const imageUploadGroup = document.getElementById('image-upload-group');
    const inputZoom = document.getElementById('input-zoom');
    const inputX = document.getElementById('input-x');
    const inputY = document.getElementById('input-y');
    
    // Render Elements
    const renderTitle = document.getElementById('render-title');
    const renderSubtitle = document.getElementById('render-subtitle');
    const renderBody = document.getElementById('render-body');
    const renderFooter = document.getElementById('render-footer');
    const renderImage = document.getElementById('render-image');
    
    // Canvas & UI Elements
    const wrapper = document.querySelector('.canvas-wrapper');
    const previewPanel = document.querySelector('.preview-panel');
    const btnDownload = document.getElementById('btn-download');
    const exportCanvas = document.getElementById('export-canvas');

    // --- 0. Warning UI ---
    function checkOverflow() {
        const contentBox = document.querySelector('.content-box');
        const warning = document.getElementById('overflow-warning');
        if (!contentBox || !warning) return;
        
        if (contentBox.scrollHeight > contentBox.clientHeight) {
            warning.style.display = 'block';
        } else {
            warning.style.display = 'none';
        }
    }

    // --- 1. Data Binding ---
    function updateText() {
        renderTitle.textContent = inputTitle.value;
        renderSubtitle.textContent = inputSubtitle.value;
        
        // Handle empty subtitle to hide the badge
        if (inputSubtitle.value.trim() === '') {
            renderSubtitle.style.display = 'none';
        } else {
            renderSubtitle.style.display = 'inline-block';
        }

        renderBody.textContent = inputBody.value;
        
        // Use setTimeout to ensure DOM is updated before checking height
        setTimeout(checkOverflow, 0);
    }

    inputTitle.addEventListener('input', updateText);
    inputSubtitle.addEventListener('input', updateText);
    inputBody.addEventListener('input', updateText);

    // --- 2. Logo Position Toggle ---
    function updateLogoPosition() {
        let selectedValue = 'bottom-left';
        for (const radio of radioPositions) {
            if (radio.checked) {
                selectedValue = radio.value;
                break;
            }
        }
        
        if (selectedValue === 'bottom-left') {
            renderFooter.classList.remove('logo-bottom-right');
            renderFooter.classList.add('logo-bottom-left');
        } else {
            renderFooter.classList.remove('logo-bottom-left');
            renderFooter.classList.add('logo-bottom-right');
        }
    }

    for (const radio of radioPositions) {
        radio.addEventListener('change', updateLogoPosition);
    }

    // --- 2.5 Layout & Image Toggle ---
    function updateLayout() {
        let selectedLayout = inputLayout.value;
        
        // Update ig-post classes
        exportCanvas.className = 'ig-post ' + inputTheme.value; // Theme class
        exportCanvas.classList.add(selectedLayout);

        // Show/hide image upload depending on layout
        if (selectedLayout === 'layout-text') {
            imageUploadGroup.style.display = 'none';
        } else {
            imageUploadGroup.style.display = 'flex';
        }
        
        setTimeout(checkOverflow, 0);
    }

    inputLayout.addEventListener('change', updateLayout);
    inputTheme.addEventListener('change', updateLayout);

    // --- Image Upload & Controls Logic ---
    function updateImageStyles() {
        const zoom = inputZoom.value;
        const x = inputX.value;
        const y = inputY.value;
        
        renderImage.style.backgroundSize = `${zoom}%`;
        renderImage.style.backgroundPosition = `${x}% ${y}%`;
    }

    inputZoom.addEventListener('input', updateImageStyles);
    inputX.addEventListener('input', updateImageStyles);
    inputY.addEventListener('input', updateImageStyles);

    // --- Image Upload Logic ---
    inputImage.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            // Set image as background
            renderImage.style.backgroundImage = `url(${event.target.result})`;
            updateImageStyles(); // Apply current slider values
        };
        reader.readAsDataURL(file);
    });

    // --- 3. Responsive Canvas Scaling ---
    // Make sure the 1080x1080 box fits within the preview panel visually
    function scaleCanvas() {
        const padding = 40; // padding from edges
        const availableWidth = previewPanel.clientWidth - padding * 2;
        const availableHeight = previewPanel.clientHeight - padding * 2;
        
        // Calculate the scale needed to fit 1080px in the available space
        const scale = Math.min(availableWidth / 1080, availableHeight / 1080, 1);
        
        wrapper.style.transform = `scale(${scale})`;
    }

    window.addEventListener('resize', scaleCanvas);
    
    // Initialize scaling and text
    scaleCanvas();
    updateText();
    updateLogoPosition();
    updateLayout();

    // --- 4. Export logic via html2canvas ---
    btnDownload.addEventListener('click', async () => {
        try {
            // Provide feedback
            const originalText = btnDownload.innerHTML;
            btnDownload.innerHTML = '正在產生圖片...';
            btnDownload.disabled = true;

            // Fix html2canvas transform bug: Temporarily remove scale from the wrapper
            const originalTransform = wrapper.style.transform;
            wrapper.style.transform = 'scale(1)';
            
            // Wait a moment for DOM to apply the unscaled layout
            await new Promise(resolve => setTimeout(resolve, 100));

            // Generate canvas
            const canvas = await html2canvas(exportCanvas, {
                scale: 1,
                backgroundColor: null,
                logging: false,
                width: 1080,
                height: 1080
            });

            // Restore the scale
            wrapper.style.transform = originalTransform;

            // Trigger download
            const link = document.createElement('a');
            link.download = `JRI_Post_${new Date().getTime()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();

        } catch (error) {
            console.error('Error generating image:', error);
            alert('產生圖片時發生錯誤，請查看 Console 了解詳情。');
        } finally {
            // Restore button state
            btnDownload.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                下載 IG 貼文 (1080x1080)
            `;
            btnDownload.disabled = false;
        }
    });
});
