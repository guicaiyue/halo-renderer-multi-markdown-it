import MarkdownIt from 'markdown-it';
import chartPlugin from '../../dist/lib/renderer/markdown-it-chart/index.js';
import assert from 'assert';

console.log('Running tests for markdown-it-chart...');

// Test case 1: Basic chart rendering
const md = new MarkdownIt();
md.use(chartPlugin);

const markdownInput = `
\`\`\`chart
{
  "title": "My Awesome Chart",
  "type": "bar",
  "data": {
    "labels": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    "datasets": [
      {
        "name": "Dataset 1",
        "values": [18, 40, 30, 35, 8, 52, 17, -4]
      }
    ]
  }
}
\`\`\`
`;

const output = md.render(markdownInput);

// Assertions
assert(output.includes('class="chart-container"'), 'Test Failed: Chart container not found in the output.');
assert(output.includes('My Awesome Chart'), 'Test Failed: Chart title not found in the output.');

console.log('markdown-it-chart tests passed!');