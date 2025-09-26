const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080";

export const API_ENDPOINTS = {
  WORKFLOW_INIT: `${API_BASE}/workflow/init`,
  SSE: `${API_BASE}/sse`,
  DOWNLOAD: `${API_BASE}/common/download`
};
