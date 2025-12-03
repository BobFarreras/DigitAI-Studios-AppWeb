export type ActionResult = {
  success?: boolean;
  error?: string;
  repoUrl?: string;
  // 👇 Afegim això per retornar les dades si falla
  fields?: {
    businessName?: string;
    slug?: string;
    description?: string;
    primaryColor?: string;
  };
};