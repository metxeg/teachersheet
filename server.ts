import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini SDK
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "TeacherSheet API" });
});

// Helper schema for 17-section recipe sheet
const recipeSchema = {
  type: Type.OBJECT,
  properties: {
    code: { type: Type.STRING, description: "Código oficial ej: CS-01, PT-02, CC-05, PA-01" },
    category: { type: Type.STRING, description: "Categoría culinaria oficial" },
    title: { type: Type.STRING, description: "Título en MAYÚSCULAS de la receta" },
    subtitle: { type: Type.STRING, description: "Subtítulo o descripción breve" },
    generalData: {
      type: Type.OBJECT,
      properties: {
        portions: { type: Type.NUMBER },
        preElaborationMinutes: { type: Type.NUMBER },
        elaborationMinutes: { type: Type.NUMBER },
        totalMinutes: { type: Type.NUMBER },
        difficulty: { type: Type.STRING },
      },
      required: ["portions", "preElaborationMinutes", "elaborationMinutes", "totalMinutes", "difficulty"],
    },
    objective: { type: Type.STRING },
    recommendedLevel: { type: Type.STRING },
    relatedModules: {
      type: Type.OBJECT,
      properties: {
        fpBasica: { type: Type.ARRAY, items: { type: Type.STRING } },
        gradoMedio: { type: Type.ARRAY, items: { type: Type.STRING } },
        gradoSuperior: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
    },
    ingredients: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          quantity: { type: Type.STRING },
          grossWeightGrams: { type: Type.NUMBER },
          wastePercentage: { type: Type.NUMBER },
          unitPriceKgOrL: { type: Type.NUMBER },
        },
        required: ["name", "quantity"],
      },
    },
    utensilsAndMachinery: { type: Type.ARRAY, items: { type: Type.STRING } },
    preElaborationSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
    elaborationSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
    appliedTechniques: { type: Type.ARRAY, items: { type: Type.STRING } },
    frequentIncidences: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          incidence: { type: Type.STRING },
          causes: { type: Type.STRING },
        },
        required: ["incidence", "causes"],
      },
    },
    criticalPointsAppcc: { type: Type.ARRAY, items: { type: Type.STRING } },
    preservation: { type: Type.STRING },
    regeneration: { type: Type.STRING },
    presentation: { type: Type.STRING },
    allergens: { type: Type.ARRAY, items: { type: Type.STRING } },
    nutritionalValue: { type: Type.STRING },
    qualityCriteria: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: [
    "code",
    "category",
    "title",
    "generalData",
    "objective",
    "recommendedLevel",
    "ingredients",
    "utensilsAndMachinery",
    "preElaborationSteps",
    "elaborationSteps",
    "appliedTechniques",
    "frequentIncidences",
    "criticalPointsAppcc",
    "preservation",
    "regeneration",
    "presentation",
    "allergens",
    "nutritionalValue",
    "qualityCriteria",
  ],
};

