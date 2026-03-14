/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_API_URL: string;
  // Bác có biến VITE_ nào trong file .env thì cứ thêm dòng vào đây
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}