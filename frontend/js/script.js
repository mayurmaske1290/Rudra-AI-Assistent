const API = 'http://localhost:5000/api';
const token = localStorage.getItem('token');

const authFetch = async (url, options = {}) => {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API}${url}`, { ...options, headers });
  if (res.status === 401) { localStorage.clear(); location.href = 'login.html'; }
  return res;
};

const toast = (msg) => {
  let el = document.querySelector('.toast');
  if (!el) { el = document.createElement('div'); el.className = 'toast'; document.body.appendChild(el); }
  el.textContent = msg; el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 2200);
};

const bindDarkMode = () => {
  const btn = document.getElementById('darkModeToggle');
  const pref = localStorage.getItem('dark') === '1';
  if (pref) document.body.classList.add('dark');
  if (btn) btn.onclick = () => { document.body.classList.toggle('dark'); localStorage.setItem('dark', document.body.classList.contains('dark') ? '1' : '0'); };
};

const setupLogout = () => {
  const btn = document.getElementById('logoutBtn');
  if (btn) btn.onclick = () => { localStorage.clear(); location.href = 'login.html'; };
};

document.addEventListener('DOMContentLoaded', () => { bindDarkMode(); setupLogout(); });
