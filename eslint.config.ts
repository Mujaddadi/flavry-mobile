import { defineConfig } from "eslint/config";
import expoConfig from "eslint-config-expo/flat";

import eslintConfigPrettier from "eslint-config-prettier";

export default defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  eslintConfigPrettier,
]);
