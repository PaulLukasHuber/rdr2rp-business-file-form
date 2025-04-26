// Tab Navigation
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab, .tab-content').forEach(el => el.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

// Konstanten und Daten
const maxEmployees = 3;
const operationsByCity = {
  AB: ['Mining Company Annesburg','Saloon Annesburg'],
  AD: ['Bestatter Armadillo','Bäckerei Armadillo','Brauerei Armadillo','Büchsenmacher Armadillo','Farm Armadillo','Gestüt Armadillo','Jagdbund Armadillo','Pizzeria Armadillo (Event Gewerbe)','Saloon Armadillo','Tierarzt Armadillo','Schneider Valentine'],
  BW: ['Metzger Blackwater','Büchsenmacher Blackwater','Tabakhändler Blackwater','Saloon Blackwater','Farm Blackwater'],
  CO: ['Schmied Colter','Saloon Colter'],
  RH: ['Jagdbund Rhodes','Schmied Rhodes','Farm Rhodes'],
  SB: ['Bäckerei Strawberry','Brauerei Strawberry','Gestüt Strawberry','Holzfäller Strawberry'],
  SD: ['Jagdbund Saint Denis','Bäckerei Saint Denis','Bestatter Saint Denis','Brauerei Valentine','Brauerei Saint Denis','Büchsenmacher Saint Denis','Gärtnerei Saint Denis','Gestüt Saint Denis','Kutschenbauer Saint Denis','Saloon Saint Denis','Tabakhändler Saint Denis','Theater Saint Denis','Train Company Saint Denis','Zeitung Saint Denis'],
  TW: ['Mining Company Tumbleweed'],
  VA: ['Farm Valentine','Brauerei Valentine','Saloon Valentine','Tierarzt Valentine','Büchsenmacher Valentine','Schneider Valentine']
};

// DOM Elemente
const container = document.getElementById('employees-container');
const addBtn = document.getElementById('addEmployeeBtn');
const roles = ['Inhaber','1. Stellvertretung','2. Stellvertretung'];
const licenseCountInput = document.getElementById('licenseCount');
const generateBtn = document.getElementById('generateBtn');
const discordOutput = document.getElementById('discordOutput');
const copyBtn = document.getElementById('copyBtn');

// Mitarbeiter Funktionen
function createEmployeeRow() {
  const idx = container.children.length;
  const wrapper = document.createElement('div');
  wrapper.className = 'employee-wrapper';
  
  const header = document.createElement('div');
  header.className = 'employee-header';
  
  const roleLabel = document.createElement('span');
  roleLabel.className = 'employee-role';
  roleLabel.textContent = roles[idx] || '';
  
  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'remove-employee-btn';
  removeBtn.textContent = 'Eintrag löschen';
  removeBtn.addEventListener('click', () => {
    if (container.children.length > 1) {
      wrapper.remove();
      updateEmployees();
    }
  });
  
  header.append(roleLabel, removeBtn);
  wrapper.appendChild(header);

  const row = document.createElement('div');
  row.className = 'employee-row';
  
  ['Vorname','Nachname','Telegrammnummer'].forEach((ph,i) => {
    const inp = document.createElement('input');
    inp.type = 'text';
    inp.placeholder = ph;
    inp.className = i===0?'empFirstName':i===1?'empLastName':'empTelegram';
    row.appendChild(inp);
  });
  
  wrapper.appendChild(row);
  return wrapper;
}

function updateEmployees() {
  const rows = container.querySelectorAll('.employee-wrapper');
  rows.forEach((w,i) => {
    w.querySelector('.employee-role').textContent = roles[i] || '';
    w.querySelector('.remove-employee-btn').style.display = (i>0 && rows.length>1) ? 'inline-flex' : 'none';
  });
  
  // Button ausblenden statt nur deaktivieren, wenn Maximum erreicht
  if (rows.length >= maxEmployees) {
    addBtn.style.display = 'none';
  } else {
    addBtn.style.display = 'flex';
  }
  
  licenseCountInput.value = rows.length;
}

