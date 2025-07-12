const path = require('path');

module.exports = {
  entry: './browser.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.mjs'],
    alias: {
      './lib/renderer/markdown-it-mermaid': path.resolve(__dirname, 'lib/renderer/markdown-it-mermaid/browser.ts'),
      './lib/renderer/markdown-it-graphviz': path.resolve(__dirname, 'lib/renderer/markdown-it-graphviz/browser.ts')
    },
    fullySpecified: false
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'MarkdownRenderer',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  mode: 'production',
};