const systemInstructionBase = `Eres un Executive Chef y Catedrático de Gastronomía de la Red de Escuelas Hosteleras Españolas.
Tu tarea es transformar CUALQUIER receta recibida (venga de una URL web, una foto o escaneo de libro de cocina, un archivo PDF, un documento Word/Docx, un archivo Excel/CSV o un texto plano) a la FICHA TÉCNICA OFICIAL DE FORMACIÓN PROFESIONAL DE HOSTELERÍA EN ESPAÑA COMPLETA (con las 17 secciones estándar).

REGLA CRÍTICA EXPRÉS PARA LA LISTA DE INGREDIENTES:
Debes leer y analizar minuciosamente TODO el documento, PDF, texto o imagen de origen.
1. DEBES EXTRAER E INCLUIR EL 100% DE LOS INGREDIENTES presentes en la receta original.
2. NO omitas NINGÚN ingrediente, por secundario que parezca (incluye salsas, caldos, fondos, marinados, vinagres, especias, hierbas, aceites, sal, pimienta, harinas, levaduras, aliños, condimentos, guarniciones y decoraciones).
3. NO agrupes ni resumas ingredientes en un solo elemento. Cada uno debe ir en una línea independiente en el array 'ingredients'.
4. Si la receta original no especifica el peso bruto, merma o precio unitario de algún ingrediente, ESTÍMALO Y CALCÚLALO DIDÁCTICAMENTE con el rigor de una escuela de hostelería.

DIRECTIVA FUNDAMENTAL DE RELLENADO DIDÁCTICO (FILL-IN-THE-BLANKS):
Las recetas originales habitualmente son incompletas o caseras y carecen de rigor educativo. DEBES RELLENAR Y COMPLETAR CON CRITERIO PROFESIONAL TODOS LOS HUECOS QUE NO ESTÉN EN LA RECETA ORIGINAL:
1. DATOS GENERALES: raciones, tiempos exactos de preelaboración y elaboración, nivel de dificultad.
2. OBJETIVO DE LA ELABORACIÓN: Resumen didáctico de técnicas, texturas y conservación.
3. NIVEL FORMATIVO RECOMENDADO: Grado Básico, Grado Medio o Grado Superior.
4. MÓDULOS PROFESIONALES RELACIONADOS: módulos oficiales del currículo educativo de FP de Hostelería.
5. INGREDIENTES Y ESCANDALLO: Extrae el 100% de ingredientes. Asigna nombres limpios, cantidades exactas (g, ml, c/s), peso bruto en gramos, porcentaje de mermas (%) y estimación realista de precio unitario en €/kg o €/L.
6. UTILLAJE Y MAQUINARIA DE TALLER: Utensilios específicos necesarios en taller de cocina.
7. PREELABORACIÓN: Pasos detallados de pesaje, limpieza, pelado, corte y mise en place.
8. ELABORACIÓN: Pasos estructurados de cocción, salteado, batido, fermentación, emulsionado o triturado.
9. TÉCNICAS CULINARIAS APLICADAS: lista clara de técnicas.
10. INCIDENCIAS FRECUENTES Y POSIBLES CAUSAS: Tabla de 2 a 4 problemas técnicos frecuentes en taller y sus causas.
11. PUNTOS CRÍTICOS / APPCC: Puntos críticos de control, temperaturas y seguridad alimentaria.
12. CONSERVACIÓN: Tª y recipientes (ej: abatimiento a +3ºC, conservación entre 0-4ºC).
13. REGENERACIÓN: Métodos de recalentado y pase.
14. PRESENTACIÓN: Emplatado, vajilla recomendada y decoración.
15. ALÉRGENOS: Identifica los alérgenos presentes según la lista oficial UE de 14 alérgenos ('Gluten', 'Crustáceos', 'Huevos', 'Pescado', 'Cacahuetes', 'Soja', 'Lácteos', 'Frutos de cáscara', 'Apio', 'Mostaza', 'Sésamo', 'Dióxido de azufre y sulfitos', 'Altramuces', 'Moluscos').
16. VALOR NUTRICIONAL: Análisis cualitativo.
17. CRITERIOS DE CALIDAD DEL RESULTADO FINAL: Puntos clave para que el docente evalúe el plato terminado.

IMPORTANTE: Mantén todas las frases concisas, técnicas y al grano para garantizar que el documento sea claro y no se corte.`;

