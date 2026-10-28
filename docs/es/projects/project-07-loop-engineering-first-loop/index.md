[English Version →](../../../en/projects/project-07-loop-engineering-first-loop/)

# Proyecto 07. Construye Tu Primer Loop Automatizado

> Lección relacionada: [L13. Por Qué Necesitas Dejar de Hacerle Prompting a Tu Agente](./../../lectures/lecture-13-loop-engineering/index.md)

## Qué Harás

Este es el proyecto de transición de "Harness" a "Loop". Ya sabes cómo configurar un agente con un entorno adecuado, instrucciones y retroalimentación — ahora convertirás esa configuración en un loop que corre por sí solo.

Harás tres experimentos progresivos: primero convertirás una tarea de manual a `/goal`, luego convertirás una tarea de monitoreo en un temporizador `/loop`, y finalmente construirás un loop completo de maker-checker para experimentar cómo se siente cuando **tú sales del loop.**

## Herramientas Que Usarás

- Claude Code o Codex
- Git
- Tu harness completo de P06
- Un multiplexor de terminal (tmux o screen, para observar loops de larga ejecución)
- Opcional: GitHub Actions o cron (para experimentos avanzados impulsados por eventos / programados)

## Pasos

### Preparación

1. Empieza desde el mismo commit donde terminaste P06.
2. Crea tres ramas: `p07-goal-loop`, `p07-timer-loop`, `p07-maker-checker`.
3. Confirma que tu harness funciona: ejecuta init.sh, verifica que el archivo de estado, la lista de características y los docs de handoff están todos en su lugar.
4. Elige una **tarea objetivo** en la que quieras que el loop trabaje repetidamente. Elige algo de tamaño mediano con criterios de finalización claros — ej., "añadir tests unitarios a todos los módulos, alcanzando 80% de cobertura" o "añadir validación de entrada a todos los endpoints de API."

### Experimento 1: Loop de Objetivo — De Ejecución Manual a Ejecución Automática

Cambia a la rama `p07-goal-loop`.

1. **Escribe la descripción del objetivo**: Convierte tu tarea elegida en un archivo `goal.md` que contenga:
   - Objetivo claro ("qué cuenta como terminado")
   - Método de verificación ("cómo confirmar que está terminado" — ¿ejecutar tests? ¿ejecutar lint? ¿comprobar cobertura?)
   - Condición de parada ("cuándo debe detenerse" — ¿turnos máximos? ¿límite de tiempo? ¿límite de presupuesto?)
   - Restricciones ("qué no tocar" — configuración de producción, esquema de base de datos, etc.)

2. **Primera ejecución manual**: Dale la tarea al agente manualmente, tú mismo. Registra cuántos turnos tomó, cuántas veces interviniste, y la calidad del resultado. Esta es tu línea base.

3. **Ejecuta con `/goal`**: Usa el mismo `goal.md` como entrada y ejecútalo en modo `/goal`. El agente itera por sí solo hasta que se alcanza el objetivo o se activa la condición de parada.

4. **Compara resultados**:
   - Diferencia en el recuento de turnos
   - Diferencia en tu recuento de intervenciones
   - Diferencia en la calidad del resultado (usando el mismo estándar de verificación)
   - Diferencia en el tiempo que invertiste

5. **Itera sobre goal.md**: Si los resultados son pobres, revisa la descripción del objetivo y vuelve a ejecutar. Sigue hasta que estés satisfecho con los resultados, o hasta que hayas confirmado el límite de lo que un loop de objetivo puede hacer en esta tarea.

### Experimento 2: Loop de Temporizador — Convierte el Monitoreo en un Latido

Cambia a la rama `p07-timer-loop`.

1. **Elige una tarea de monitoreo**: Encuentra una comprobación repetitiva que normalmente haces manualmente. Por ejemplo:
   - Ejecutar la suite de tests cada hora, arreglar fallos
   - Comprobar actualizaciones de seguridad de dependencias cada mañana
   - Comprobar violaciones de estilo de codificación después de cada commit
   - Escanear periódicamente comentarios TODO para ver cuáles están obsoletos

2. **Escribe el prompt/script de monitoreo**: Expón los pasos de monitoreo claramente — qué comprobar, qué hacer cuando se encuentren problemas, y cuándo llamar a un humano.

3. **Ejecuta con `/loop` (o Codex Thread automation)**:
   - Establece un intervalo razonable (10-30 minutos recomendados — demasiado corto y te molestará, demasiado largo y no verás el efecto)
   - Déjalo correr durante al menos 2 horas (o ve a hacer otra cosa y vuelve más tarde)

4. **Registra los resultados**:
   - ¿Cuántos problemas encontró?
   - ¿Cuántos arregló por sí solo?
   - ¿Cuántos fueron falsos positivos?
   - ¿Cuántos empeoró?
   - ¿Cuánto tiempo invertiste haciendo seguimiento de sus resultados?

