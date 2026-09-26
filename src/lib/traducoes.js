// Traduz/limpa os dados crus que vêm do Open Food Facts (categorias e alérgenos vêm em inglês/slug)

const CATEGORIAS = {
  'beverages': 'Bebidas',
  'beverages-and-beverages-preparations': 'Bebidas',
  'dairies': 'Laticínios',
  'fermented-foods': 'Alimentos fermentados',
  'fermented-milk-products': 'Laticínios fermentados',
  'meats': 'Carnes',
  'meals': 'Refeições prontas',
  'snacks': 'Salgadinhos e lanches',
  'sweet-snacks': 'Doces',
  'biscuits-and-cakes': 'Biscoitos e bolos',
  'breakfasts': 'Café da manhã',
  'cereals-and-potatoes': 'Cereais e grãos',
  'fruits-and-vegetables-based-foods': 'Frutas e vegetais',
  'plant-based-foods-and-beverages': 'Alimentos vegetais',
  'plant-based-foods': 'Alimentos vegetais',
  'seafood': 'Frutos do mar',
  'fishes': 'Peixes',
  'cheeses': 'Queijos',
  'yogurts': 'Iogurtes',
  'condiments': 'Condimentos',
  'sauces': 'Molhos',
  'spreads': 'Cremes e pastas',
  'breads': 'Pães',
  'frozen-foods': 'Congelados',
  'canned-foods': 'Enlatados',
  'chocolates': 'Chocolates',
  'candies': 'Balas e doces',
  'ice-creams-and-sorbets': 'Sorvetes',
  'cocoa-and-its-products': 'Cacau e derivados',
  'groceries': 'Mercearia',
  'baby-foods': 'Alimentos infantis',
  'pastas': 'Massas',
  'flours': 'Farinhas',
  'sugars': 'Açúcares',
  'fats': 'Gorduras e óleos',
  'oils-and-fats': 'Óleos e gorduras',
}

const ALERGENOS = {
  'milk': 'leite',
  'eggs': 'ovos',
  'fish': 'peixe',
  'crustaceans': 'crustáceos',
  'molluscs': 'moluscos',
  'peanuts': 'amendoim',
  'nuts': 'castanhas',
  'tree-nuts': 'castanhas',
  'soybeans': 'soja',
  'gluten': 'glúten',
  'sesame-seeds': 'gergelim',
  'mustard': 'mostarda',
  'celery': 'aipo',
  'lupin': 'tremoço',
  'sulphur-dioxide-and-sulphites': 'dióxido de enxofre e sulfitos',
}

function limparSlug(s) {
  return s.replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase())
}

export function traduzirCategoria(raw) {
  if (!raw) return null
  const chave = raw.trim().toLowerCase()
  return CATEGORIAS[chave] || limparSlug(raw)
}

export function traduzirAlergenos(raw) {
  if (!raw) return null
  return raw.split(',')
    .map(a => a.trim().toLowerCase())
    .filter(Boolean)
    .map(a => ALERGENOS[a] || a)
    .join(', ')
}

export function nutriScoreValido(score) {
  return score && score !== 'UNKNOWN' && score !== 'NOT-APPLICABLE' ? score : null
}