function extractImageUrlFromHtml(html: string, baseUrl: string): string | null {
  try {
    // 1. Check og:image or twitter:image
    const ogMatch = html.match(/<meta\s+[^>]*property=["'](?:og:image|twitter:image)["']\s+content=["']([^"']+)["']/i) ||
                    html.match(/<meta\s+[^>]*content=["']([^"']+)["']\s+property=["'](?:og:image|twitter:image)["']/i) ||
                    html.match(/<meta\s+[^>]*name=["'](?:og:image|twitter:image)["']\s+content=["']([^"']+)["']/i);
    if (ogMatch && ogMatch[1]) {
      let imgUrl = ogMatch[1].trim();
      if (imgUrl.startsWith('//')) imgUrl = 'https:' + imgUrl;
      else if (imgUrl.startsWith('/') && baseUrl) {
        try {
          const u = new URL(baseUrl);
          imgUrl = `${u.protocol}//${u.host}${imgUrl}`;
        } catch (e) {}
      }
      return imgUrl;
    }

    // 2. Check JSON-LD schema image
    const jsonLdMatches = html.match(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi);
    if (jsonLdMatches) {
      for (const m of jsonLdMatches) {
        const jsonContent = m.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '');
        try {
          const ld = JSON.parse(jsonContent);
          const findImg = (obj: any): string | null => {
            if (!obj) return null;
            if (typeof obj === 'string' && (obj.includes('http') || obj.match(/\.(jpg|jpeg|png|webp)/i))) return obj;
            if (Array.isArray(obj)) {
              for (const item of obj) {
                const res = findImg(item);
                if (res) return res;
              }
            } else if (typeof obj === 'object') {
              if (obj.image) return findImg(obj.image);
              if (obj.url && typeof obj.url === 'string' && (obj.url.includes('http') || obj.url.match(/\.(jpg|jpeg|png|webp)/i))) return obj.url;
            }
            return null;
          };
          const extracted = findImg(ld);
          if (extracted) {
            let imgUrl = extracted.trim();
            if (imgUrl.startsWith('//')) imgUrl = 'https:' + imgUrl;
            else if (imgUrl.startsWith('/') && baseUrl) {
              try {
                const u = new URL(baseUrl);
                imgUrl = `${u.protocol}//${u.host}${imgUrl}`;
              } catch (e) {}
            }
            return imgUrl;
          }
        } catch (e) {}
      }
    }
  } catch (err) {
    console.warn("Could not extract image from HTML:", err);
  }
  return null;
}

function getFallbackFoodImage(title: string = "", category: string = ""): string {
  const t = (title + " " + category).toLowerCase();

  // Arroces / Paellas / Risottos
  if (t.includes("arroz") || t.includes("paella") || t.includes("risotto") || t.includes("fideua") || t.includes("fideuá")) {
    return "https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=800&q=80";
  }
  // Carnes / Aves / Asados
  if (t.includes("carne") || t.includes("ternera") || t.includes("cerdo") || t.includes("pollo") || t.includes("solomillo") || t.includes("chule") || t.includes("secreto") || t.includes("carrillada") || t.includes("hamburguesa") || t.includes("albondiga") || t.includes("albóndiga") || t.includes("estofado") || t.includes("cordero")) {
    return "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80";
  }
  // Pescados / Mariscos
  if (t.includes("pescado") || t.includes("marisco") || t.includes("atun") || t.includes("atún") || t.includes("lubina") || t.includes("merluza") || t.includes("gamba") || t.includes("pulpo") || t.includes("calamar") || t.includes("sepia") || t.includes("bacalao") || t.includes("salmon") || t.includes("salmón") || t.includes("rodaballo") || t.includes("tartar")) {
    return "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80";
  }
  // Postres / Tartas / Chocolates / Repostería
  if (t.includes("postre") || t.includes("tarta") || t.includes("chocolate") || t.includes("dulce") || t.includes("helado") || t.includes("pastel") || t.includes("flan") || t.includes("torrija") || t.includes("bizcocho") || t.includes("brownie") || t.includes("mousse") || t.includes("hojaldre") || t.includes("croissant")) {
    return "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80";
  }
  // Ensaladas / Verduras / Hortalizas
  if (t.includes("ensalada") || t.includes("verdura") || t.includes("huerta") || t.includes("vegetal") || t.includes("escalivada") || t.includes("pisto") || t.includes("menestra") || t.includes("espárrago") || t.includes("esparrago") || t.includes("alcachofa")) {
    return "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80";
  }
  // Sopas / Cremas / Gazpachos / Vichyssoise
  if (t.includes("sopa") || t.includes("crema") || t.includes("caldo") || t.includes("potaje") || t.includes("vichyssoise") || t.includes("gazpacho") || t.includes("salmorejo") || t.includes("consomé") || t.includes("consome") || t.includes("bisque")) {
    return "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80";
  }
  // Legumbres / Guisos / Potajes
  if (t.includes("lenteja") || t.includes("garbanzo") || t.includes("alubia") || t.includes("fabada") || t.includes("cocido") || t.includes("guiso")) {
    return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";
  }
  // Pastas / Pizzas / Masas
  if (t.includes("pasta") || t.includes("macarron") || t.includes("macarrón") || t.includes("tallarin") || t.includes("tallarín") || t.includes("espagueti") || t.includes("lasaña") || t.includes("pizza") || t.includes("gnocchi") || t.includes("ñoqui")) {
    return "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80";
  }
  // Tapas / Croquetas / Tortillas / Entrantes
  if (t.includes("croqueta") || t.includes("tortilla") || t.includes("tapa") || t.includes("aperitivo") || t.includes("empanda") || t.includes("empanadilla") || t.includes("patatas bravas")) {
    return "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80";
  }
  // Panadería / Pan
  if (t.includes("pan") || t.includes("hogaza") || t.includes("masa madre") || t.includes("focaccia") || t.includes("brioche")) {
    return "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80";
  }

  return "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80";
}

async function safeGenerateDishImage(title: string, category: string = "", description: string = ""): Promise<string> {
  if (!title) return getFallbackFoodImage("", category);

  const imgPrompt = `Professional gourmet culinary photo of ${title}. ${description || ''}. Michelin-star plating on clean porcelain dish, warm studio lighting, 8k food photography.`;

  // 1. Try gemini-3.1-flash-lite-image with generateContent
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-image",
      contents: {
        parts: [{ text: imgPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "4:3",
        },
      },
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData?.data) {
          const mime = part.inlineData.mimeType || "image/png";
          return `data:${mime};base64,${part.inlineData.data}`;
        }
      }
    }
  } catch (err1: any) {
    const msg = err1?.status === 'RESOURCE_EXHAUSTED' || err1?.message?.includes('Quota exceeded')
      ? 'Quota limit 0 or exhausted on Free Tier for image generation'
      : (err1?.message || err1);
    console.log(`Notice (gemini-3.1-flash-lite-image): ${msg}. Using culinary photo fallback.`);
  }

  // 2. Try gemini-3.1-flash-image
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-image",
      contents: {
        parts: [{ text: imgPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "4:3",
        },
      },
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData?.data) {
          const mime = part.inlineData.mimeType || "image/png";
          return `data:${mime};base64,${part.inlineData.data}`;
        }
      }
    }
  } catch (err2: any) {
    const msg = err2?.status === 'RESOURCE_EXHAUSTED' || err2?.message?.includes('Quota exceeded')
      ? 'Quota limit 0 or exhausted on Free Tier for image generation'
      : (err2?.message || err2);
    console.log(`Notice (gemini-3.1-flash-image): ${msg}. Using culinary photo fallback.`);
  }

  return getFallbackFoodImage(title, category);
}

function repairTruncatedJson(jsonStr: string): string {
  let s = jsonStr.trim();

  // Find start of JSON ({ or [)
  const firstBrace = s.indexOf('{');
  const firstBracket = s.indexOf('[');
  if (firstBrace === -1 && firstBracket === -1) return s;

  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    s = s.substring(firstBrace);
  } else if (firstBracket !== -1) {
    s = s.substring(firstBracket);
  }

  // Remove trailing key/value fragments or colons or commas
  s = s.replace(/,?\s*"[^"]*"?\s*:\s*$/, '');
  s = s.replace(/,\s*$/, '');

  let inString = false;
  let isEscaped = false;
  const stack: string[] = [];

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (inString) {
      if (ch === '\\') {
        isEscaped = !isEscaped;
      } else if (ch === '"' && !isEscaped) {
        inString = false;
      } else {
        isEscaped = false;
      }
    } else {
      if (ch === '"') {
        inString = true;
      } else if (ch === '{' || ch === '[') {
        stack.push(ch);
      } else if (ch === '}') {
        if (stack.length > 0 && stack[stack.length - 1] === '{') stack.pop();
      } else if (ch === ']') {
        if (stack.length > 0 && stack[stack.length - 1] === '[') stack.pop();
      }
    }
  }

  // If stuck inside an open string quote, close it
  if (inString) {
    s += '"';
  }

  // Clean trailing commas before closing
  s = s.replace(/,?\s*$/, '');

  // Close open brackets/braces in reverse order
  while (stack.length > 0) {
    const open = stack.pop();
    if (open === '{') s += '}';
    else if (open === '[') s += ']';
  }

  return s;
}

