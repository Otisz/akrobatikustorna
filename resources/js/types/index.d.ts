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

export type Pagination<T> = {
  current_page: number;
  current_page_url: string;
  data: T[];
  first_page_url: string;
  from: number;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
};

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

export interface Post {
  id: number;
  user_id: string;
  title: {
    hu: string;
  };
  slug: string;
  description: {
    hu: string | null;
  };
  content: {
    hu: string;
  };
  media: Record<string, unknown>[];
  featured_image: null;
  post_type: "post";
  parent_id: null;
  ordering: number;
  password: null;
  status: "publish";
  sticky_until: null;
  published_at: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
