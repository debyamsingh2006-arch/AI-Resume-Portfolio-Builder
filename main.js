// ── State ──────────────────────────────────────────────────────────────────
let currentContent = '';
let currentType = '';

// ── Helpers ────────────────────────────────────────────────────────────────
function getFormData() {
  return {
    name:        document.getElementById('name').value.trim(),
    email:       document.getElementById('email').value.trim(),
    phone:       document.getElementById('phone').value.trim(),
    location:    document.getElementById('location').value.trim(),
    target_role: document.getElementById('target_role').value.trim(),
    education:   document.getElementById('education').value.trim(),
    skills:      document.getElementById('skills').value.trim(),
    projects:    document.getElementById('projects').value.trim(),
    experience:  document.getElementById('experience').value.trim(),
    achievements:document.getElementById('achievements').value.trim(),
    linkedin:    document.getElementById('linkedin').value.trim(),
    github:      document.getElementById('github').value.trim(),
  };
}

function validate(data) {
  if (!data.name)        { showToast('⚠️ Please enter your name', 'warn'); return false; }
  if (!data.email)       { showToast('⚠️ Please enter your email', 'warn'); return false; }
  if (!data.target_role) { showToast('⚠️ Please enter target role', 'warn'); return false; }
  return true;
}

function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.borderColor = type === 'warn' ? '#fb923c' : '#34d399';
  t.style.color       = type === 'warn' ? '#fb923c' : '#34d399';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

function setStep(n) {
  [1, 2, 3].forEach(i => {
    document.getElementById(`step-indicator-${i}`).classList.toggle('active', i <= n);
  });
}

// ── Title map ──────────────────────────────────────────────────────────────
const titles = {
  resume:       '📄 Your AI-Generated Resume',
  cover_letter: '✉️ Your AI-Generated Cover Letter',
  portfolio:    '🌐 Your AI-Generated Portfolio Content',
};

// ── Generate ───────────────────────────────────────────────────────────────
async function generate(type) {
  const data = getFormData();
  if (!validate(data)) return;

  currentType = type;
  setStep(2);

  // Show loading
  document.getElementById('placeholder').style.display    = 'none';
  document.getElementById('loading').style.display        = 'flex';
  document.getElementById('output-content').style.display = 'none';
  document.getElementById('output-actions').style.display = 'none';
  document.getElementById('tips-panel').style.display     = 'none';

  // Disable buttons
  document.querySelectorAll('.btn').forEach(b => b.disabled = true);

  try {
    const res = await fetch('/generate', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ ...data, type }),
    });
    const result = await res.json();

    if (result.success) {
      currentContent = result.content;
      document.getElementById('output-text').textContent      = result.content;
      document.getElementById('output-title').textContent     = titles[type];
      document.getElementById('output-content').style.display = 'block';
      document.getElementById('output-actions').style.display = 'flex';
      setStep(3);
      showToast('✅ Generated successfully!');
    } else {
      throw new Error(result.error || 'Generation failed');
    }
  } catch (err) {
    showToast('❌ Error: ' + err.message, 'warn');
    document.getElementById('placeholder').style.display = 'flex';
    setStep(1);
  } finally {
    document.getElementById('loading').style.display = 'none';
    document.querySelectorAll('.btn').forEach(b => b.disabled = false);
  }
}

// ── Copy ───────────────────────────────────────────────────────────────────
function copyContent() {
  if (!currentContent) return;
  navigator.clipboard.writeText(currentContent)
    .then(() => showToast('📋 Copied to clipboard!'))
    .catch(() => showToast('❌ Copy failed', 'warn'));
}

// ── Download ───────────────────────────────────────────────────────────────
function downloadContent() {
  if (!currentContent) return;
  const name = document.getElementById('name').value.trim() || 'document';
  const filenames = {
    resume:       `${name}_Resume.txt`,
    cover_letter: `${name}_CoverLetter.txt`,
    portfolio:    `${name}_Portfolio.txt`,
  };
  const blob = new Blob([currentContent], { type: 'text/plain' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filenames[currentType] || 'document.txt';
  a.click();
  URL.revokeObjectURL(url);
  showToast('⬇️ Downloaded!');
}

// ── AI Tips ────────────────────────────────────────────────────────────────
async function getTips() {
  if (!currentContent) return;

  const panel = document.getElementById('tips-panel');
  panel.style.display = 'block';
  document.getElementById('tips-loading').style.display = 'flex';
  document.getElementById('tips-content').textContent   = '';

  try {
    const res = await fetch('/improve', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ content: currentContent, type: currentType }),
    });
    const result = await res.json();
    if (result.success) {
      document.getElementById('tips-content').textContent = result.tips;
    } else {
      document.getElementById('tips-content').textContent = 'Could not fetch tips.';
    }
  } catch {
    document.getElementById('tips-content').textContent = 'Error fetching tips.';
  } finally {
    document.getElementById('tips-loading').style.display = 'none';
  }
}

function closeTips() {
  document.getElementById('tips-panel').style.display = 'none';
}