function parseGeminiJson(rawText: string): any {
  if (!rawText || typeof rawText !== "string") {
    throw new Error("No se recibió texto válido de la IA.");
  }

  let cleaned = rawText.trim();

  // Strip markdown code fence wrapper if present
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  }

  // 1. Try direct parse
  try {
    return JSON.parse(cleaned);
  } catch (e1) {
    console.warn("Direct JSON.parse failed, attempting string cleanup...");
  }

  // 2. Escape literal newlines/tabs inside string values
  let sanitize = "";
  let inString = false;
  let isEscaped = false;

  for (let i = 0; i < cleaned.length; i++) {
    const ch = cleaned[i];
    if (inString) {
      if (ch === '\\') {
        isEscaped = !isEscaped;
        sanitize += ch;
      } else if (ch === '"' && !isEscaped) {
        inString = false;
        sanitize += ch;
      } else if (ch === '\n') {
        sanitize += '\\n';
        isEscaped = false;
      } else if (ch === '\r') {
        sanitize += '\\r';
        isEscaped = false;
      } else if (ch === '\t') {
        sanitize += '\\t';
        isEscaped = false;
      } else {
        isEscaped = false;
        sanitize += ch;
      }
    } else {
      if (ch === '"') inString = true;
      sanitize += ch;
    }
  }

  try {
    return JSON.parse(sanitize);
  } catch (e2) {
    console.warn("Sanitized JSON.parse failed, attempting truncated JSON repair...");
  }

  // 3. Attempt repair for truncated JSON
  const repaired = repairTruncatedJson(sanitize);
  try {
    return JSON.parse(repaired);
  } catch (e3) {
    console.error("Repaired JSON parse failed:", e3);
    throw new Error("El formato de respuesta de la IA fue incompleto. Por favor vuelve a intentarlo.");
  }
}

