/**
 * main.js — 區段載入器與互動功能
 *
 * 負責：
 *   1. 從 sections/ 載入 HTML 片段並注入 <main>
 *   2. 閱讀進度條
 *   3. 導覽列高亮
 *   4. 心理分析版本切換
 */

'use strict';

/* ---------- 區段載入 ---------- */

/**
 * 依序載入所有 HTML 區段並注入容器。
 */
async function loadSections() {
  const container = document.getElementById('content');
  const sectionFiles = [
    'intro',
    'backstory',
    'jan',
    'feb',
    'mar',
    'apr',
    'may',
    'jun',
    'jul',
    'aug',
    'sep',
    'oct',
    'nov',
    'dec',
    'y2025',
    'y2026',
    'end',
    'y2026apr',
    'analysis',
  ];

  try {
    const fetches = sectionFiles.map((name) =>
      fetch(`sections/${name}.html`).then((res) => {
        if (!res.ok)
          throw new Error(`載入 sections/${name}.html 失敗 (${res.status})`);
        return res.text();
      })
    );
    const htmls = await Promise.all(fetches);
    container.innerHTML = htmls.join('\n');
    initInteractions();
  } catch (err) {
    console.error('[loadSections]', err);
    container.innerHTML =
      '<p style="text-align:center;color:#c53030;padding:40px;">內容載入失敗，請確認網頁部署在伺服器環境（GitHub Pages 或 localhost）。</p>';
  }
}

/* ---------- 互動功能 ---------- */

/**
 * 初始化所有互動功能（在區段載入完成後呼叫）。
 */
function initInteractions() {
  // 導覽列高亮
  const sections = document.querySelectorAll(
    '.section-title, #intro, #analysis'
  );
  const navLinks = document.querySelectorAll('.nav-bar a');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === '#' + id
            );
          });
        }
      });
    },
    { rootMargin: '-80px 0px -80% 0px' }
  );

  sections.forEach((s) => observer.observe(s));
}

/* ---------- 進度條 & 回頂端 ---------- */

window.addEventListener('scroll', () => {
  const scrollTop =
    document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  const progress = (scrollTop / scrollHeight) * 100;
  document.getElementById('progressBar').style.width = progress + '%';
  document
    .getElementById('backTop')
    .classList.toggle('show', window.scrollY > 400);
});

/* ---------- 心理分析版本切換 ---------- */

/**
 * 切換心理分析的三種版本顯示。
 *
 * @param {string} version - 'neutral' | 'savage' | 'ultimate'
 */
function switchAnalysis(version) {
  var versions = ['neutral', 'savage', 'ultimate'];
  var ids = ['analysis-neutral', 'analysis-savage', 'analysis-ultimate'];
  var labels = document.querySelectorAll('.version-toggle-label');
  for (var i = 0; i < versions.length; i++) {
    var el = document.getElementById(ids[i]);
    if (el) el.style.display = versions[i] === version ? 'block' : 'none';
  }
  labels.forEach(function (l) {
    l.classList.remove('active');
    if (l.classList.contains(version)) l.classList.add('active');
  });
}

/* ---------- 啟動 ---------- */

document.addEventListener('DOMContentLoaded', loadSections);
