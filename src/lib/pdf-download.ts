import { getStoredToken } from './api-client';

const BASE_URL = import.meta.env.VITE_WORKER_API_URL || '';

function buildFullUrl(path: string): string {
  const base = BASE_URL.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

function isMobileBrowser(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export interface PdfDownloadResult {
  success: boolean;
  openedInNewTab: boolean;
  error?: string;
}

export async function downloadPdf(
  pdfPath: string,
  filename: string,
): Promise<PdfDownloadResult> {
  const pdfUrl = buildFullUrl(pdfPath);
  const token = getStoredToken();

  if (isMobileBrowser()) {
    try {
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const response = await fetch(pdfUrl, { headers });
      if (response.ok) {
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const win = window.open(blobUrl, '_blank');
        if (!win) {
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = `${filename}.pdf`;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
        setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
        return { success: true, openedInNewTab: true };
      }
    } catch {
      // fetch failed — fall through to direct navigation
    }
    window.open(pdfUrl, '_blank');
    return { success: true, openedInNewTab: true };
  }

  try {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(pdfUrl, { headers });
    if (!response.ok) {
      return { success: false, openedInNewTab: false, error: `Server returned ${response.status}` };
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
    return { success: true, openedInNewTab: false };
  } catch {
    return { success: false, openedInNewTab: false, error: 'Network error while downloading PDF.' };
  }
}