5. **Reflexiona**: ¿Vale la pena automatizar esta tarea de monitoreo? Compara el tiempo que ahorraste vs. el tiempo que invertiste haciendo seguimiento. Si no vale la pena, ¿elegiste la tarea equivocada, o el loop está mal diseñado?

### Experimento 3: Loop de Maker-Checker — Sácate del Loop

Cambia a la rama `p07-maker-checker`.

Este es el más importante de los tres experimentos. Construirás un **loop completo que no necesita que estés ahí:**

1. **Diseña la estructura del loop**:
   - **Agente Maker**: implementa, escribe código, modifica archivos
   - **Agente Checker**: verifica, ejecuta tests, hace revisión de código, aprueba / reprueba
   - **Archivo de estado** (`loop-state.md`): registra la ronda actual, lo que se hizo, resultados de verificación, qué sigue
   - **Condición de parada**: N aprobaciones consecutivas, o se alcanzan las rondas máximas

2. **Escribe tres prompts**:
   - Instrucciones del Maker (qué hacer, cómo hacerlo, qué no tocar)
   - Instrucciones del Checker (qué verificar, cómo verificar, qué cuenta como aprobación, cómo dar retroalimentación)
   - Lógica de control del loop (quién va primero, cómo funciona el handoff, cómo empezar la siguiente ronda)

3. **Ejecuta al menos 5 rondas**:
   - Ronda 1: Maker implementa → Checker verifica → Fallo → Retroalimentación al Maker
   - Ronda 2: Maker revisa basado en retroalimentación → Checker verifica → ...
   - ...
   - Hasta aprobación consecutiva, o lo llamas tú

4. **Registra el estado de cada ronda**:
   - Número de ronda
   - Qué hizo el Maker
   - Qué problemas encontró el Checker
   - Aprobado / reprobado
   - ¿Interviniste? (si sí, ¿por qué?)

5. **Retrospectiva final**:
   - ¿Cuántas veces interviniste? ¿Por qué?
   - ¿Qué habría pasado si no hubieras intervenido?
   - ¿El Checker se perdió algún problema?
   - ¿El Maker seguía cometiendo el mismo error?
   - ¿Dónde está el techo de calidad de este loop? ¿Capacidad del Maker, o capacidad del Checker?

## Cómo Medir los Resultados

| Métrica | Exp 1 (Objetivo) | Exp 2 (Temporizador) | Exp 3 (Maker-Checker) |
|--------|-------------|--------------|----------------------|
| Tasa de finalización de tarea | ¿Se alcanzó el objetivo? | ¿Cuántos ciclos de monitoreo corrieron? | ¿Cuántas rondas hasta aprobar? |
| Intervenciones humanas | ¿Cuántas veces interviniste? | ¿Cuánto tiempo invertiste haciendo seguimiento? | ¿Cuántas veces interviniste? |
| Calidad del resultado | ¿Cómo se compara con lo manual? | ¿Tasa de falsos positivos? ¿Problemas perdidos? | ¿Cuántos problemas encontró Checker que tú no habrías encontrado? |
| Tiempo ahorrado | ¿Cuánto tiempo ahorraste? | ¿Vale la pena automatizarlo? | Tiempo invertido diseñando el loop vs. tiempo ahorrado |
| Confiabilidad | ¿Fue confiable la condición de parada? | ¿Se descontroló? | ¿Puede el loop atascarse en el mismo lugar? |

## Qué Entregar

- `goal.md` (descripción del objetivo del Experimento 1, al menos dos iteraciones)
- Notas de comparación del Experimento 1: manual vs loop de objetivo
- Prompt de monitoreo del Experimento 2 + registro de ejecución de 2 horas
- Los tres prompts del Experimento 3 (Maker / Checker / Control de loop)
- `loop-state.md` del Experimento 3 (al menos 5 rondas registradas)
- Retrospectiva final: aprendizajes de los tres experimentos, cómo cambió tu comprensión del loop engineering, qué cosas son buenas candidatas para loop-ificación y cuáles no

## Lecciones Relacionadas

- [Lección 13 — Por Qué Necesitas Dejar de Hacerle Prompting a Tu Agente](../../lectures/lecture-13-loop-engineering/index.md)
- [Lección 12 — Por Qué Cada Sesión Debe Dejar un Estado Limpio](../../lectures/lecture-12-why-every-session-must-leave-a-clean-state/index.md) (cada ronda de un loop necesita estado limpio)
- [Lección 11 — Por Qué la Observabilidad Pertenece Dentro del Harness](../../lectures/lecture-11-why-observability-belongs-inside-the-harness/index.md) (necesitas ver qué está pasando dentro del loop)
- [Lección 05 — Por Qué los Archivos de Estado Son la Columna Vertebral de la Continuidad](../../lectures/lecture-05-why-long-running-tasks-lose-continuity/index.md) (los archivos de estado de loop son una extensión de los archivos de estado)
