// 重新画标题
(function () {
    if (window.bannerTitleDone) return;
    window.bannerTitleDone = true;

    var cssPath = '/blog/title/title.css';
    if (!document.querySelector('link[href*="' + cssPath + '"]')) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = cssPath;
        document.head.appendChild(link);
    }

    var banner = document.createElement('div');
    banner.className = 'title';

    var img = document.createElement('img');
    img.className = 'title-image';
    img.src = '/blog/title/title.svg';
    img.alt = '标题图片';
    banner.appendChild(img);

    var box = document.querySelector('main .rounded-box1');
    var titleText = document.querySelector('h1').innerText;
    box.innerHTML = `
        <h1 style="text-align: center;">${titleText}</h1>
        <p id="article-info">
            <span id="modified-date"></span>&nbsp;&nbsp;
            <span id="word-count"></span>
        </p>`;

    if (box) {
        banner.appendChild(box);
    }

    document.body.insertBefore(banner, document.body.firstChild);
})();

// 获取修改时间
const currentPath = window.location.pathname;

const pathSegments = currentPath.split('/');
const contentIndex = pathSegments.indexOf('content');

if (contentIndex !== -1 && contentIndex < pathSegments.length - 1) {
    const articleDir = pathSegments[contentIndex + 1];

    const targetUrl = `content/${articleDir}`;

    fetch('/blog/articles.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(articles => {
            const matchedArticle = articles.find(article =>
                article.url === targetUrl
            );

            if (matchedArticle) {
                document.getElementById('modified-date').textContent =
                    `${matchedArticle.modified}`;
            }
        })
        .catch(error => {
            console.error('Load error:', error);
        });
}

// 字数统计
document.addEventListener('DOMContentLoaded', function () {
    const contentElement = document.querySelector('.content-container');

    if (!contentElement) {
        console.error("No content container found");
        return;
    }

    const cloneElement = contentElement.cloneNode(true);
    // cloneElement.querySelectorAll('pre').forEach(el => el.remove());
    const text = cloneElement.textContent;

    const cleanedText = text
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/[\u200B-\u200D\uFEFF]/g, '');

    const cnCharCount = cleanedText.match(/[\u4E00-\u9FA5]/g)?.length || 0;
    const total = cleanedText.split(/\s+/).length + cnCharCount;

    document.getElementById('word-count').textContent = `${total} 字`;
});
