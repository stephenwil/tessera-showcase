// Tessera High-Res Showcase Storefront Engine
(function() {
  let allCarts = [];
  let currentGenre = 'all';
  let searchQuery = '';
  let currentSort = 'featured';
  let activeCart = null;

  // DOM Elements
  const grid = document.getElementById('cards-grid');
  const searchInput = document.getElementById('search-input');
  const searchClear = document.getElementById('search-clear');
  const sortSelect = document.getElementById('sort-select');
  const categoryPills = document.getElementById('category-pills');
  const resultsCount = document.getElementById('results-count');
  const countAll = document.getElementById('count-all');
  const toastEl = document.getElementById('toast');

  // Player Modal
  const playerModal = document.getElementById('player-modal');
  const playerBackdrop = document.getElementById('player-backdrop');
  const playerIframe = document.getElementById('player-iframe');
  const playerTitle = document.getElementById('player-title');
  const playerAuthor = document.getElementById('player-author');
  const playerBtnClose = document.getElementById('player-btn-close');
  const playerBtnFullscreen = document.getElementById('player-btn-fullscreen');
  const playerBtnDownload = document.getElementById('player-btn-download');
  const playerBtnEmbed = document.getElementById('player-btn-embed');
  const playerBtnSource = document.getElementById('player-btn-source');

  // Source Modal
  const sourceModal = document.getElementById('source-modal');
  const sourceBackdrop = document.getElementById('source-backdrop');
  const sourceTitle = document.getElementById('source-title');
  const sourceMeta = document.getElementById('source-meta');
  const sourceCodeBlock = document.getElementById('source-code-block');
  const sourceBtnCopy = document.getElementById('source-btn-copy');
  const sourceBtnClose = document.getElementById('source-btn-close');

  // Submit Modal
  const submitModal = document.getElementById('submit-modal');
  const submitBackdrop = document.getElementById('submit-backdrop');
  const submitBtnClose = document.getElementById('submit-btn-close');
  const btnOpenSubmit = document.getElementById('btn-open-submit');
  const submitDropZone = document.getElementById('submit-drop-zone');
  const submitFileInput = document.getElementById('submit-file-input');
  const submitFileBtn = document.getElementById('submit-file-btn');
  const submitValidationResult = document.getElementById('submit-validation-result');

  // Global Drop Overlay
  const dropOverlay = document.getElementById('drop-overlay');
  const btnBootClean = document.getElementById('btn-boot-clean');

  // --- 1. Init & Fetch Catalog ---
  async function init() {
    try {
      const res = await fetch('carts.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      allCarts = await res.json();
      countAll.textContent = allCarts.length;
      render();
    } catch (err) {
      console.error('Failed to load carts.json:', err);
      resultsCount.textContent = 'Failed to load cartridge catalog. Please serve this folder via HTTP.';
    }

    bindEvents();
  }

  // --- 2. Filter, Sort & Render ---
  function getFilteredCarts() {
    return allCarts.filter(c => {
      // Genre filter
      if (currentGenre !== 'all' && c.genre !== currentGenre) return false;
      
      // Search query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchTitle = c.title.toLowerCase().includes(q);
        const matchAuthor = c.author.toLowerCase().includes(q);
        const matchDesc = c.description.toLowerCase().includes(q);
        const matchTags = Array.isArray(c.tags) && c.tags.some(t => t.toLowerCase().includes(q));
        if (!matchTitle && !matchAuthor && !matchDesc && !matchTags) return false;
      }
      return true;
    }).sort((a, b) => {
      if (currentSort === 'featured') {
        if (a.featured !== b.featured) return b.featured ? 1 : -1;
        return a.title.localeCompare(b.title);
      }
      if (currentSort === 'title-asc') return a.title.localeCompare(b.title);
      if (currentSort === 'lines-desc') return (b.stats?.codeLines || 0) - (a.stats?.codeLines || 0);
      if (currentSort === 'size-desc') return (b.stats?.fileSizeBytes || 0) - (a.stats?.fileSizeBytes || 0);
      return 0;
    });
  }

  function render() {
    const list = getFilteredCarts();
    resultsCount.textContent = `Showing ${list.length} of ${allCarts.length} cartridges`;
    grid.innerHTML = '';

    if (list.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-dim);">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🔍</div>
          <h3>No cartridges found</h3>
          <p style="margin-top: 0.25rem;">Try adjusting your search terms or genre filter.</p>
        </div>
      `;
      return;
    }

    list.forEach(c => {
      const card = document.createElement('article');
      card.className = 'cart-card';
      card.dataset.id = c.id;

      const tagsHtml = (c.tags || []).slice(0, 4).map(t => `<span class="tag-badge">#${escapeHtml(t)}</span>`).join('');
      const featuredBadge = c.featured ? '<span class="badge-featured">★ Featured</span>' : '';
      const kbSize = c.stats?.fileSizeBytes ? (c.stats.fileSizeBytes / 1024).toFixed(1) + ' KiB' : '';

      card.innerHTML = `
        <div class="card-label-wrap" title="Play ${escapeHtml(c.title)}">
          <img src="${c.pictureFile}" alt="${escapeHtml(c.title)} cartridge label" class="card-label-img" loading="lazy">
          <div class="card-badge-row">
            <span class="badge-genre">${escapeHtml(c.genre)}</span>
            ${featuredBadge}
          </div>
          <div class="card-play-overlay">
            <div class="play-circle">▶</div>
          </div>
        </div>

        <div class="card-body">
          <div class="card-header-row">
            <h3 class="card-title">${escapeHtml(c.title)}</h3>
            <span class="card-author">by ${escapeHtml(c.author)}</span>
          </div>

          <div class="card-stats-row">
            <span>📜 ${c.stats?.codeLines || 0} lines</span>
            <span>🕹️ ${c.players || 1}P</span>
            <span>💾 ${kbSize}</span>
          </div>

          <p class="card-desc">${escapeHtml(c.description)}</p>

          <div class="card-tags">
            ${tagsHtml}
          </div>

          <div class="card-actions">
            <button class="btn btn-primary btn-play">
              <span class="icon">▶</span> Play Now
            </button>
            <a href="${c.pictureFile}" download="${c.id}.tess.png" class="btn btn-secondary btn-sm" title="Download .tess.png picture cart">
              ⬇ PNG
            </a>
            <button class="btn btn-ghost btn-sm btn-source" title="View source code">
              📄 Code
            </button>
          </div>
        </div>
      `;

      // Event listeners on card
      card.querySelector('.card-label-wrap').addEventListener('click', () => openPlayer(c));
      card.querySelector('.btn-play').addEventListener('click', () => openPlayer(c));
      card.querySelector('.btn-source').addEventListener('click', () => openSource(c));

      grid.appendChild(card);
    });
  }

  // --- 3. Player Modal Actions ---
  function openPlayer(cart) {
    activeCart = cart;
    playerTitle.textContent = cart.title;
    playerAuthor.textContent = `by ${cart.author}`;
    
    // Direct URL to load cart inside standalone player
    playerIframe.src = `tessera.html?cart=${encodeURIComponent(cart.cartFile)}`;
    
    playerModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    playerIframe.focus();
  }

  function closePlayer() {
    playerModal.classList.add('hidden');
    playerIframe.src = 'about:blank';
    document.body.style.overflow = '';
    activeCart = null;
  }

  // --- 4. Source Code Modal ---
  async function openSource(cart) {
    sourceTitle.textContent = cart.title;
    sourceMeta.textContent = `by ${cart.author} (${cart.stats?.codeLines || 0} lines of Lua)`;
    sourceCodeBlock.textContent = 'Loading source code...';
    sourceModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    try {
      const res = await fetch(cart.cartFile);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      sourceCodeBlock.textContent = text;
    } catch (err) {
      sourceCodeBlock.textContent = `Failed to load source: ${err.message}`;
    }
  }

  function closeSource() {
    sourceModal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  // --- 5. Submit Modal ---
  function openSubmit() {
    submitModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeSubmit() {
    submitModal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  // --- 6. Client-Side Cart File Validation ---
  async function validateCartFile(file) {
    submitValidationResult.className = 'submit-validation-result';
    submitValidationResult.classList.remove('hidden');
    submitValidationResult.textContent = 'Inspecting cartridge file...';

    const ext = file.name.split('.').pop().toLowerCase();
    const isPng = ext === 'png' || file.name.endsWith('.tess.png');
    const isTess = ext === 'tess';

    if (!isPng && !isTess) {
      submitValidationResult.className = 'submit-validation-result error';
      submitValidationResult.textContent = '❌ Invalid file type. Must be a .tess text file or .tess.png picture cart.';
      return;
    }

    try {
      if (isTess) {
        const text = await file.text();
        if (!text.startsWith('tessera cart v1')) {
          throw new Error("Missing 'tessera cart v1' header on line 1.");
        }
        submitValidationResult.className = 'submit-validation-result success';
        submitValidationResult.innerHTML = `
          ✅ <strong>Valid .tess cart!</strong><br>
          File: ${escapeHtml(file.name)} (${(file.size / 1024).toFixed(1)} KiB)<br>
          Header verified. Ready to submit via GitHub Issue!
        `;
      } else {
        if (file.size > 1024 * 1024) {
          throw new Error('PNG file is too large (must be 256×256 pixels, typically < 64 KiB).');
        }
        submitValidationResult.className = 'submit-validation-result success';
        submitValidationResult.innerHTML = `
          ✅ <strong>Picture cart candidate!</strong><br>
          File: ${escapeHtml(file.name)} (${(file.size / 1024).toFixed(1)} KiB)<br>
          Ready to submit via GitHub Issue!
        `;
      }
    } catch (err) {
      submitValidationResult.className = 'submit-validation-result error';
      submitValidationResult.textContent = `❌ Validation error: ${err.message}`;
    }
  }

  // --- 7. Toast Notifications ---
  let toastTimer = null;
  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.add('hidden');
    }, 2800);
  }

  // --- 8. Event Bindings ---
  function bindEvents() {
    // Search input
    searchInput.addEventListener('input', e => {
      searchQuery = e.target.value.trim();
      searchClear.classList.toggle('hidden', !searchQuery);
      render();
    });

    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      searchClear.classList.add('hidden');
      render();
      searchInput.focus();
    });

    // Sort select
    sortSelect.addEventListener('change', e => {
      currentSort = e.target.value;
      render();
    });

    // Category pills
    categoryPills.addEventListener('click', e => {
      const btn = e.target.closest('.pill');
      if (!btn) return;
      categoryPills.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      currentGenre = btn.dataset.genre;
      render();
    });

    // Header buttons
    btnBootClean.addEventListener('click', () => {
      openPlayer({
        title: 'Tessera High-Res Console',
        author: 'Clean Machine Boot',
        cartFile: ''
      });
      playerIframe.src = 'tessera.html';
    });

    btnOpenSubmit.addEventListener('click', openSubmit);

    // Player modal events
    playerBtnClose.addEventListener('click', closePlayer);
    playerBackdrop.addEventListener('click', closePlayer);

    playerBtnFullscreen.addEventListener('click', () => {
      const el = playerIframe;
      if (el.requestFullscreen) el.requestFullscreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    });

    playerBtnDownload.addEventListener('click', () => {
      if (!activeCart || !activeCart.pictureFile) return;
      const a = document.createElement('a');
      a.href = activeCart.pictureFile;
      a.download = `${activeCart.id}.tess.png`;
      a.click();
    });

    playerBtnEmbed.addEventListener('click', () => {
      if (!activeCart) return;
      const embedUrl = new URL(`tessera.html?cart=${encodeURIComponent(activeCart.cartFile)}`, location.href).href;
      const snippet = `<iframe src="${embedUrl}" width="768" height="432" frameborder="0" allow="autoplay; gamepad" allowfullscreen></iframe>`;
      navigator.clipboard.writeText(snippet);
      showToast('📋 Embed snippet copied to clipboard!');
    });

    playerBtnSource.addEventListener('click', () => {
      if (activeCart) openSource(activeCart);
    });

    // Source modal events
    sourceBtnClose.addEventListener('click', closeSource);
    sourceBackdrop.addEventListener('click', closeSource);
    sourceBtnCopy.addEventListener('click', () => {
      navigator.clipboard.writeText(sourceCodeBlock.textContent);
      showToast('📋 Lua source code copied to clipboard!');
    });

    // Submit modal events
    submitBtnClose.addEventListener('click', closeSubmit);
    submitBackdrop.addEventListener('click', closeSubmit);
    submitFileBtn.addEventListener('click', () => submitFileInput.click());
    submitFileInput.addEventListener('change', e => {
      if (e.target.files[0]) validateCartFile(e.target.files[0]);
    });

    submitDropZone.addEventListener('dragover', e => {
      e.preventDefault();
      submitDropZone.classList.add('dragover');
    });
    submitDropZone.addEventListener('dragleave', () => submitDropZone.classList.remove('dragover'));
    submitDropZone.addEventListener('drop', e => {
      e.preventDefault();
      submitDropZone.classList.remove('dragover');
      if (e.dataTransfer.files[0]) validateCartFile(e.dataTransfer.files[0]);
    });

    // Global drag-and-drop to play any dropped cart
    window.addEventListener('dragenter', e => {
      if (e.dataTransfer.types.includes('Files')) {
        dropOverlay.classList.remove('hidden');
      }
    });

    dropOverlay.addEventListener('dragover', e => e.preventDefault());
    dropOverlay.addEventListener('dragleave', e => {
      if (e.relatedTarget === null) dropOverlay.classList.add('hidden');
    });

    dropOverlay.addEventListener('drop', async e => {
      e.preventDefault();
      dropOverlay.classList.add('hidden');
      const file = e.dataTransfer.files[0];
      if (!file) return;

      openPlayer({
        title: file.name,
        author: 'Dropped Cartridge',
        cartFile: ''
      });

      // Load player and communicate file or use blob
      playerIframe.src = 'tessera.html';
      playerIframe.onload = async () => {
        try {
          const content = await file.arrayBuffer();
          playerIframe.contentWindow?.postMessage({
            type: 'load-cart',
            name: file.name,
            bytes: Array.from(new Uint8Array(content))
          }, '*');
        } catch (err) {
          console.warn('Failed to post dropped file to iframe:', err);
        }
      };
      showToast(`Loaded ${file.name}`);
    });

    // Escape key closes modals
    window.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        if (!sourceModal.classList.contains('hidden')) closeSource();
        else if (!submitModal.classList.contains('hidden')) closeSubmit();
        else if (!playerModal.classList.contains('hidden')) closePlayer();
      }
    });
  }

  function escapeHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Boot
  document.addEventListener('DOMContentLoaded', init);
})();
