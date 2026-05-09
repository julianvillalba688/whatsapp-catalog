const fs = require('fs');

const path = './public/data/products.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const feminineNames = {
  'Anillo': ['Aura', 'Brisa Dorada', 'Destello Suave', 'Luna Fina', 'Amelie', 'Celine', 'Nacar', 'Solé', 'Estela', 'Luz de Luna', 'Roma', 'Vittoria', 'Gala'],
  'Pulsera': ['Alba', 'Brillo Diario', 'Lia', 'Dalia', 'Serena', 'Aurora', 'Isabella', 'Mila', 'Siena', 'Luminosa'],
  'Collar': ['Amour', 'Corazón Luz', 'Valentina', 'Latido', 'Estrella Fugaz', 'Eternidad', 'Alma', 'Clío', 'Lumina', 'Gema'],
  'Aretes': ['Perla Serena', 'Luz de Perla', 'Clara', 'Noa', 'Brisa', 'Gota de Luz', 'Sol', 'Stella', 'Mía', 'Maya', 'Sutiles']
};

const getRandomName = (base) => {
  let cat = 'Anillo';
  if (base.toLowerCase().includes('pulsera')) cat = 'Pulsera';
  if (base.toLowerCase().includes('collar')) cat = 'Collar';
  if (base.toLowerCase().includes('aretes') || base.toLowerCase().includes('arete')) cat = 'Aretes';
  if (base.toLowerCase().includes('set')) return 'Set ' + feminineNames['Collar'][Math.floor(Math.random() * feminineNames['Collar'].length)];
  
  const options = feminineNames[cat] || feminineNames['Anillo'];
  const name = options[Math.floor(Math.random() * options.length)];
  return `${cat} ${name}`;
};

data.forEach(p => {
  if (p.name.includes('Delicado') || p.name === 'Anillo' || p.name === 'Pulsera' || p.name === 'Collar' || p.name === 'Aretes') {
    p.name = getRandomName(p.name);
  }
});

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('Products updated successfully.');
