import { RecipeSheet } from '../types';

export const VICHYSSOISE_CS01: RecipeSheet = {
  id: 'cs-01-vichyssoise',
  code: 'CS-01',
  category: 'CREMAS Y SOPAS',
  title: 'VICHYSSOISE',
  subtitle: 'Crema fría clásica de puerros, patata y nata de origen francés',
  imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=1200',
  
  generalData: {
    portions: 10,
    preElaborationMinutes: 20,
    elaborationMinutes: 35,
    totalMinutes: 55,
    difficulty: 'MEDIA',
  },

  objective: 'Elaborar una crema clásica de origen francés, obteniendo una textura fina, homogénea y terciopelada mediante técnicas de rehogado, cocción, triturado y tamizado, garantizando una correcta conservación para su servicio frío o caliente.',

  recommendedLevel: 'Grado Medio',

  relatedModules: {
    fpBasica: [
      'Técnicas elementales de preelaboración.',
      'Procesos básicos de producción culinaria.'
    ],
    gradoMedio: [
      'Preelaboración y conservación de alimentos.',
      'Técnicas culinarias.',
      'Productos culinarios.'
    ],
    gradoSuperior: [
      'Procesos de preelaboración y conservación en cocina.',
      'Procesos de elaboración culinaria.',
      'Gestión de la producción en cocina.'
    ]
  },

  ingredients: [
    { id: 'i1', name: 'Puerro', quantity: '700 g', grossWeightGrams: 900, wastePercentage: 22, unitPriceKgOrL: 1.80 },
    { id: 'i2', name: 'Patata', quantity: '500 g', grossWeightGrams: 600, wastePercentage: 16, unitPriceKgOrL: 0.90 },
    { id: 'i3', name: 'Mantequilla', quantity: '100 g', grossWeightGrams: 100, wastePercentage: 0, unitPriceKgOrL: 8.50 },
    { id: 'i4', name: 'Fondo blanco', quantity: '2 litros', grossWeightGrams: 2000, wastePercentage: 0, unitPriceKgOrL: 1.20 },
    { id: 'i5', name: 'Nata líquida', quantity: '500 ml', grossWeightGrams: 500, wastePercentage: 0, unitPriceKgOrL: 4.20 },
    { id: 'i6', name: 'Sal', quantity: 'c/s', grossWeightGrams: 15, wastePercentage: 0, unitPriceKgOrL: 0.50 },
    { id: 'i7', name: 'Pimienta blanca', quantity: 'c/s', grossWeightGrams: 3, wastePercentage: 0, unitPriceKgOrL: 22.00 },
    { id: 'i8', name: 'Cebollino', quantity: 'c/s', grossWeightGrams: 20, wastePercentage: 5, unitPriceKgOrL: 15.00 }
  ],

  utensilsAndMachinery: [
    'Tabla de corte',
    'Cuchillo cebollero',
    'Puntilla',
    'Báscula',
    'Marmita o cacerola',
    'Espátula',
    'Batidora de vaso o túrmix',
    'Chino o colador fino',
    'Recipiente Gastronorm',
    'Abatidor de temperatura (si se sirve fría)'
  ],

  preElaborationSteps: [
    'Seleccionar materias primas frescas y en correcto estado de conservación.',
    'Lavar cuidadosamente los puerros para eliminar restos de tierra entre sus hojas.',
    'Desechar la parte verde más dura y aprovechar la parte blanca y el inicio de la verde.',
    'Pelar, lavar y cortar las patatas en dados regulares.',
    'Pesar todos los ingredientes.',
    'Calentar previamente el fondo blanco.',
    'Preparar la mise en place y disponer el utillaje necesario.'
  ],

  elaborationSteps: [
    'Fundir la mantequilla a fuego suave sin que llegue a tomar color.',
    'Incorporar el puerro y rehogarlo lentamente hasta que quede tierno, evitando cualquier caramelización.',
    'Añadir la patata y rehogar durante dos o tres minutos.',
    'Mojar con el fondo blanco caliente.',
    'Cocer a fuego suave durante aproximadamente 25 minutos o hasta que la patata esté completamente cocida.',
    'Triturar hasta obtener una crema homogénea.',
    'Pasar por un chino fino para conseguir una textura terciopelada.',
    'Incorporar la nata líquida.',
    'Rectificar el punto de sal y pimienta blanca.',
    'Si se sirve fría, enfriar rápidamente mediante abatimiento y conservar refrigerada.'
  ],

  appliedTechniques: [
    'Lavado y desinfección',
    'Pelado y corte',
    'Rehogado',
    'Mojado',
    'Cocción por ebullición',
    'Triturado',
    'Tamizado',
    'Rectificación del sazonamiento',
    'Enfriamiento rápido'
  ],

  frequentIncidences: [
    { incidence: 'La crema queda demasiado espesa', causes: 'Exceso de patata o reducción excesiva del líquido durante la cocción.' },
    { incidence: 'La crema queda demasiado líquida', causes: 'Exceso de fondo o poca proporción de patata.' },
    { incidence: 'Presenta grumos', causes: 'Triturado insuficiente o no pasar por el chino.' },
    { incidence: 'Color oscuro', causes: 'El puerro ha tomado color durante el rehogado.' },
    { incidence: 'Sabor amargo', causes: 'Exceso de parte verde del puerro o rehogado excesivo.' },
    { incidence: 'Se separa la grasa', causes: 'Incorporación incorrecta de la nata o ebullición excesiva tras añadirla.' }
  ],

  criticalPointsAppcc: [
    'Eliminar completamente los restos de tierra del puerro.',
    'Mantener la cadena de frío de la nata.',
    'Evitar contaminaciones cruzadas.',
    'Mantener temperaturas superiores a 65 ºC durante el servicio en caliente.',
    'Si se sirve fría, abatir la temperatura hasta alcanzar menos de 10 ºC en el menor tiempo posible y conservar posteriormente entre 0 y 4 ºC.',
    'Utilizar utensilios perfectamente higienizados durante el triturado y el envasado.'
  ],

  preservation: 'Conservar refrigerada entre 0 y 4 ºC en recipientes tapados e identificados. Consumir preferentemente antes de 48 horas.',

  regeneration: 'Si se sirve caliente, regenerar lentamente sin alcanzar una ebullición intensa para evitar la separación de la nata. Si se sirve fría, remover antes del servicio para recuperar la homogeneidad.',

  presentation: 'Servir en plato hondo, bol o taza previamente fría o caliente según el tipo de servicio. Decorar con cebollino fresco finamente picado y, opcionalmente, con un cordón de nata o unas gotas de aceite de cebollino.',

  allergens: ['Lácteos'],

  nutritionalValue: 'La vichyssoise presenta un aporte moderado de hidratos de carbono procedentes de la patata y un contenido graso derivado de la mantequilla y la nata, que aportan cremosidad y valor energético. El puerro proporciona fibra, vitaminas y minerales, haciendo de esta elaboración una crema equilibrada dentro de una dieta variada.',

  qualityCriteria: [
    'Color blanco marfil uniforme.',
    'Textura fina, lisa y terciopelada.',
    'Ausencia de grumos o fibras.',
    'Consistencia cremosa, sin resultar excesivamente espesa ni líquida.',
    'Sabor suave, equilibrado y característico del puerro.',
    'Temperatura de servicio adecuada (fría entre 6 y 8 ºC o caliente entre 65 y 70 ºC).',
    'Presentación limpia y cuidada.'
  ],

  targetFoodCostPercentage: 30,
  createdAt: '2026-07-22T00:00:00.000Z',
  updatedAt: '2026-07-22T00:00:00.000Z',
  isFavorite: true
};

