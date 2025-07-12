import MarkdownIt from 'markdown-it';
import Token from 'markdown-it/lib/token.mjs';
import Renderer from 'markdown-it/lib/renderer.mjs';

interface ChartPluginOptions {
  // 可以在这里定义图表插件特定的选项
}

function guid(): string {
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c: string): string {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

module.exports = (md: MarkdownIt, options?: ChartPluginOptions): void => {
    const defaultRenderer = md.renderer.rules.fence?.bind(md.renderer.rules);

    md.renderer.rules.fence = (tokens: Token[], idx: number, options: any, env: any, self: Renderer): string => {
        const token = tokens[idx];
        const code = token.content.trim();

        if (token.info === 'chart') {
            const r = guid();

            return `<div id="chart${r}" class="chart-container"></div>
            <script type="text/javascript">
                var chart${r} = new frappe.Chart(document.getElementById('chart${r}'), ${code});
                window.addEventListener('pjax:send', function() {
                    chart${r}.destroy()
                });
            </script>`;
        }
        
        return defaultRenderer ? defaultRenderer(tokens, idx, options, env, self) : '';
    };
};