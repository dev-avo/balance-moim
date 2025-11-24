/**
 * 페이지 HTML 생성 템플릿
 * 사용법: node create-page-template.js [페이지명] [제목]
 */

const fs = require('fs');
const path = require('path');

const pageName = process.argv[2];
const pageTitle = process.argv[3] || pageName;

if(!pageName) {
    console.error('사용법: node create-page-template.js [페이지명] [제목]');
    process.exit(1);
}

const template = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle} - 밸런스 모임</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        background: 'var(--background)',
                        foreground: 'var(--foreground)',
                        card: 'var(--card)',
                        'card-foreground': 'var(--card-foreground)',
                        primary: 'var(--primary)',
                        'primary-foreground': 'var(--primary-foreground)',
                        secondary: 'var(--secondary)',
                        'secondary-foreground': 'var(--secondary-foreground)',
                        muted: 'var(--muted)',
                        'muted-foreground': 'var(--muted-foreground)',
                        accent: 'var(--accent)',
                        'accent-foreground': 'var(--accent-foreground)',
                        destructive: 'var(--destructive)',
                        'destructive-foreground': 'var(--destructive-foreground)',
                        border: 'var(--border)',
                        input: 'var(--input)',
                        ring: 'var(--ring)',
                    },
                    borderRadius: {
                        DEFAULT: 'var(--radius)',
                    },
                    fontFamily: {
                        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
                    },
                },
            },
            darkMode: 'class',
        };
    </script>
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    <div id="app">
        <header id="header"></header>
        <main id="main" class="container"></main>
        <div id="toast-container"></div>
    </div>
    <script type="module">
        import { renderHeader } from '/js/components/Header.js';
        import { initToast } from '/js/components/Toast.js';
        import { initTheme } from '/js/utils/theme.js';
        import { render${pageName.charAt(0).toUpperCase() + pageName.slice(1)} } from '/js/pages/${pageName}.js';
        initTheme();
        initToast();
        renderHeader();
        render${pageName.charAt(0).toUpperCase() + pageName.slice(1)}();
    </script>
</body>
</html>`;

const outputPath = path.join(__dirname, `${pageName}.html`);
fs.writeFileSync(outputPath, template);
console.log(`✅ ${outputPath} 생성 완료`);
