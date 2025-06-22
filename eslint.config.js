export default [
  {
    files: ["*.js"],
    languageOptions: {
      globals: {
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        localStorage: "readonly",
        fetch: "readonly",
        alert: "readonly",
        confirm: "readonly",
        console: "readonly",
        navigator: "readonly"
      },
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module"
      }
    },
    rules: {
      // Customize rules as needed
    }
  }
];
