import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: ["./vitest.setup.ts"],
    server: {
      deps: {
        inline: ["@fluentui"],
      },
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: [
        "src/mappers/**/*.ts",
        "src/components/usersettings/fieldStateUtils.ts",
        "src/components/usersettings/formatFieldValue.ts",
        "src/components/usersettings/optionSetMappings.ts",
        "src/components/usersettings/SettingField.tsx",
        "src/components/usersettings/SettingsSection.tsx",
        "src/components/usersettings/FieldInfoTooltip.tsx",
        "src/components/usersettings/FieldRenderers.tsx",
        "src/components/usersettings/UsersettingsTab.tsx",
      ],
      exclude: ["**/*.d.ts"],
    },
  },
});
