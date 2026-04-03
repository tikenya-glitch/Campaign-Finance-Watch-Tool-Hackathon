"use server";
import { ENDPOINTS } from "@/endpoints";
import AppServer from "@/server";
import { redirect } from "next/navigation";
import * as Types from "@/types/action.interfaces";

/**
 * @description User login with username and password
 * @param email - User email (used as username)
 * @param password - User password
 * @returns Login response with token
 */
export async function login(email: string, password: string) {
  // Backend now accepts JSON data and sets cookies automatically
  const response = await AppServer.post<{
    access_token: string;
    token_type: string;
  }>(ENDPOINTS.AUTH.POST.LOGIN, {
    username: email,
    password: password,
  });

  if (response.success) {

    redirect("/dashboard");
  }

  return response;
}

/**
 * @description Create a new user (demo endpoint)
 * @param userData - User creation data
 * @returns User creation response
 */
export async function register(userData: Types.RegisterData) {
  const response = await AppServer.post<{ message: string }>(
    ENDPOINTS.AUTH.POST.CREATE_USER,
    {
      username: userData.email,
      email: userData.email,
      password: userData.password,
      role: "viewer",
      full_name: userData.name || undefined,
      phone_number: userData.phone || undefined,
    },
  );

  return response;
}

/**
 * @description User logout
 * @returns Logout response
 */
export async function logout() {
  await AppServer.post(ENDPOINTS.AUTH.POST.LOGOUT, {});
  redirect("/login");
}

/**
 * @description Get current user information
 * @returns User profile data
 */
export async function getCurrentUser() {
  const response = await AppServer.get<Types.User>(ENDPOINTS.AUTH.GET.ME);

  return response;
}

// Data fetching actions
export async function getCounties(
  page: number = 1,
  size: number = 10,
  search?: string,
  region?: string,
) {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  if (search) params.append("search", search);
  if (region) params.append("region", region);

  const response = await AppServer.get<{
    items: Types.County[];
    total: number;
    page: number;
    size: number;
    pages: number;
  }>(`${ENDPOINTS.DATA.GET.COUNTIES}?${params}`);

  return response;
}

export async function getParties(
  page: number = 1,
  size: number = 10,
  search?: string,
  ideology?: string,
) {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  if (search) params.append("search", search);
  if (ideology) params.append("ideology", ideology);

  const response = await AppServer.get<{
    items: Types.Party[];
    total: number;
    page: number;
    size: number;
    pages: number;
  }>(`${ENDPOINTS.DATA.GET.PARTIES}?${params}`);

  return response;
}

export async function getCandidates(
  page: number = 1,
  size: number = 10,
  search?: string,
  county?: string,
  seatType?: string,
  partyId?: number,
) {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  if (search) params.append("search", search);
  if (county) params.append("county", county);
  if (seatType) params.append("seat_type", seatType);
  if (partyId) params.append("party_id", partyId.toString());

  const response = await AppServer.get<{
    items: Types.Candidate[];
    total: number;
    page: number;
    size: number;
    pages: number;
  }>(`${ENDPOINTS.DATA.GET.CANDIDATES}?${params}`);

  return response;
}

export async function getCounty(countyId: number) {
  const response = await AppServer.get<Types.County>(
    ENDPOINTS.DATA.GET.COUNTY(countyId),
  );
  return response;
}

export async function getParty(partyId: number) {
  const response = await AppServer.get<Types.Party>(
    ENDPOINTS.DATA.GET.PARTY(partyId),
  );
  return response;
}

export async function getCandidate(candidateId: number) {
  const response = await AppServer.get<Types.Candidate>(
    ENDPOINTS.DATA.GET.CANDIDATE(candidateId),
  );
  return response;
}

export async function getCountyPopulations(countyId: number) {
  const response = await AppServer.get<Types.CountyPopulation[]>(
    ENDPOINTS.DATA.GET.COUNTY_POPULATIONS(countyId),
  );
  return response;
}

export async function getStatistics() {
  const response = await AppServer.get<{
    counties: number;
    parties: number;
    candidates: number;
    total_population: number;
  }>(ENDPOINTS.DATA.GET.STATISTICS);

  return response;
}

