import { ApprenticeData } from '../components/CertificateView';

export interface SheetApprenticeRecord {
  timestamp: string;
  fullName: string;
  documentType: string;
  documentNumber: string;
  program: string;
  fichaNumber: string;
  regional: string;
  score: string;
  status: string;
  verificationCode: string;
  completionDate: string;
  legalNorm: string;
}

const DEFAULT_SHEET_TITLE =
  'SENA — Registro Oficial de Aprendices en Inducción (Acuerdo 0009 de 2024)';

/**
 * Searches user's Google Drive or creates a new induction spreadsheet using Google Sheets API.
 */
export async function findOrCreateInductionSheet(accessToken: string): Promise<{
  spreadsheetId: string;
  spreadsheetUrl: string;
  isNew: boolean;
}> {
  // 1. Check if we already have a saved spreadsheetId in localStorage and verify it
  const saved = localStorage.getItem('sena_google_sheet_info');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.id) {
        const verifyRes = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${parsed.id}?fields=spreadsheetId,spreadsheetUrl,properties.title`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        if (verifyRes.ok) {
          const verifyData = await verifyRes.json();
          return {
            spreadsheetId: verifyData.spreadsheetId,
            spreadsheetUrl:
              verifyData.spreadsheetUrl ||
              `https://docs.google.com/spreadsheets/d/${verifyData.spreadsheetId}/edit`,
            isNew: false,
          };
        }
      }
    } catch (err) {
      console.warn('No se pudo reutilizar la hoja guardada previamente:', err);
    }
  }

  // 2. Optional: Search Drive, but non-blocking (in case Drive API query is restricted by drive.file scope)
  try {
    const query = encodeURIComponent(
      `name = '${DEFAULT_SHEET_TITLE}' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`
    );
    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,webViewLink)`;

    const searchRes = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (searchRes.ok) {
      const searchData = await searchRes.json();
      if (searchData.files && searchData.files.length > 0) {
        const file = searchData.files[0];
        const info = {
          spreadsheetId: file.id,
          spreadsheetUrl:
            file.webViewLink || `https://docs.google.com/spreadsheets/d/${file.id}/edit`,
          isNew: false,
        };
        localStorage.setItem(
          'sena_google_sheet_info',
          JSON.stringify({ id: info.spreadsheetId, url: info.spreadsheetUrl })
        );
        return info;
      }
    }
  } catch (err) {
    // Graceful fallback to creating via Sheets API directly
    console.info('Drive search no disponible o restringido, procediendo con Sheets API:', err);
  }

  // 3. Create new spreadsheet directly with Google Sheets API (which creates in user's Google Drive)
  const createUrl = 'https://sheets.googleapis.com/v4/spreadsheets';
  const createPayload = {
    properties: {
      title: DEFAULT_SHEET_TITLE,
    },
    sheets: [
      {
        properties: {
          title: 'Aprendices Inducción',
          gridProperties: {
            frozenRowCount: 1,
          },
        },
      },
    ],
  };

  const createRes = await fetch(createUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(createPayload),
  });

  if (!createRes.ok) {
    let errorDetail = createRes.statusText;
    try {
      const errJson = await createRes.json();
      if (errJson?.error?.message) {
        errorDetail = errJson.error.message;
      }
    } catch {
      // fallback
    }
    console.error('Error creando hoja en Google Sheets:', errorDetail);
    throw new Error(`Error en Google Sheets: ${errorDetail}`);
  }

  const createdData = await createRes.json();
  const spreadsheetId = createdData.spreadsheetId;
  const spreadsheetUrl =
    createdData.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  // 4. Initialize header row
  const headers = [
    'Marca Temporal',
    'Nombre del Aprendiz',
    'Tipo Documento',
    'Número Documento',
    'Programa de Formación',
    'Número de Ficha',
    'Regional y Centro SENA',
    'Puntaje Inducción (%)',
    'Estado Formativo',
    'Código de Verificación',
    'Fecha Culminación',
    'Norma Vigente',
  ];

  try {
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Aprendices Inducción'!A1:L1?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [headers],
        }),
      }
    );
  } catch (headerErr) {
    console.warn('Error inicializando fila de encabezado:', headerErr);
  }

  const result = {
    spreadsheetId,
    spreadsheetUrl,
    isNew: true,
  };

  localStorage.setItem(
    'sena_google_sheet_info',
    JSON.stringify({ id: result.spreadsheetId, url: result.spreadsheetUrl })
  );

  return result;
}

/**
 * Appends an apprentice's record to the Google Sheet.
 */
export async function appendApprenticeRecord(
  accessToken: string,
  spreadsheetId: string,
  apprentice: ApprenticeData,
  score: number
): Promise<void> {
  const rowValues = [
    new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' }),
    apprentice.fullName,
    apprentice.documentType,
    apprentice.documentNumber,
    apprentice.program,
    apprentice.fichaNumber,
    apprentice.regional,
    `${score}%`,
    score >= 80 ? 'APROBADO — INDUCCIÓN CUMPLIDA' : 'EN REVISIÓN FORMATIVA',
    apprentice.verificationCode,
    apprentice.completionDate,
    'Acuerdo 0009 de 2024 (SENA)',
  ];

  const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Aprendices Inducción'!A1:append?valueInputOption=USER_ENTERED`;

  const res = await fetch(appendUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: [rowValues],
    }),
  });

  if (!res.ok) {
    let errorDetail = res.statusText;
    try {
      const errJson = await res.json();
      if (errJson?.error?.message) {
        errorDetail = errJson.error.message;
      }
    } catch {
      // fallback
    }
    console.error('Error registrando aprendiz en Google Sheets:', errorDetail);
    throw new Error(`Error al guardar en Google Sheets: ${errorDetail}`);
  }
}

/**
 * Fetches all apprentice rows stored in the Google Sheet.
 */
export async function getApprenticeRecords(
  accessToken: string,
  spreadsheetId: string
): Promise<SheetApprenticeRecord[]> {
  const readUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Aprendices Inducción'!A2:L1000`;

  const res = await fetch(readUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    return [];
  }

  const data = await res.json();
  const rows: string[][] = data.values || [];

  return rows.map((row) => ({
    timestamp: row[0] || '',
    fullName: row[1] || '',
    documentType: row[2] || '',
    documentNumber: row[3] || '',
    program: row[4] || '',
    fichaNumber: row[5] || '',
    regional: row[6] || '',
    score: row[7] || '',
    status: row[8] || '',
    verificationCode: row[9] || '',
    completionDate: row[10] || '',
    legalNorm: row[11] || '',
  }));
}
