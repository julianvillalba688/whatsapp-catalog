const fs = require('fs');
const path = './public/data/products.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

// Function to generate slug
const createSlug = (name, id) => {
  return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-') + '-' + id.toLowerCase();
};

const duplicateNamesMap = new Map();

data.forEach(p => {
  p.slug = createSlug(p.name, p.id);
  // While we are at it, ensure names are fully unique if they match another product in the same category? The user already asked to create unique names.
  // Actually, let's just make the slugs unique.
});

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('Slugs updated successfully.');
