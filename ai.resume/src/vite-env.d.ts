interface ImportMetaEnv {
  readonly VITE_API_BASE: string
//   readonly VITE_OTHER_VARIABLE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}