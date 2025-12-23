        document.addEventListener('DOMContentLoaded', function() {
            const setkeybind = document.getElementById('setkeybind');
            const output = document.getElementById('output');
            let keybind = localStorage.getItem('keybind') || 'none'; 
    
            output.textContent = `Current key: ${keybind}`;
    
            setkeybind.addEventListener('click', () => {
                output.textContent = 'Listening...';
                document.removeEventListener('keydown', keydownHandler);
                document.addEventListener('keydown', keydownHandler);
            });
    
            function keydownHandler(event) {
                keybind = event.key;
                localStorage.setItem('keybind', keybind);
                output.textContent = `Selected Key: ${keybind}`;
                document.removeEventListener('keydown', keydownHandler);
                location.reload()
            }
        });

        var urlObj = new window.URL(window.location.href);
        var url = window.location.href;
        if (url) {
            var win;
    
            document.querySelector('#abcloak').onclick = function() {
                if (win) {
                    win.focus();
                } else {
                    win = window.open();
                    win.document.body.style.margin = '0';
                    win.document.body.style.height = '100vh';
                    var iframe = win.document.createElement('iframe');
                    iframe.style.border = 'none';
                    iframe.style.width = '100%';
                    iframe.style.height = '100%';
                    iframe.style.margin = '0';
                    iframe.src = url;
                    win.document.body.appendChild(iframe);
                    window.location.replace("https://www.khanacademy.org");
                }
            };
    
            function datalink() {
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>New Tab</title>
    <style>
        body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: hidden;
        }
        iframe {
            border: none;
            width: 100%;
            height: 100%;
        }
    </style>
</head>
<body>
    <iframe src="${window.location.href}"></iframe>
</body>
</html>`;
    const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;
    
    const container = document.createElement('div');
    container.style.margin = '20px auto';
    container.style.maxWidth = '800px';
    container.style.textAlign = 'center';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.value = dataUrl;
    input.readOnly = true;
    input.style.width = 'calc(100% - 120px)';
    input.style.padding = '12px 15px';
    input.style.marginRight = '10px';
    input.style.borderRadius = '8px';
    input.style.border = `2px solid var(--border-primary)`;
    input.style.backgroundColor = 'var(--secondary-bg)';
    input.style.color = 'var(--text-white)';
    input.style.fontFamily = 'notitle';
    input.style.fontSize = '16px';
    
    const copyBtn = document.createElement('button');
    copyBtn.textContent = 'Copy';
    copyBtn.style.padding = '12px 20px';
    copyBtn.style.borderRadius = '8px';
    copyBtn.style.border = 'none';
    copyBtn.style.backgroundColor = 'var(--accent-dark)';
    copyBtn.style.color = 'var(--text-white)';
    copyBtn.style.fontFamily = 'notitle';
    copyBtn.style.cursor = 'pointer';
    copyBtn.style.transition = 'all 0.2s ease-in-out';
    
    copyBtn.onmouseover = function() {
        this.style.backgroundColor = 'var(--accent-hover)';
        this.style.boxShadow = '0 0 10px var(--shadow-primary)';
    };
    copyBtn.onmouseout = function() {
        this.style.backgroundColor = 'var(--accent-dark)';
        this.style.boxShadow = 'none';
    };
    
    copyBtn.onclick = function() {
        input.select();
        document.execCommand('copy');
        const originalText = this.textContent;
    };
    
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '10px';
    closeBtn.style.right = '10px';
    closeBtn.style.background = 'none';
    closeBtn.style.border = 'none';
    closeBtn.style.color = 'var(--text-white)';
    closeBtn.style.fontSize = '20px';
    closeBtn.style.cursor = 'pointer';
    
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.7)';
    modal.style.zIndex = '99999';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    
    const contentBox = document.createElement('div');
    contentBox.style.backgroundColor = 'var(--primary-bg)';
    contentBox.style.padding = '30px';
    contentBox.style.borderRadius = '12px';
    contentBox.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)';
    contentBox.style.position = 'relative';
    contentBox.style.width = '80%';
    contentBox.style.maxWidth = '700px';
    
    const title = document.createElement('h2');
    title.textContent = 'Data URL Generated';
    title.style.color = 'var(--text-white)';
    title.style.fontFamily = 'title';
    title.style.marginBottom = '20px';
    title.style.textAlign = 'center';
    
    const desc = document.createElement('p');
    desc.textContent = 'here is your data link:';
    desc.style.color = 'var(--text-gray)';
    desc.style.fontFamily = 'notitle';
    desc.style.marginBottom = '20px';
    desc.style.textAlign = 'center';
    
    container.appendChild(input);
    container.appendChild(copyBtn);
    
    contentBox.appendChild(closeBtn);
    contentBox.appendChild(title);
    contentBox.appendChild(desc);
    contentBox.appendChild(container);
    
    modal.appendChild(contentBox);
    document.body.appendChild(modal);
    
    closeBtn.onclick = function() {
        document.body.removeChild(modal);
    };
    
    modal.onclick = function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    };
}}
    
