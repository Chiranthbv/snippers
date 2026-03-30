const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";

// ── Helpers ──────────────────────────────────────────────
function getAuthHeaders(): HeadersInit {
    if (typeof window === "undefined") return {};
    const token = localStorage.getItem("snippet_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
            ...options.headers,
        },
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(error.message || `Request failed: ${res.status}`);
    }

    return res.json();
}

// ── Types ────────────────────────────────────────────────
export interface Snippet {
    id: number;
    title: string;
    content: string;
    language: string;
    visibility: "PUBLIC" | "PRIVATE";
    shortUrl: string;
    viewCount: number;
    expiresAt: string | null;
    createdAt: string;
    updatedAt: string;
    username: string;
}

export interface CreateSnippetPayload {
    title: string;
    content: string;
    language: string;
    visibility: "PUBLIC" | "PRIVATE";
    expiresAt?: string | null;
}

export interface AuthResponse {
    token: string;
    username: string;
}

export interface PaginatedResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
}

// ── Auth ─────────────────────────────────────────────────
export async function login(
    email: string,
    password: string
): Promise<AuthResponse> {
    return request<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });
}

export async function register(
    username: string,
    email: string,
    password: string
): Promise<{ message: string }> {
    return request<{ message: string }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
    });
}

// ── Snippets ─────────────────────────────────────────────
export async function getSnippets(params?: {
    language?: string;
    search?: string;
    sort?: string;
    page?: number;
    size?: number;
}): Promise<PaginatedResponse<Snippet>> {
    const query = new URLSearchParams();
    if (params?.language) query.set("language", params.language);
    if (params?.search) query.set("search", params.search);
    if (params?.sort) query.set("sort", params.sort);
    if (params?.page !== undefined) query.set("page", String(params.page));
    if (params?.size !== undefined) query.set("size", String(params.size));
    const qs = query.toString();
    return request<PaginatedResponse<Snippet>>(
        `/api/snippets${qs ? `?${qs}` : ""}`
    );
}

export async function getSnippetByUrl(
    shortUrl: string
): Promise<Snippet> {
    return request<Snippet>(`/api/snippets/${shortUrl}`);
}

export async function getMySnippets(): Promise<Snippet[]> {
    return request<Snippet[]>("/api/snippets/my");
}

export async function createSnippet(
    payload: CreateSnippetPayload
): Promise<Snippet> {
    return request<Snippet>("/api/snippets", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function updateSnippet(
    id: number,
    payload: Partial<CreateSnippetPayload>
): Promise<Snippet> {
    return request<Snippet>(`/api/snippets/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}

export async function deleteSnippet(id: number): Promise<void> {
    await request<void>(`/api/snippets/${id}`, { method: "DELETE" });
}
