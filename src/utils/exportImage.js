import html2canvas from 'html2canvas';

export const exportImage = async (canvasElement, setExporting) => {
    try {
        setExporting(true);

        // Temporarily reset transform for html2canvas
        const wrapper = canvasElement.parentElement;
        const originalTransform = wrapper.style.transform;
        wrapper.style.transform = 'scale(1)';
        
        await new Promise(resolve => setTimeout(resolve, 100)); // wait for layout

        const canvas = await html2canvas(canvasElement, {
            scale: 1,
            backgroundColor: null,
            logging: false,
            width: 1080,
            height: 1080,
            useCORS: true
        });

        wrapper.style.transform = originalTransform;

        const link = document.createElement('a');
        link.download = `JRI_Post_${new Date().getTime()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch (error) {
        console.error('Error generating image:', error);
        alert('產生圖片時發生錯誤，請查看 Console 了解詳情。');
    } finally {
        setExporting(false);
    }
};
