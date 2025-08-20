import type { Config } from "ziggy-js";

export interface Auth {
  user: User;
}

export interface SharedData<T extends object = {}> extends T {
  name: string;
  quote: { message: string; author: string };
  auth: Auth;
  ziggy: Config & { location: string };
  sidebarOpen: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  [key: string]: unknown; // This allows for additional properties...
}

export interface Document {
  id: string;
  title: string;
  file_name: string;
  file_path: string;
  file_url: string;
  created_at: string;
  updated_at: string;
}

export interface RecommendedPage {
  id: string;
  name: string;
  url: string;
  created_at: string;
  updated_at: string;
}
