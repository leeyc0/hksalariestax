import globals from "globals";
import pluginVue from 'eslint-plugin-vue';
import pluginImport from 'eslint-plugin-import';
import standard from "@vue/eslint-config-standard";

export default [
    ...pluginVue.configs["flat/essential"],
    pluginImport.flatConfigs.recommended,
    ...standard,
    {
        languageOptions: {
            globals: {
                ...globals.node,
            },

            ecmaVersion: 'latest',
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
