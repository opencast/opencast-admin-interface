import opencastConfig from "@opencast/eslint-config-ts-react";

export default [
    ...opencastConfig,

    // Fully ignore some files
    {
        ignores: ["build/"],
    },

    {
        rules: {
            // TODO: We want to turn these on eventually
            "arrow-parens": "off",
            "camelcase": "off",
            "comma-dangle": "off",
            "indent": "off",
            "keyword-spacing": "off",
            "max-len": "off",
            "no-extra-boolean-cast": "off",
            "no-tabs": "off",
            "no-unused-expressions": "off",
            "object-curly-spacing": "off",
            "prefer-const": "off",
            "quotes": "off",
            "semi": "off",
            "spaced-comment": "off",
            "@typescript-eslint/await-thenable": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-floating-promises": "off",
            "@typescript-eslint/no-misused-promises": "off",
            "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
            "@typescript-eslint/no-unsafe-argument": "off",
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/no-unsafe-call": "off",
            "@typescript-eslint/no-unsafe-member-access": "off",
            "@typescript-eslint/no-unused-expressions": "off",
            "@typescript-eslint/no-unused-vars": "off",
            "@typescript-eslint/no-unsafe-return": "off",
            "@typescript-eslint/require-await": "off",
            "@typescript-eslint/unbound-method": "off",
        }
    }
];