// API Endpoint to generate 17-section official Technical Sheet for Culinary Training
app.post("/api/generate-ficha", async (req, res) => {
  try {
    const {
      prompt,
      category = "CREMAS Y SOPAS",
      educationalLevel = "Grado Medio",
      portions = 10,
      targetCost = 30,
      customInstructions = "",
    } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "El nombre o descripción de la receta es obligatorio." });
    }

    const userPromptText = `Genera la Ficha Técnica Culinaria completa para: "${prompt}".
Categoría sugerida: ${category}.
Nivel educativo objetivo: ${educationalLevel}.
Número de raciones base: ${portions}.
Porcentaje objetivo de Food Cost: ${targetCost}%.
${customInstructions ? `Notas adicionales del docente: ${customInstructions}` : ""}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: userPromptText,
      config: {
        systemInstruction: systemInstructionBase,
        temperature: 0.7,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("No se obtuvo respuesta en texto de Gemini");
    }

    const parsedData = parseGeminiJson(jsonText);

    let dishImageUrl = parsedData.imageUrl;
    if (!dishImageUrl) {
      dishImageUrl = await safeGenerateDishImage(parsedData.title, parsedData.category, parsedData.subtitle);
    }

    const fullRecipeSheet = {
      ...parsedData,
      imageUrl: dishImageUrl,
      id: `gen-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite: false,
      targetFoodCostPercentage: targetCost,
      ingredients: (parsedData.ingredients || []).map((ing: any, index: number) => ({
        ...ing,
        id: ing.id || `ing-${index}-${Date.now()}`,
        grossWeightGrams: ing.grossWeightGrams || 100,
        wastePercentage: ing.wastePercentage || 0,
        unitPriceKgOrL: ing.unitPriceKgOrL || 2.50,
      })),
    };

    res.json(fullRecipeSheet);
  } catch (error: any) {
    console.error("Error generating recipe sheet:", error);
    res.status(500).json({
      error: "No se pudo generar la ficha técnica con IA.",
      details: error?.message || String(error),
    });
  }
});

