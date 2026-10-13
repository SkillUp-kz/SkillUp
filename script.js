const jobs = [
  {
    company: 'Northstar Labs', title: 'Junior Data Analyst', mode: 'Hybrid', level: 'Junior', city: 'Almaty', salary: '₸250k – 450k', match: 92, icon: '✳', tags: [
      'SQL', 'Excel', 'Reporting'
    ]
  }, {
    company: 'Qazaq Finance', title: 'Business Intelligence Intern', mode: 'Remote', level: 'Entry level', city: 'Kazakhstan', salary: '₸180k – 300k', match: 88, icon: '◈', tags: [
      'Power BI', 'Excel', 'Analytics'
    ]
  }, {
    company: 'Vertex Digital', title: 'Product Analyst', mode: 'Hybrid', level: 'Junior', city: 'Astana', salary: '₸300k – 500k', match: 85, icon: '⬡', tags: [
      'Product', 'SQL', 'Research'
    ]
  }, {
    company: 'Orbit Studio', title: 'Junior UX Researcher', mode: 'Remote', level: 'Junior', city: 'Kazakhstan', salary: '₸230k – 400k', match: 81, icon: '◎', tags: [
      'Research', 'UX', 'Communication'
    ]
  }, {
    company: 'Digital Nomads', title: 'Data Operations Assistant', mode: 'On-site', level: 'Entry level', city: 'Almaty', salary: '₸200k – 320k', match: 79, icon: '✦', tags: [
      'Excel', 'Operations', 'Dashboards'
    ]
  }, {
    company: 'Atlas Tech', title: 'Junior Frontend Developer', mode: 'Hybrid', level: 'Junior', city: 'Almaty', salary: '₸280k – 480k', match: 69, icon: '◐', tags: [
      'React', 'JavaScript', 'HTML'
    ]
  }
];
let apps = JSON.parse(localStorage.getItem('skillup-apps') || 'null') || [
  {
    id: 1, title: 'Junior Data Analyst', company: 'Northstar Labs', status: 'Interview'
  }, {
    id: 2, title: 'BI Intern', company: 'Qazaq Finance', status: 'Applied'
  }, {
    id: 3, title: 'Product Analyst', company: 'Vertex Digital', status: 'Saved'
  }, {
    id: 4, title: 'UX Researcher', company: 'Orbit Studio', status: 'Applied'
  }
];
function navigate(page) {
  document.querySelectorAll('.page').forEach(x => x.classList.toggle('active', x.id === page));
  document.querySelectorAll('.nav').forEach(x => x.classList.toggle('active', x.dataset.page === page));
  document.getElementById('crumb').textContent = ({
    dashboard: 'Overview', jobs: 'Find jobs', tracker: 'Applications', skills: 'Skill insights', interview: 'Interview practice', profile: 'My profile'
  })[page];
  window.scrollTo(0, 0);
}
document.querySelectorAll('.nav').forEach(n => n.addEventListener('click', () => navigate(n.dataset.page)));
function toast(t) {
  const el = document.getElementById('toast');
  el.textContent = t;
  el.style.display = 'block';
  clearTimeout(window.toasttimer);
  window.toasttimer = setTimeout(() => el.style.display = 'none', 3000);
}
function applyJob(title, company) {
  if (apps.some(a => a.title === title && a.company === company)) {
    toast('Already in your application tracker');
    return;
  }
  apps.push({
    id: Date.now(), title, company, status: 'Applied'
  });
  persist();
  toast('Application added to your tracker ✓');
  navigate('tracker');
}
function persist() {
  localStorage.setItem('skillup-apps', JSON.stringify(apps));
  renderTracker();
  updateDashboard();
}
let favorites = JSON.parse(localStorage.getItem('skillup-favorites') || '[]');
let onlySaved = false;
function jobKey(j) {
  return j.company + '|' + j.title;
}
function toggleFavorite(key) {
  if (favorites.includes(key))
    favorites = favorites.filter(x => x !== key);
  else
    favorites.push(key);
  localStorage.setItem('skillup-favorites', JSON.stringify(favorites));
  renderJobs();
  toast(favorites.includes(key) ? 'Job saved ☆' : 'Removed from saved jobs');
}
function toggleSavedOnly() {
  onlySaved = !onlySaved;
  document.getElementById('savedOnly').textContent = onlySaved ? '★ Showing saved — clear' : '☆ Saved only';
  renderJobs();
}
function showMatch(index) {
  const j = jobs[index];
  const known = [
    'SQL', 'Excel', 'Reporting', 'Analytics', 'Research', 'Communication', 'HTML'
  ];
  const matched = j.tags.filter(x => known.includes(x));
  const gaps = j.tags.filter(x => !known.includes(x));
  document.getElementById('matchDetails').innerHTML = `<div class="eyebrow">EXPLAINABLE DEMO MATCH</div><h2>${escapeHtml(j.title)}</h2><p class="subtitle">${escapeHtml(j.company)} · ${escapeHtml(j.city)}</p><div class="number">${j.match}% <span style="font-size:14px;color:#81938a">estimated fit</span></div><div class="track"><div class="fill" style="width:${j.match}%"></div></div><h3 style="margin-top:26px">Skills you already have</h3>${matched.length ? matched.map(t => `<span class="skilltag">✓ ${escapeHtml(t)}</span>`).join('') : '<p class="subtitle">No matching skills listed in the demo profile.</p>'}<h3 style="margin-top:25px">Skills to improve</h3>${gaps.length ? gaps.map(t => `<span class="pill">+ ${escapeHtml(t)}</span>`).join('') : '<p class="subtitle">No missing skills in this shortlist.</p>'}<p class="smallnote" style="margin-top:20px">Demo score based on sample profile data, not a real AI assessment.</p><button class="primary" onclick='applyJob(${JSON.stringify(j.title)},${JSON.stringify(j.company)});closeMatch()'>Add to application tracker →</button>`;
  document.getElementById('matchModal').classList.add('open');
}
function closeMatch() {
  document.getElementById('matchModal').classList.remove('open');
}
function renderJobs() {
  const q = document.getElementById('jobSearch').value.toLowerCase(), mode = document.getElementById('jobType').value, level = document.getElementById('jobLevel').value;
  const list = jobs.filter(j => ([
    j.title, j.company, j.city, ...j.tags
  ].join(' ').toLowerCase().includes(q)) && (mode === 'all' || j.mode === mode) && (level === 'all' || j.level === level) && (!onlySaved || favorites.includes(jobKey(j))));
  document.getElementById('jobCount').textContent = list.length + ' jobs found · ' + favorites.length + ' saved';
  document.getElementById('jobResults').innerHTML = list.length ? list.map(j => {
    const idx = jobs.indexOf(j), key = jobKey(j), isSaved = favorites.includes(key);
    return `<div class="jobcard"><div class="joblogo">${j.icon}</div><div class="details"><h3>${escapeHtml(j.title)}</h3><p>${escapeHtml(j.company)} · ${escapeHtml(j.city)} · ${escapeHtml(j.salary)}</p><div>${[
      j.mode, j.level, ...j.tags
    ].map(t => `<span class="pill">${escapeHtml(t)}</span>`).join('')}</div></div><div class="actions"><button class="outlinebtn" onclick="showMatch(${idx})">✦ ${j.match}% match · Why?</button><button class="outlinebtn ${isSaved ? 'saved' : ''}" onclick='toggleFavorite(${JSON.stringify(key)})'>${isSaved ? '★ Saved' : '☆ Save'}</button><button class="primary" onclick='applyJob(${JSON.stringify(j.title)},${JSON.stringify(j.company)})'>Add application ↗</button></div></div>`;
  }).join('') : '<div class="empty">No jobs found. Try changing your filters or saved view.</div>';
}
function exportCSV() {
  const data = [
    [
      'Role', 'Company', 'Status'
    ], ...apps.map(a => [
      a.title, a.company, a.status
    ])
  ];
  const csv = data.map(row => row.map(v => '"' + String(v).replace(/"/g, '""') + '"').join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob([
    '\ufeff' + csv
  ], {
    type: 'text/csv;charset=utf-8'
  }));
  const a = document.createElement('a');
  a.href = url;
  a.download = 'skillup-applications.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast('Applications exported ✓');
}
const roadmapTasks = [
  'Complete an introductory SQL practice project', 'Create a Power BI dashboard with sample data', 'Analyze a dataset using Python and pandas', 'Write a short case study for your portfolio'
];
let completedTasks = JSON.parse(localStorage.getItem('skillup-learning') || '[]');
function toggleTask(i) {
  completedTasks = completedTasks.includes(i) ? completedTasks.filter(x => x !== i) : [
    ...completedTasks, i
  ];
  localStorage.setItem('skillup-learning', JSON.stringify(completedTasks));
  renderRoadmap();
}
function renderRoadmap() {
  document.getElementById('roadmapList').innerHTML = roadmapTasks.map((task, i) => `<label class="learnitem ${completedTasks.includes(i) ? 'done' : ''}"><input type="checkbox" ${completedTasks.includes(i) ? 'checked' : ''} onchange="toggleTask(${i})"><span>${escapeHtml(task)}</span></label>`).join('');
  document.getElementById('roadmapProgress').textContent = `${completedTasks.length} of ${roadmapTasks.length} tasks completed (${Math.round(completedTasks.length / roadmapTasks.length * 100)}%)`;
}
function renderTracker() {
  const stages = [
    'Saved', 'Applied', 'Interview', 'Offer', 'Rejected'
  ];
  document.getElementById('kanban').innerHTML = stages.map(s => `<div class="column"><h3>${s}<span class="match">${apps.filter(a => a.status === s).length}</span></h3>${apps.filter(a => a.status === s).map(a => `<div class="task" title="Application details"><b>${escapeHtml(a.title)}</b><p>${escapeHtml(a.company)}</p><div class="taskactions"><button onclick="advance(${a.id})" title="Next stage">Next →</button><button onclick="changeStage(${a.id})" title="Change status">Edit</button><button onclick="deleteApplication(${a.id})" title="Delete application">Delete</button></div></div>`).join('') || '<p class="smallnote">Nothing here yet</p>'}</div>`).join('');
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}
function advance(id) {
  const a = apps.find(x => x.id === id), stages = [
    'Saved', 'Applied', 'Interview', 'Offer'
  ];
  if (stages.indexOf(a.status) >= 0 && stages.indexOf(a.status) < 3) {
    a.status = stages[stages.indexOf(a.status) + 1];
    persist();
    toast('Moved to ' + a.status);
  }
  else
    toast('Offer stage reached — congrats!');
}
function deleteApplication(id) {
  const a = apps.find(x => x.id === id);
  if (!a || !confirm('Delete ' + a.title + ' at ' + a.company + '?'))
    return;
  apps = apps.filter(x => x.id !== id);
  persist();
  toast('Application removed');
}
function changeStage(id) {
  const a = apps.find(x => x.id === id);
  if (!a)
    return;
  const stages = [
    'Saved', 'Applied', 'Interview', 'Offer', 'Rejected'
  ];
  const choice = prompt('Choose stage: ' + stages.join(', '), a.status);
  if (choice === null)
    return;
  const next = stages.find(x => x.toLowerCase() === choice.trim().toLowerCase());
  if (!next)
    return toast('Invalid stage');
  a.status = next;
  persist();
  toast('Stage updated ✓');
}
function showActivity() {
  const interview = apps.filter(x => x.status === 'Interview').length;
  toast(apps.length + ' applications · ' + interview + ' interviews · ' + favorites.length + ' saved jobs');
}
function updateDashboard() {
  document.getElementById('applicationCount').textContent = apps.length;
  document.getElementById('interviewCount').textContent = apps.filter(x => x.status === 'Interview').length;
  document.getElementById('matchesCount').textContent = jobs.length;
  const p = JSON.parse(localStorage.getItem('skillup-profile') || 'null');
  document.getElementById('profileStrength').innerHTML = (p ? 100 : 60) + '<span style="font-size:17px">%</span>';
}
function addApplication() {
  const title = prompt('Job title?');
  if (!title || !title.trim())
    return;
  const company = prompt('Company name?');
  if (!company || !company.trim())
    return;
  apps.push({
    id: Date.now(), title: title.trim(), company: company.trim(), status: 'Saved'
  });
  persist();
  toast('Application saved ✓');
}
let questions = [
  'Tell me about a time you used data to solve a problem.', 'How would you explain a complex finding to a non-technical teammate?', 'What would you do if you noticed missing values in a dataset?', 'Why do you want to become a data analyst?'
];
let questionIndex = 0;
function nextQuestion() {
  questionIndex = (questionIndex + 1) % questions.length;
  document.getElementById('question').textContent = questions[questionIndex];
  document.getElementById('answer').value = '';
  document.getElementById('feedback').style.display = 'none';
}
function feedback() {
  const a = document.getElementById('answer').value.trim(), f = document.getElementById('feedback');
  if (!a) {
    toast('Write an answer first');
    return;
  }
  const score = Math.min(100, Math.round(Math.min(a.length / 180, 1) * 55) + (/\d/.test(a) ? 15 : 0) + (/\b(i|my|we)\b/i.test(a) ? 15 : 0) + (/\b(result|improved|learned|outcome|achieved)\b/i.test(a) ? 15 : 0));
  f.style.display = 'block';
  f.innerHTML = '<b>Practice score: ' + score + '/100</b><br>' + (a.length < 100 ? 'Add more detail using the STAR method. ' : 'Good detail and clear structure. ') + (!/\d/.test(a) ? 'Include a measurable result if possible. ' : 'Good use of a measurable detail. ') + 'This is automated rule-based feedback, not an AI evaluation.';
  const history = JSON.parse(localStorage.getItem('skillup-practice') || '[]');
  history.unshift({
    question: questions[questionIndex], answer: a, score, date: new Date().toLocaleDateString()
  });
  localStorage.setItem('skillup-practice', JSON.stringify(history.slice(0, 20)));
  renderPractice();
}
function saveProfile() {
  const name = document.getElementById('profileName').value.trim();
  if (!name)
    return toast('Please enter your name');
  localStorage.setItem('skillup-profile', JSON.stringify({
    name, goal: document.getElementById('profileGoal').value, location: document.getElementById('profileLocation').value, work: document.getElementById('profileWork').value
  }));
  document.getElementById('greeting').textContent = name.split(' ')[0];
  document.getElementById('sideName').textContent = name;
  document.getElementById('profileTitle').textContent = name;
  updateDashboard();
  toast('Profile updated successfully ✓');
}
const saved = JSON.parse(localStorage.getItem('skillup-profile') || 'null');
if (saved) {
  document.getElementById('profileName').value = saved.name;
  document.getElementById('profileGoal').value = saved.goal;
  document.getElementById('profileLocation').value = saved.location;
  document.getElementById('profileWork').value = saved.work;
  document.getElementById('greeting').textContent = saved.name.split(' ')[0];
  document.getElementById('sideName').textContent = saved.name;
  document.getElementById('profileTitle').textContent = saved.name;
}
document.getElementById('dashboardJobs').innerHTML = jobs.slice(0, 3).map(j => `<div class="job"><div class="joblogo">${j.icon}</div><div class="jobtext"><b>${j.title}</b><p>${j.company} · ${j.mode} · ${j.city}</p></div><span class="match">${j.match}% match</span></div>`).join('');
renderJobs();
renderRoadmap();
persist();
function renderPractice() {
  const list = JSON.parse(localStorage.getItem('skillup-practice') || '[]');
  document.getElementById('practiceHistory').innerHTML = list.length ? list.map((x, i) => '<div class="progressrow"><b>' + escapeHtml(x.question) + '</b><p class="subtitle">' + escapeHtml(x.date) + ' · ' + x.score + '/100 · ' + escapeHtml(x.answer.slice(0, 110)) + (x.answer.length > 110 ? '…' : '') + '</p></div>').join('') : '<p class="subtitle">No practice sessions yet. Answer a question and click Get practice feedback.</p>';
}
function clearPractice() {
  if (confirm('Clear all saved interview practice?')) {
    localStorage.removeItem('skillup-practice');
    renderPractice();
    toast('Practice history cleared');
  }
}
renderPractice();
updateDashboard();
