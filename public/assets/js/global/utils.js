/**
 * Global Utility Functions
 * Gemeinsame Hilfsfunktionen für alle Seiten
 */

// Format date function
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE');
}

// Generate random string
function generateRandomString(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Set current date with year 1899
function setCurrentDate1899(inputId) {
    const today = new Date();
    const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
    const currentDay = String(today.getDate()).padStart(2, '0');
    
    document.getElementById(inputId).value = `1899-${currentMonth}-${currentDay}`;
}

// Copy to clipboard with feedback
async function copyToClipboard(text, button = null) {
    try {
        await navigator.clipboard.writeText(text);
        
        if (button) {
            const originalText = button.textContent;
            button.textContent = '✅ Kopiert!';
            button.style.background = 'linear-gradient(135deg, #35A2A2 0%, #6F3E96 100%)';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = 'linear-gradient(135deg, #F4C066 0%, #D99C45 100%)';
            }, 2000);
        }
        
        return true;
    } catch (error) {
        console.error('Copy failed:', error);
        return false;
    }
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatDate,
        generateRandomString,
        setCurrentDate1899,
        copyToClipboard
    };
}
