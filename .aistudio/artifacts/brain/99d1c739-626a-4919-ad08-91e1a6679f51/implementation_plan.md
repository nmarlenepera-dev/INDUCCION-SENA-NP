# Plan de Implementación: Sincronización Automática y Desatendida con Google Sheets & Drive

Este plan detalla la arquitectura y pasos necesarios para que el prototipo de inducción SENA registre los datos de los aprendices en la hoja de cálculo de Google Drive de manera **100% automática y en segundo plano**, sin necesidad de abrir modales manuales, presionar botones de sincronización repetitivos ni reconfigurar credenciales continuamente.

---

## 1. Objetivos y Respuestas del Usuario
- **Momento de sincronización**: Automático en el momento en que el aprendiz culmina la evaluación formativa o aprueba la inducción (emisión de constancia).
- **Manejo de conexión**: Sesión única y persistente que opera de forma silenciosa en segundo plano, recordando la hoja de cálculo oficial creada.
- **Tolerancia a fallos**: Cola local resiliente (`localStorage` / almacenamiento local) que encola registros si no hay red o si el token está renovándose, reintentando de forma automática en cuanto se restablezca la conexión.

---

## 2. Arquitectura de Sincronización Desatendida

```
┌────────────────────────────────────────────────────────┐
│             Prototipo de Inducción SENA                │
│  (Evaluación Final / Certificado Digital / Progreso)    │
└───────────────────────────┬────────────────────────────┘
                            │ Disparo de evento: culminación / aprobación
                            ▼
┌────────────────────────────────────────────────────────┐
│           Servicio de Auto-Sincronización              │
│            (`backgroundSyncService.ts`)                │
├───────────────────────────┬────────────────────────────┤
│ ¿Hay token & conexión?    │ ¿Sin red o token vencido?  │
│          SI               │            NO              │
│          ▼                │            ▼               │
│ Enviar directo a Google   │ Guardar en Cola Local      │
│ Sheets API                │ (`offlineSyncQueue.ts`)    │
│          │                │            │               │
│          ▼                │            ▼               │
│ Notificación Toast sutil  │ Auto-reintento con evento  │
│ "Guardado en Drive"       │ `online` / reconexión      │
└───────────────────────────┴────────────────────────────┘
```

---

## 3. Componentes y Modificaciones Específicas

### A. Módulo de Cola Offline y Reintentos (`src/services/offlineSyncQueue.ts`)
- Almacenamiento estructurado en `localStorage` con clave `sena_pending_sync_queue`.
- Cada registro incluye:
  - Datos completos del aprendiz (Nombre, documento, ficha, regional, puntaje, código de verificación, fecha y norma Acuerdo 0009 de 2024).
  - Marca temporal y contador de reintentos.
  - Clave de idempotencia única (`fichaNumber-documentNumber-verificationCode`) para evitar filas duplicadas en la hoja.
- Métodos:
  - `enqueueApprentice(record)`
  - `getPendingQueue()`
  - `dequeueApprentice(id)`
  - `flushQueue(accessToken, spreadsheetId)`: Procesa y envía todos los registros pendientes en un único lote a Google Sheets.

### B. Gestor de Sincronización en Segundo Plano (`src/services/backgroundSyncService.ts`)
- Escucha el estado de autenticación de Google al cargar la aplicación y mantiene el token listo.
- Conecta automáticamente la hoja oficial *"SENA — Registro Oficial de Aprendices en Inducción (Acuerdo 0009 de 2024)"*.
- Dispara automáticamente la inserción al cumplirse cualquiera de estas condiciones:
  1. El aprendiz aprueba el cuestionario final (puntaje $\ge 80\%$).
  2. El aprendiz visualiza o descarga su constancia digital oficial.
- Monitorea eventos de red `window.addEventListener('online')` para vaciar la cola automáticamente.

### C. Notificaciones Toast No Invasivas (`src/components/AutoSyncToast.tsx`)
- Sustituye los molestos cuadros de diálogo y modales obligatorios por un aviso tipo **Toast discreto** en la esquina inferior derecha:
  - Icono verde de Google Sheets.
  - Mensaje: *"Aprendiz sincronizado automáticamente en Google Sheets"*.
  - Enlace rápido sutil para abrir la hoja directamente en Drive si el instructor o administrador desea verificarla.
  - Auto-cierre tras 4 segundos sin interrumpir la navegación del aprendiz.

### D. Indicador de Estado en el Header (`src/components/Header.tsx`)
- Micro-indicador de estado en la barra superior:
  - **Verde fijo con pulso**: *"Sincronización activa en segundo plano"*.
  - **Ámbar**: *"1 registro guardado en cola local (reintentando...)"*.
  - Al hacer clic, abre el panel de control con el enlace directo y la tabla histórica para consulta, pero **no requiere interacción obligatoria**.

---

## 4. Plan de Verificación y Pruebas
1. **Flujo Feliz Automático**:
   - Completar la inducción con un aprendiz de prueba.
   - Verificar que al llegar a la pantalla de constancia o aprobar el cuestionario, el registro se añade a Google Sheets sin necesidad de confirmaciones manuales.
2. **Prueba de Cola Offline**:
   - Simular desconexión temporal de red o sesión inactiva.
   - Confirmar que los datos se almacenan en la cola local de reintentos y que, al restablecer la conexión, se sincronizan automáticamente.
3. **Validación de Compilación y Calidad**:
   - Ejecutar `compile_applet` y `lint_applet` para garantizar cero errores en TypeScript y Vite.