export const COULANT_PT02: RecipeSheet = {
  id: 'pt-02-coulant',
  code: 'PT-02',
  category: 'PASTELERÍA',
  title: 'COULANT DE CHOCOLATE 70%',
  subtitle: 'Bizcocho fluido de chocolate negro con corazón líquido cremoso',
  imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=1200',
  generalData: {
    portions: 12,
    preElaborationMinutes: 15,
    elaborationMinutes: 20,
    totalMinutes: 35,
    difficulty: 'ALTA'
  },
  objective: 'Dominar la técnica de emulsión de huevo y azúcar, fundido controlado de cobertura de chocolate a 45ºC y cocción con choque térmico para obtener un núcleo fluido.',
  recommendedLevel: 'Grado Superior',
  relatedModules: {
    gradoMedio: ['Procesos de pastelería y repostería'],
    gradoSuperior: ['Procesos de elaboración de pastelería y repostería']
  },
  ingredients: [
    { id: 'c1', name: 'Cobertura Chocolate 70%', quantity: '250 g', grossWeightGrams: 250, unitPriceKgOrL: 14.50 },
    { id: 'c2', name: 'Mantequilla 82%', quantity: '200 g', grossWeightGrams: 200, unitPriceKgOrL: 8.50 },
    { id: 'c3', name: 'Huevos enteros', quantity: '4 uds (200g)', grossWeightGrams: 200, unitPriceKgOrL: 3.20 },
    { id: 'c4', name: 'Yemas de huevo', quantity: '4 uds (80g)', grossWeightGrams: 80, unitPriceKgOrL: 5.50 },
    { id: 'c5', name: 'Azúcar blanco', quantity: '120 g', grossWeightGrams: 120, unitPriceKgOrL: 1.10 },
    { id: 'c6', name: 'Harina de floja W100', quantity: '80 g', grossWeightGrams: 80, unitPriceKgOrL: 0.90 }
  ],
  utensilsAndMachinery: ['Báscula de precisión', 'Montadora/Túrmix', 'Moldes de aluminio', 'Horno de convección', 'Abatidor'],
  preElaborationSteps: ['Pesar ingredientes con precisión.', 'Encamisar moldes con mantequilla y cacao en polvo.'],
  elaborationSteps: [
    'Fundir chocolate y mantequilla a baño maría (45ºC).',
    'Blanquear huevos, yemas y azúcar sin incorporar exceso de aire.',
    'Mezclar ambas fases con espátula y tamizar la harina.',
    'Dosificar en moldes (80g/molde) y congelar mínimo 2 horas.',
    'Hornear a 200ºC durante 9 minutos exactos.'
  ],
  appliedTechniques: ['Fundido a temperatura controlada', 'Emulsión', 'Tamizado', 'Dosificado', 'Horneado preciso'],
  frequentIncidences: [
    { incidence: 'Núcleo cuajado sin fluido', causes: 'Exceso de tiempo u horno demasiado alto.' },
    { incidence: 'Se rompe al desmoldar', causes: 'Desmoldeo sin reposo de 1 minuto o falta de harina.' }
  ],
  criticalPointsAppcc: ['Desinfección de cáscara de huevo.', 'Control de tiempo de horneado.'],
  preservation: 'Mantener congelado a -18ºC hasta el momento del horneado.',
  regeneration: 'Hornear directamente desde congelado.',
  presentation: 'Desmoldar en el centro del plato con espolvoreado de azúcar glas y quenelle de helado de vainilla.',
  allergens: ['Huevos', 'Lácteos', 'Gluten'],
  nutritionalValue: 'Alto contenido calórico y lipídico, fuente de antioxidantes procedentes del cacao 70%.',
  qualityCriteria: ['Exterior firme e interior completamente fluido.', 'Sabor intenso a cacao sin amargor quemado.'],
  targetFoodCostPercentage: 25,
  createdAt: '2026-07-22T00:00:00.000Z',
  updatedAt: '2026-07-22T00:00:00.000Z',
  isFavorite: true
};

export const SAMPLE_RECIPES: RecipeSheet[] = [COULANT_PT02];