// Universal API Endpoint to import recipes from ANY source (URL, Image/OCR, PDF, DOCX, Excel/CSV, Text)
app.post("/api/import-recipe", async (req, res) => {
  try {
    const {
      inputType = "text",
      url,
      fileDataBase64,
      mimeType,
      fileText,
      fileName,
      category = "CREMAS Y SOPAS",
      educationalLevel = "Grado Medio",
      portions = 10,
      targetCost = 30,
      customNotes = "",
    } = req.body;

    let contents: any = [];
    let extractedUrlImage: string | null = null;

    if (inputType === "url") {
      if (!url) {
        return res.status(400).json({ error: "Debe proporcionar una URL válida." });
      }

      let fetchedContent = "";
      try {
        const fetchRes = await fetch(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
        });
        const html = await fetchRes.text();
        extractedUrlImage = extractImageUrlFromHtml(html, url);

        // Extract basic text from HTML
        fetchedContent = html
          .replace(/<script\b[^<]*>([\s\S]*?)<\/script>/gi, "")
          .replace(/<style\b[^<]*>([\s\S]*?)<\/style>/gi, "")
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .slice(0, 15000); // Take first 15k characters
      } catch (err) {
        console.warn("Could not fetch direct URL content, sending URL to Gemini directly:", err);
      }

      const promptText = `ANALIZA Y TRANSFORMA ESTA RECETA PROVENIENTE DE LA URL: "${url}".
${fetchedContent ? `CONTENIDO EXTRAÍDO DE LA PÁGINA WEB:\n${fetchedContent}\n` : ""}
Nivel Educativo Objetivo: ${educationalLevel}.
Raciones Base: ${portions}.
Categoría sugerida: ${category}.
${customNotes ? `Instrucciones del profesor: ${customNotes}` : ""}

IMPORTANTE: Rellena todos los huecos no presentes en la receta original para que sea una Ficha Técnica Culinaria Oficial completa de 17 secciones para docentes de Hostelería.`;

      contents = [promptText];

    } else if (inputType === "file" && fileDataBase64) {
      // Vision / Multimodal (Images PNG/JPG/WEBP, PDF)
      let resolvedMimeType = mimeType || "application/pdf";
      if (fileName?.toLowerCase().endsWith(".pdf") || mimeType?.includes("pdf")) {
        resolvedMimeType = "application/pdf";
      } else if (!mimeType) {
        resolvedMimeType = "image/jpeg";
      }

      const promptText = `ANALIZA DETALLADAMENTE Y SIN OMISIONES EL ARCHIVO ADJUNTO (Documento/PDF/Imagen/Escaneo "${fileName || "receta_adjunta"}") Y TRANSFÓRMALO EN UNA FICHA TÉCNICA OFICIAL DE FORMACIÓN PROFESIONAL DE HOSTELERÍA DE 17 SECCIONES.

INSTRUCCIÓN VITAL DE INGREDIENTES:
Lee el documento/PDF completo desde la primera hasta la última página. EXTRAE Y LISTA EL 100% DE LOS INGREDIENTES que figuren en la receta original.
- NO omitas condimentos, sal, pimienta, aceites, harinas, vinagres, hierbas, especias, caldos, fondos, marinados, salsas ni guarniciones.
- Si en el archivo hay 10, 15, 20 o 30 ingredientes, los 10, 15, 20 o 30 DEBEN figurar individualmente en el array 'ingredients'.
- Si faltan precios o % de mermas en el origen, estímalos y complétalos didácticamente.

Nivel Educativo Objetivo: ${educationalLevel}.
Raciones Base: ${portions}.
Categoría sugerida: ${category}.
${customNotes ? `Notas adicionales del profesor: ${customNotes}` : ""}

REGLA DE ORO DE RELLENADO DIDÁCTICO: Si en el archivo faltan datos para completar las 17 secciones oficiales (alérgenos, puntos críticos APPCC, utillaje, incidencias o criterios de calidad), RELLÉNALOS Y COMPLÉTALOS con rigor docente.`;

      contents = [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: resolvedMimeType,
                data: fileDataBase64,
              },
            },
            { text: promptText },
          ],
        },
      ];

    } else {
      // Text / Extract from DOCX, Excel/CSV or Raw Text
      const rawText = fileText || customNotes || "Receta no especificada";
      const promptText = `TRANSFORMA LA SIGUIENTE RECETA EN TEXTO / HOJA DE CÁLCULO / DOCUMENTO EN UNA FICHA TÉCNICA OFICIAL DE FORMACIÓN PROFESIONAL DE HOSTELERÍA DE 17 SECCIONES:

RECETA ORIGINAL RECIBIDA:
"""
${rawText}
"""

Nivel Educativo Objetivo: ${educationalLevel}.
Raciones Base: ${portions}.
Categoría sugerida: ${category}.
${customNotes ? `Notas adicionales del docente: ${customNotes}` : ""}

REGLA DE ORO: Si en la receta faltan datos de las 17 secciones estándar, RELLÉNALOS E INFIÉRELOS PROFESIONALMENTE con el rigor de un Catedrático de Hostelería.`;

      contents = [promptText];
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents,
      config: {
        systemInstruction: systemInstructionBase,
        temperature: 0.6,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("No se obtuvo respuesta de Gemini al importar la receta.");
    }

    const parsedData = parseGeminiJson(jsonText);

    // Determine best presentation image
    let dishImageUrl = extractedUrlImage || parsedData.imageUrl;

    // If user uploaded a photo file, use that as the dish image
    if (inputType === "file" && mimeType?.startsWith("image/") && fileDataBase64) {
      dishImageUrl = `data:${mimeType};base64,${fileDataBase64}`;
    }

    if (!dishImageUrl) {
      dishImageUrl = await safeGenerateDishImage(parsedData.title, parsedData.category, parsedData.subtitle);
    }

    const fullRecipeSheet = {
      ...parsedData,
      imageUrl: dishImageUrl,
      id: `imported-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite: false,
      targetFoodCostPercentage: targetCost,
      ingredients: (parsedData.ingredients || []).map((ing: any, index: number) => ({
        ...ing,
        id: ing.id || `ing-${index}-${Date.now()}`,
        grossWeightGrams: ing.grossWeightGrams || 100,
        wastePercentage: ing.wastePercentage || 0,
        unitPriceKgOrL: ing.unitPriceKgOrL || 2.50,
      })),
    };

    res.json(fullRecipeSheet);
  } catch (error: any) {
    console.error("Error importing recipe sheet:", error);
    res.status(500).json({
      error: "Error al transformar e importar la receta con IA.",
      details: error?.message || String(error),
    });
  }
});

// API Endpoint to generate a dish visual mockup image for the technical sheet
app.post("/api/generate-dish-image", async (req, res) => {
  try {
    const { title, category, description } = req.body;

    if (!title) {
      return res.status(400).json({ error: "El título de la receta es requerido." });
    }

    const imageUrl = await safeGenerateDishImage(title, category, description);
    res.json({ imageUrl });
  } catch (error: any) {
    const fallback = getFallbackFoodImage(req.body?.title, req.body?.category);
    res.json({ imageUrl: fallback });
  }
});

// API Endpoint to complete empty/blank fields in a manual recipe sheet with AI
app.post("/api/complete-recipe-fields", async (req, res) => {
  try {
    const recipe = req.body;

    if (!recipe.title || typeof recipe.title !== "string" || !recipe.title.trim()) {
      return res.status(400).json({ error: "Introduce al menos el nombre de la receta para que la IA pueda completar los campos." });
    }

    const systemInstructionComplete = `${systemInstructionBase}

INSTRUCCIÓN VITAL DE COMPLETADO PARCIAL (PRESERVAR LO YA EXISTENTE):
El usuario ha introducido manualmente una Ficha Técnica parcial o incompleta.
1. NO MODIFIQUES NI BORRES los campos que el usuario ya haya rellenado.
2. COMPLETA Y GENERA ÚNICAMENTE las secciones, campos o arrays que estén VACÍOS o con cadenas vacías.
3. Si el usuario ya proporcionó una lista de ingredientes, mantenlos todos e incluye sus pesos, mermas y precios si faltan, y añade cualquier ingrediente indispensable que faltase.`;

    const userPromptText = `A continuación se muestra la Ficha Técnica rellenada parcialmente por el usuario:
${JSON.stringify(recipe, null, 2)}

Por favor completa TODOS los campos y secciones que estén en blanco o vacíos respetando la estructura JSON de 17 secciones oficiales.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: userPromptText,
      config: {
        systemInstruction: systemInstructionComplete,
        temperature: 0.6,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("No se obtuvo respuesta de Gemini");
    }

    const parsedData = parseGeminiJson(jsonText);

    res.json(parsedData);
  } catch (error: any) {
    console.error("Error completing recipe fields:", error);
    res.status(500).json({
      error: "Error al completar campos vacíos con IA.",
      details: error?.message || String(error),
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TeacherSheet Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