// Event Listener
addBtn.addEventListener('click', () => {
  if (container.children.length < maxEmployees) {
    container.appendChild(createEmployeeRow());
    updateEmployees();
  }
});

document.getElementById('cityCode').addEventListener('change', function() {
  const city = this.value;
  const op = document.getElementById('operation');
  op.innerHTML = city
    ? '<option value="">-- bitte Betrieb wählen --</option>'
    : '<option value="">-- zuerst Stadt wählen --</option>';
  (operationsByCity[city] || []).forEach(o => {
    const opt = document.createElement('option');
    opt.value = o;
    opt.textContent = o;
    op.appendChild(opt);
  });
});

generateBtn.addEventListener('click', () => {
  const note = document.getElementById('note').value.trim();
  if (!note || !/^https?:\/\/.+/.test(note)) {
    alert('Bitte gültigen Link eingeben.');
    return;
  }
  
  const city = document.getElementById('cityCode').value;
  if (!city) {
    alert('Bitte Stadt wählen.');
    return;
  }
  
  const operation = document.getElementById('operation').value;
  if (!operation) {
    alert('Bitte Betrieb wählen.');
    return;
  }
  
  const license = city + ' - ' + generateRandomString(8);
  const issued = document.getElementById('issuedDate').value || '---';
  const specialPermit = document.getElementById('specialPermit').value.trim() || '---';
  const other = document.getElementById('other').value.trim() || '---';
  
  const employees = [...container.querySelectorAll('.employee-row')].map(r => {
    const fn = r.querySelector('.empFirstName').value.trim() || '---';
    const ln = r.querySelector('.empLastName').value.trim() || '---';
    const tg = r.querySelector('.empTelegram').value.trim() || '---';
    return `${fn} ${ln} - ${tg}`;
  }).join('\n');
  
  const template =
    `Vermerk zum Gewerbeantrag:\n\`\`\`${note}\`\`\`\n` +
    `Lizenznummer:\n\`\`\`${license}\`\`\`\n` +
    `Ausgestellt am (*Gültigkeit ab*):\n\`\`\`${issued}\`\`\`\n` +
    `Betrieb:\n\`\`\`${operation}\`\`\`\n` +
    `Mitarbeiter (Inhaber & Stellvertretungen):\n\`\`\`${employees}\`\`\`\n` +
    `Anzahl der herausgegebenen Lizenzen:\n\`\`\`${licenseCountInput.value}\`\`\`\n` +
    `Sondergenehmigung:\n\`\`\`${specialPermit}\`\`\`\n` +
    `Sonstiges:\n\`\`\`${other}\`\`\``;
  
  discordOutput.value = template;
  
  // Scrolle automatisch zur Vorschau auf kleinen Bildschirmen
  if (window.innerWidth <= 968) {
    document.querySelector('.preview-container').scrollIntoView({ behavior: 'smooth' });
  }
});

// Kopieren in die Zwischenablage
copyBtn.addEventListener('click', () => {
  if (discordOutput.value) {
    discordOutput.select();
    document.execCommand('copy');
    
    const originalText = copyBtn.textContent;
    copyBtn.innerHTML = '<i class="fa fa-check"></i> Kopiert!';
    
    setTimeout(() => {
      copyBtn.innerHTML = '<i class="fa fa-copy"></i> In Zwischenablage kopieren';
    }, 2000);
  }
});

// Hilfsfunktionen
function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Initialisierung
container.appendChild(createEmployeeRow());
updateEmployees();

// Setze Datum auf 1899 wenn nicht bereits gesetzt
if (!document.getElementById('issuedDate').value) {
  const today = new Date();
  const year = 1899;
  const month = today.getMonth() + 1;
  const day = today.getDate();
  document.getElementById('issuedDate').value = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}