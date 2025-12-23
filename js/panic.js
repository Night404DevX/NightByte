document.addEventListener('DOMContentLoaded', function() {
    const tabselectElement = document.querySelector('#tabselect');
    const savedIndex = localStorage.getItem('tabselectIndex');
    const sitefortab = localStorage.getItem('sitefortab');
    const keybind = localStorage.getItem('keybind') || '~'; 

    if (tabselectElement) {
        if (savedIndex !== null) {
            tabselectElement.selectedIndex = savedIndex;
        }
    }

    document.body.addEventListener('keydown', function(event) {
        if (event.key === keybind) { 
            if (sitefortab) {
                window.location.href = sitefortab;
            } else {
                window.location.href = 'https://canvas.instructure.com/login/canvas';
            }
        }
    });
});