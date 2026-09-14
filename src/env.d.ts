/// <reference types="astro/client" />

declare module '*/companies.yml' {
  const value: Record<string, import('./types').Company>;
  export default value;
}
