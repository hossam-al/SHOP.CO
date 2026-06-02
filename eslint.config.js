import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [".next", "out", "dist", "next-env.d.ts", "node_modules"],
  },
  ...tseslint.configs.recommended,
);