/**
 * @description Upload a document to the backend
 * @param file - PDF file to upload
 * @param purpose - Purpose of the document upload
 * @param description - Optional description of the document
 * @param extractionMethod - Extraction method preference
 * @param isPublic - Whether the document should be public
 * @returns Upload response
 */
export async function uploadDocument(
  file: File,
  purpose: string = "other",
  description?: string,
  extractionMethod: string = "auto",
  isPublic: boolean = false
) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('purpose', purpose);
  if (description) {
    formData.append('description', description);
  }
  formData.append('extraction_method', extractionMethod);
  formData.append('is_public', isPublic.toString());

  const response = await AppServer.post<{
    success: boolean;
    message: string;
    document: {
      id: number;
      filename: string;
      original_filename: string;
      file_size: number;
      purpose: string;
      description?: string;
      extraction_method: string;
      is_public: boolean;
      extraction_status: string;
      created_at: string;
    };
    extraction_task_id?: string;
  }>(ENDPOINTS.DOCUMENTS.POST.UPLOAD, formData, { isMultipart: true });

  return response;
}

/**
 * @description Get list of documents
 * @param skip - Number of documents to skip
 * @param limit - Maximum number of documents to return
 * @param status - Filter by extraction status
 * @param publicOnly - Show only public documents
 * @returns Document list response
 */
export async function getDocuments(
  skip: number = 0,
  limit: number = 100,
  status?: string,
  publicOnly: boolean = false
) {
  const params = new URLSearchParams({
    skip: skip.toString(),
    limit: limit.toString(),
  });

  if (status) params.append("status", status);
  if (publicOnly) params.append("public_only", "true");

  const response = await AppServer.get<{
    success: boolean;
    message: string;
    documents: Array<{
      id: number;
      filename: string;
      original_filename: string;
      file_size: number;
      purpose: string;
      description?: string;
      extraction_method: string;
      is_public: boolean;
      extraction_status: string;
      created_at: string;
    }>;
    total: number;
  }>(`${ENDPOINTS.DOCUMENTS.GET.LIST}?${params}`);

  return response;
}

/**
 * @description Get document by ID
 * @param documentId - Document ID
 * @returns Document details
 */
export async function getDocument(documentId: number) {
  const response = await AppServer.get<{
    id: number;
    filename: string;
    original_filename: string;
    file_size: number;
    purpose: string;
    description?: string;
    extraction_method: string;
    is_public: boolean;
    extraction_status: string;
    created_at: string;
    user_id?: number;
    upload_ip?: string;
    extraction_started_at?: string;
    extraction_completed_at?: string;
    extraction_output_path?: string;
    extraction_error?: string;
    updated_at?: string;
    extracted_tables?: Array<Record<string, any>>;
  }>(ENDPOINTS.DOCUMENTS.GET.BY_ID(documentId));

  return response;
}

/**
 * @description Delete document
 * @param documentId - Document ID
 * @returns Delete response
 */
export async function deleteDocument(documentId: number) {
  const response = await AppServer.delete<{
    success: boolean;
    message: string;
  }>(ENDPOINTS.DOCUMENTS.DELETE.BY_ID(documentId));

  return response;
}

/**
 * @description Search documents
 * @param query - Search query
 * @param skip - Number of documents to skip
 * @param limit - Maximum number of documents to return
 * @returns Search results
 */
export async function searchDocuments(
  query: string,
  skip: number = 0,
  limit: number = 100
) {
  const params = new URLSearchParams({
    q: query,
    skip: skip.toString(),
    limit: limit.toString(),
  });

  const response = await AppServer.get<{
    success: boolean;
    message: string;
    documents: Array<{
      id: number;
      filename: string;
      original_filename: string;
      file_size: number;
      purpose: string;
      description?: string;
      extraction_method: string;
      is_public: boolean;
      extraction_status: string;
      created_at: string;
    }>;
    total: number;
  }>(`${ENDPOINTS.DOCUMENTS.GET.SEARCH}?${params}`);

  return response;
}

/**
 * @description Get document statistics
 * @returns Extraction statistics
 */
export async function getDocumentStatistics() {
  const response = await AppServer.get<{
    total_documents: number;
    completed: number;
    failed: number;
    processing: number;
    pending: number;
    average_extraction_time?: number;
  }>(ENDPOINTS.DOCUMENTS.GET.STATISTICS);

  return response;
}
