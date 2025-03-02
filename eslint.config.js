import globals from "globals";
import pluginVue from 'eslint-plugin-vue';
import standard from "@vue/eslint-config-standard";

export default [
    ...pluginVue.configs["flat/essential"],
    ...standard,
    {
        languageOptions: {
            globals: {
                ...globals.node,
            },

            ecmaVersion: 2022,
            sourceType: "module",
        },

        rules: {
            "no-console": "off",
            "no-debugger": "off",
        },
    },
    {
        files: ["**/__tests__/*.{j,t}s?(x)", "**/tests/unit/**/*.spec.{j,t}s?(x)"],

        languageOptions: {
            globals: {
                ...globals.mocha,
            },
        },
    }
];
