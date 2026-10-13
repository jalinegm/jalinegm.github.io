import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // unit: lógica pura; raiz de tests/: verificações sobre dist/ (exigem `npm run build`).
    include: ["tests/unit/**/*.test.ts", "tests/*.test.ts"],
    environment: "node",
  },
});
