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
            "block-spacing": "off",
            "brace-style": "off",
            "camelcase": "off",
            "comma-dangle": "off",
            "comma-spacing": "off",
            "curly": "off",
            "eol-last": "off",
            "indent": "off",
            "jsx-quotes": "off",
            "key-spacing": "off",
            "keyword-spacing": "off",
            "max-len": "off",
            "no-extra-boolean-cast": "off",
            "no-multi-spaces": "off",
            "no-tabs": "off",
            "no-trailing-spaces": "off",
            "no-unused-expressions": "off",
            "no-var": "off",
            "object-curly-spacing": "off",
            "prefer-const": "off",
            "quotes": "off",
            "react/jsx-key": "off",
            "react/no-unknown-property": "off",
            // "react-hooks/rules-of-hooks": "off",
            "semi": "off",
            "space-before-blocks": "off",
            "space-before-function-paren": "off",
            "space-in-parens": "off",
            "space-infix-ops": "off",
            "space-unary-ops": "off",
            "spaced-comment": "off",
            "@typescript-eslint/await-thenable": "off",
            "@typescript-eslint/ban-ts-comment": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-empty-object-type": "off",
            "@typescript-eslint/no-floating-promises": "off",
            "@typescript-eslint/no-for-in-array": "off",
            "@typescript-eslint/no-misused-promises": "off",
            "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
            "@typescript-eslint/no-redundant-type-constituents": "off",
            "@typescript-eslint/no-unnecessary-type-assertion": "off",
            "@typescript-eslint/no-unsafe-argument": "off",
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/no-unsafe-call": "off",
            "@typescript-eslint/no-unsafe-enum-comparison": "off",
            "@typescript-eslint/no-unsafe-member-access": "off",
            "@typescript-eslint/no-unused-expressions": "off",
            "@typescript-eslint/no-unused-vars": "off",
            "@typescript-eslint/no-unsafe-return": "off",
            "@typescript-eslint/no-wrapper-object-types": "off",
            "@typescript-eslint/only-throw-error": "off",
            "@typescript-eslint/require-await": "off",
            "@typescript-eslint/restrict-plus-operands": "off",
            "@typescript-eslint/unbound-method": "off",
        }
    }
];

