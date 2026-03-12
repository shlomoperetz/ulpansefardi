# Roadmap — ulpansefardi.com

Análisis de mejoras ordenado por impacto pedagógico y técnico.

---

## 🔴 Crítico

### 1. Audio (pronunciación sefardí)
El mayor hueco del proyecto. Sin audio el alumno no sabe si pronuncia bien.
- Web Speech API (`lang: 'he-IL'`) — gratis, sin servidor
- Botón "escuchar" en cada carta (Anki + Lilmod)
- Idealmente: grabaciones reales con pronunciación sefardí

### 2. Fase intermedia — selección múltiple
El salto de *reconocer* hebreo a *escribirlo* es demasiado brusco.
- Añadir Fase 1.5: elegir la traducción correcta entre 4 opciones
- Progresión: **reconocer → elegir → escribir**

### 3. SRS real (curva del olvido)
Acertar 3 veces en la misma sesión no garantiza retención al día siguiente.
- Implementar SM-2 básico: cada carta tiene fecha de próxima revisión
- Las cartas "dominadas" vuelven después de días/semanas, no desaparecen

---

## 🟡 Importante

### 4. Fix adjetivos de género
Cartas como `שְׂמֵחָה` (f) sin su par `שָׂמֵחַ` (m). El alumno aprende la forma femenina como si fuera la única.
- Enseñar el patrón: masculino base + regla de feminización
- Reducir entradas duplicadas (dormido×4 → 1 entrada con paradigma)

### 5. "Siguiente lote" al terminar
Al completar un lote, el único botón es "Volver al inicio".
- Si el lote siguiente está desbloqueado, ofrecer ir directamente

### 6. Fix contador de lotes
Muestra `0/19 lotes completados` incluyendo repasos.
- Mostrar solo lotes base: `0/15`

### 7. Más vocabulario
90 cartas únicas es un buen punto de partida, pero insuficiente.
- Números (1-10, decenas, ordinales)
- Colores, familia, partes del cuerpo
- Preguntas esenciales: מה, איפה, מתי, למה, מי, כמה
- Saludos y expresiones cotidianas
- Meta: 300-500 cartas

### 8. Frases para todos los lotes
`FRASES_POR_LOTE` solo cubre 7 de 19 lotes.
- Añadir frases para Adj estado 1/2, descripción 1/2
- Añadir frases para Verbos cotidiano y rutina

---

## 🟢 Calidad técnica

### 9. Clave estable en FRASES_POR_LOTE
Actualmente usa IDs numéricos de lotes. Si los IDs cambian, las frases se asignan al lote equivocado.
- Usar el campo `label` del lote como clave

### 10. PWA / modo offline
Para uso diario en transporte, sin internet.
- Service worker mínimo + manifest

### 11. `isLoteDone` no se usa
Función exportada en `storage.js` que nunca se llama. Hay inconsistencia: un lote podría tener todas sus cartas dominadas sin marcarse como `done`.

---

## 🔵 Más adelante

- **Dikduk** — sección de gramática (ya preparada como "próximamente")
- **Frases activas** — el alumno construye frases arrastrando palabras o escribiendo
- **Conjugaciones** — mostrar forma conjugada presente junto al infinitivo
- **Estadísticas** — gráfico de progreso por semana, palabras aprendidas por día
- **Compartir progreso** — "llevo N días estudiando hebreo"
