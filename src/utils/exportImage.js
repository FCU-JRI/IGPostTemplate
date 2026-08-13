import { domToPng } from 'modern-screenshot';

export const exportImage = async (canvasElement, setExporting) => {
    try {
        setExporting(true);

        // Temporarily reset transform
        const wrapper = canvasElement.parentElement;
        const originalTransform = wrapper.style.transform;
        wrapper.style.transform = 'scale(1)';
        
        await new Promise(resolve => setTimeout(resolve, 100)); // wait for layout

        const dataUrl = await domToPng(canvasElement, {
            scale: 1,
            backgroundColor: 'transparent',
            width: 1080,
            height: 1350,
            features: {
                // Ensure better font rendering and CSS support
                removeControlCharacter: false
            }
        });

        wrapper.style.transform = originalTransform;

        const link = document.createElement('a');
        link.download = `JRI_Post_${new Date().getTime()}.png`;
        link.href = dataUrl;
        link.click();
    } catch (error) {
        console.error('Error generating image:', error);
        alert('產生圖片時發生錯誤，請查看 Console 了解詳情。');
    } finally {
        setExporting(false);
    }
};
