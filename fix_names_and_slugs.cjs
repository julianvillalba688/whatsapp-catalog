const fs = require('fs');
const path = './public/data/products.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

// Dictionaries for more variety
const feminineNames = {
  'Anillo': ['Aura', 'Brisa', 'Destello', 'Luna', 'Amelie', 'Celine', 'Nacar', 'Solé', 'Estela', 'Roma', 'Vittoria', 'Gala', 'Siena', 'Mila', 'Alba', 'Clara', 'Lía', 'Dalia', 'Celeste', 'Serena', 'Aurora'],
  'Pulsera': ['Alba', 'Lia', 'Dalia', 'Serena', 'Aurora', 'Isabella', 'Mila', 'Siena', 'Gema', 'Cielo', 'Marina', 'Perla', 'Stella', 'Valeria', 'Elena', 'Victoria'],
  'Collar': ['Amour', 'Valentina', 'Latido', 'Alma', 'Clío', 'Lumina', 'Gema', 'Luz', 'Estrella', 'Sol', 'Nova', 'Aria', 'Flora', 'Vida'],
  'Aretes': ['Clara', 'Noa', 'Brisa', 'Gota', 'Sol', 'Stella', 'Mía', 'Maya', 'Perla', 'Luna', 'Flor', 'Nube', 'Rocío', 'Coral', 'Gala']
};

const adjectives = [
  'Dorada', 'Fina', 'Sutil', 'Suave', 'Elegante', 'Clásica', 'Moderna', 'Radiante', 'Luminosa', 'Serena', 'Eterna', 'Mágica', 'Delicada', 'Brillante', 'Pura', 'Íntima', 'Esencial', 'Armonía'
];

const createSlug = (name, id) => {
  return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-') + '-' + id.toLowerCase();
};

const existingNames = new Set();

const generateUniqueName = (baseCategory) => {
  let cat = 'Anillo';
  if (baseCategory.toLowerCase().includes('pulsera') || baseCategory.toLowerCase().includes('pulso')) cat = 'Pulsera';
  if (baseCategory.toLowerCase().includes('collar') || baseCategory.toLowerCase().includes('cadena') || baseCategory.toLowerCase().includes('dije') || baseCategory.toLowerCase().includes('choker') || baseCategory.toLowerCase().includes('rosario')) cat = 'Collar';
  if (baseCategory.toLowerCase().includes('arete') || baseCategory.toLowerCase().includes('topo') || baseCategory.toLowerCase().includes('candonga') || baseCategory.toLowerCase().includes('earcuff')) cat = 'Aretes';
  if (baseCategory.toLowerCase().includes('set') || baseCategory.toLowerCase().includes('juego')) cat = 'Set';
  if (baseCategory.toLowerCase().includes('reloj')) cat = 'Reloj';
  if (baseCategory.toLowerCase().includes('tobillera')) cat = 'Tobillera';
  if (baseCategory.toLowerCase().includes('vincha') || baseCategory.toLowerCase().includes('balaca') || baseCategory.toLowerCase().includes('diadema') || baseCategory.toLowerCase().includes('gancho')) cat = 'Accesorio';

  // Specific handling for non-jewelry items
  if (cat === 'Reloj' || cat === 'Set' || cat === 'Tobillera' || cat === 'Accesorio') {
      const names = feminineNames['Collar']; // fallback
      let name = '';
      let attempts = 0;
      do {
          const n1 = names[Math.floor(Math.random() * names.length)];
          const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
          name = `${cat} ${n1} ${adj}`;
          attempts++;
      } while (existingNames.has(name) && attempts < 100);
      existingNames.add(name);
      return name;
  }

  const namesList = feminineNames[cat] || feminineNames['Anillo'];
  
  let name = '';
  let attempts = 0;
  
  do {
    const n = namesList[Math.floor(Math.random() * namesList.length)];
    const useAdj = Math.random() > 0.5;
    if (useAdj) {
      const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
      name = `${cat} ${n} ${adj}`;
    } else {
      // maybe add another word
      const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
      name = `${cat} ${n}`;
      if (existingNames.has(name)) name = `${cat} ${n} ${adj}`;
    }
    attempts++;
  } while (existingNames.has(name) && attempts < 200);

  // If still duplicate (unlikely), add random suffix
  if (existingNames.has(name)) {
    name = `${name} V${Math.floor(Math.random() * 999)}`;
  }
  
  existingNames.add(name);
  return name;
};

// Reset all generic-looking names or names we generated before
data.forEach(p => {
  const isGeneric = ['Anillo', 'Pulsera', 'Collar', 'Aretes', 'Dije', 'Topo', 'Candonga', 'Juego', 'Set', 'Cadena'].some(word => p.originalName?.includes(word) || p.name.includes(word));
  
  if (isGeneric) {
      p.name = generateUniqueName(p.category || p.name);
  }
  
  p.slug = createSlug(p.name, p.id);
});

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('Unique names and slugs generated successfully.');
