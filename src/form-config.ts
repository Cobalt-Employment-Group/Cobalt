import { resolveContactConfig } from "./site";

// Public build configuration embedded by Vite; FormSubmit keeps the recipient private.
export const contactConfig = resolveContactConfig(
  import.meta.env.VITE_FORM_ENDPOINT,
);
