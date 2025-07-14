import MarkdownIt from 'markdown-it';
import Token from 'markdown-it/lib/token.mjs';
import Renderer from 'markdown-it/lib/renderer.mjs';

interface ContainerOptions {
  marker?: string;
  validate?: (params: string) => RegExpMatchArray | null;
  render?: (tokens: Token[], idx: number, options: any, env: any, renderer: Renderer) => string;
}

interface PluginOptions {
  // 可以在这里定义插件特定的选项
}

import container from 'markdown-it-container';

const usePlugin: any = container;

export default function (md: MarkdownIt, options?: PluginOptions): void {
    
    // Json container
    md.use(usePlugin, 'json', {
        validate: function (params: string): RegExpMatchArray | null {
            console.log("---------"+params);
            return params.trim().match(/^(json)(.*)$/);
        },
        render: function (tokens: Token[], idx: number): string {
            console.log(tokens[idx]);
            const m = tokens[idx].info.trim().match(/^(.*)$/);

            if (tokens[idx].nesting === 1) {
                console.log(m);
                
                // 一步完成：从tokens直接解析到对象数组
                const objects: any[] = [];
                let currentObj: any = {};
                let i = idx + 1;
                let nestingLevel = 1;
                
                while (i < tokens.length && nestingLevel > 0) {
                    const token = tokens[i];
                    
                    // 跟踪嵌套层级
                    if (token.type === 'container_json_open') {
                        nestingLevel++;
                    } else if (token.type === 'container_json_close') {
                        nestingLevel--;
                    }
                    
                    // 解析内容并直接构建对象
                    if (nestingLevel > 0 && token.content) {
                        const lines = token.content.split('\n');
                        for (const line of lines) {
                            const trimmedLine = line.trim();
                            if (trimmedLine && trimmedLine.includes(':')) {
                                const colonIndex = trimmedLine.indexOf(':');
                                const key = trimmedLine.substring(0, colonIndex).trim();
                                const value = trimmedLine.substring(colonIndex + 1).trim();
                                
                                if (key && !key.includes(' ')) {
                                    // 遇到blackType时，保存当前对象并创建新对象
                                    if (key === 'blackType' && Object.keys(currentObj).length > 0) {
                                        objects.push({ ...currentObj });
                                        currentObj = {};
                                    }
                                    currentObj[key] = value;
                                }
                            }
                        }
                    }
                    i++;
                }
                
                // 将最后一个对象添加到数组中
                if (Object.keys(currentObj).length > 0) {
                    objects.push({ ...currentObj });
                }
                
                // 将解析出的对象数组转换为HTML
                 const generateLinksHtml = (objects: any[]): string => {
                     if (objects.length === 0) {
                         return '<div class="links"></div>';
                     }
                     
                     const itemsHtml = objects.map(item => {
                         let extendedHtml = ``;
                         if (item.exturl != null && item.exturl != "" && item.extinfo != null && item.extinfo != "") {
                             // 清理URL中的反引号
                             const cleanExturl = item.exturl.replace(/`/g, '');
                             extendedHtml = `<div class="extended"><a href="${cleanExturl}" target="_blank" class="title">${item.extinfo}</a></div>`;
                         }
                         
                         // 清理URL和图片中的反引号和引号
                         let cleanUrl = item.url ? item.url.replace(/[`"]/g, '') : '';
                         let cleanImage = item.image ? item.image.replace(/[`"]/g, '') : '';
                         let cleanColor = item.color ? item.color.replace(/[`"]/g, '') : '#6AC1EC';
                         
                         // 如果图片为空，使用favicon服务
                         if (!cleanImage || cleanImage.trim() === '') {
                             try {
                                 const urlObject = new URL(cleanUrl);
                                 cleanImage = `https://favicon.run/favicon?domain=${urlObject.hostname}&sz=64`;
                             } catch {
                                 cleanImage = `https://favicon.run/favicon?domain=${cleanUrl}&sz=64`;
                             }
                         }
                         
                         return `<div class="item" title="${item.owner || item.site}" style="--block-color:${cleanColor};"><a href="${cleanUrl}" class="image" data-background-image="${cleanImage}"></a><div class="info"><a href="${cleanUrl}" target="_blank" class="title">${item.site}</a><p class="desc">${item.desc || cleanUrl}</p></div>${extendedHtml}</div>`;
                     }).join('');
                     
                     return `<div class="links">${itemsHtml}</div>`;
                 };
                 
                 console.log('=== JSON容器解析结果 ===');
                 console.log('对象数组:', JSON.stringify(objects, null, 2));
                 console.log('=== 解析完成 ===');
                 
                 // 如果是json容器且解析出了对象，直接返回生成的HTML
                 if (m && m[1].trim() === 'json' && objects.length > 0) {
                     // 标记这个容器已经被处理过了
                     tokens[idx].attrSet('data-processed', 'true');
                     
                     // 将容器内的所有tokens标记为空类型以避免重复渲染
                     let nestingLevel = 1;
                     for (let j = idx + 1; j < tokens.length && nestingLevel > 0; j++) {
                         if (tokens[j].type === 'container_json_open') {
                             nestingLevel++;
                         } else if (tokens[j].type === 'container_json_close') {
                             nestingLevel--;
                             if (nestingLevel === 0) {
                                 // 也标记结束token为已处理
                                 tokens[j].attrSet('data-processed', 'true');
                             }
                         }
                         if (nestingLevel > 0) {
                             // 将token类型设置为空字符串，这样renderer就不会处理它
                             tokens[j].type = '';
                             tokens[j].hidden = true;
                         }
                     }
                     
                     return generateLinksHtml(objects);
                 }
                 
                 // opening tag
                 return '<div class="container_' + (m ? m[1].trim() : '') + '">\n';
            } else {
                // closing tag - 检查是否是已处理的json容器
                let isProcessedJson = false;
                // 向前查找对应的开始标签
                for (let i = idx - 1; i >= 0; i--) {
                    if (tokens[i].type === 'container_json_open') {
                        isProcessedJson = tokens[i].attrGet('data-processed') === 'true';
                        break;
                    }
                }
                
                if (isProcessedJson) {
                    return '';
                }
                return '</div>\n';
            }
        }
    } as ContainerOptions);

    // Note container
    md.use(usePlugin, 'note', {
        validate: function (params: string): RegExpMatchArray | null {
            return params.trim().match(/^(default|primary|success|info|warning|danger|jsonModule)(.*)$/);
        },
        render: function (tokens: Token[], idx: number): string {
            const m = tokens[idx].info.trim().match(/^(.*)$/);

            if (tokens[idx].nesting === 1) {
                // opening tag
                return '<div class="note ' + (m ? m[1].trim() : '') + '">\n';
            } else {
                // closing tag
                return '</div>\n';
            }
        }
    } as ContainerOptions);

    // Tab container
    md.use(usePlugin, 'tab', {
        marker: ';',
        validate: function(params: string): RegExpMatchArray | null {
            return params.trim().match(/^(\w+)+(.*)$/);
        },
        render: function (tokens: Token[], idx: number): string {
            const m = tokens[idx].info.trim().match(/^(\w+)+(.*)$/);

            if (tokens[idx].nesting === 1) {
                // opening tag
                return '<div class="tab" data-id="' + (m ? m[1].trim() : '') + '" data-title="' + (m ? m[2].trim() : '') + '">\n';
            } else {
                // closing tag
                return '</div>\n';
            }
        }
    } as ContainerOptions);

    // Collapse container
    md.use(usePlugin, 'collapse', {
        marker: '+',
        validate: function(params: string): RegExpMatchArray | null {
            return params.match(/^(primary|success|info|warning|danger|\s)(.*)$/);
        },
        render: function (tokens: Token[], idx: number): string {
            const m = tokens[idx].info.match(/^(primary|success|info|warning|danger|\s)(.*)$/);

            if (tokens[idx].nesting === 1) {
                // opening tag
                const style = m ? m[1].trim() : '';
                return '<details' + (style ? ' class="' + style + '"' : '') + '><summary>' + (m ? m[2].trim() : '') + '</summary><div>\n';
            } else {
                // closing tag
                return '</div></details>\n';
            }
        }
    } as ContainerOptions);
}