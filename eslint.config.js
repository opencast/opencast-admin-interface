import { FlatCompat } from "@eslint/eslintrc";

const config = [
    { ignores: ["build"] },
    ...new FlatCompat({ baseDirectory: import.meta.dirname })
        .extends("eslint-config-react-app"),
    { rules: { "no-tabs": ["warn", { allowIndentationTabs: true }]}},
];

export default config;
