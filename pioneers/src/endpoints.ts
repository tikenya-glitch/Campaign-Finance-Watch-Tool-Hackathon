export const ENDPOINTS = {
  AUTH: {
    POST: {
      LOGIN: `/auth/login`,
      LOGIN_FORM: `/auth/login-form`,
      CREATE_USER: `/auth/create-user`,
      TEST_HASH: `/auth/test-hash`,
      LOGOUT: `/auth/logout`,
    },
    GET: {
      ME: `/auth/me`,
      VERIFY: `/auth/verify`,
      AUDIT_LOGS: `/auth/audit-logs`,
    },
  },
  DOCUMENTS: {
    POST: {
      UPLOAD: `/documents/upload`,
    },
    GET: {
      LIST: `/documents/`,
      SEARCH: `/documents/search/query`,
      STATISTICS: `/documents/statistics/summary`,
      BY_ID: (documentId: number) => `/documents/${documentId}`,
    },
    DELETE: {
      BY_ID: (documentId: number) => `/documents/${documentId}`,
    },
  },
  CANDIDATES: {
    POST: {
      CREATE: `/candidates/`,
    },
    GET: {
      ALL: `/candidates/`,
      BY_ID: (candidateId: number) => `/candidates/${candidateId}`,
      ANALYSIS: (candidateId: number) => `/candidates/${candidateId}`,
    },
  },
  PARTIES: {
    POST: {
      CREATE: `/parties/`,
    },
    GET: {
      ALL: `/parties/`,
    },
  },
  FINANCE_REPORTS: {
    POST: {
      UPLOAD: `/upload-finance-report/`,
    },
  },
  RISK_ANALYSIS: {
    POST: {
      ANALYZE: (candidateId: number) => `/analyze-risks/${candidateId}`,
    },
    GET: {
      ANOMALIES: (candidateId: number) => `/anomalies/${candidateId}`,
      COMPLIANCE: (candidateId: number) => `/compliance/${candidateId}`,
    },
  },
  DATA_COLLECTION: {
    POST: {
      COLLECT: `/collect-data/`,
    },
  },
  DATA_INTEGRITY: {
    GET: {
      VERIFY: (documentId: string) => `/data-integrity/${documentId}`,
    },
  },
  SYSTEM: {
    GET: {
      STATUS: `/admin/system-status`,
      HEALTH: `/health`,
      ROOT: `/`,
    },
  },
  DATA: {
    GET: {
      COUNTIES: `/data/counties`,
      COUNTY: (countyId: number) => `/data/counties/${countyId}`,
      PARTIES: `/data/parties`,
      PARTY: (partyId: number) => `/data/parties/${partyId}`,
      CANDIDATES: `/data/candidates`,
      CANDIDATE: (candidateId: number) => `/data/candidates/${candidateId}`,
      COUNTY_POPULATIONS: (countyId: number) =>
        `/data/counties/${countyId}/populations`,
      STATISTICS: `/data/statistics`,
    },
  },
  ENHANCED_PDF: {
    POST: {
      EXTRACT: `/enhanced-pdf/extract`,
    },
    GET: {
      STATUS: (jobId: string) => `/enhanced-pdf/status/${jobId}`,
      DOWNLOAD: (jobId: string) => `/enhanced-pdf/download/${jobId}`,
      TABLES: (jobId: string) => `/enhanced-pdf/tables/${jobId}`,
      TABLE_PREVIEW: (jobId: string, tableName: string) =>
        `/enhanced-pdf/table/${jobId}/${tableName}`,
      JOBS: `/enhanced-pdf/jobs`,
    },
    DELETE: {
      CLEANUP: (jobId: string) => `/enhanced-pdf/cleanup/${jobId}`,
    },
  },
} as const;
