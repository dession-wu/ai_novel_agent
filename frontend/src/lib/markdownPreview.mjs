export function escapeHTML(text) {
  return String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

export const renderMarkdownPreview = (text) => {
  let html = escapeHTML(text);
  
  // 1. 处理代码块
  html = html.replace(/```([\s\S]*?)```/g, (_match, code) => {
    // 简单的代码高亮模拟
    return `<pre><code class="code-block">${code.trim()}</code></pre>`;
  });
  
  // 2. 处理表格
  // 匹配表格头
  html = html.replace(/^(\|.*\|)\n(\|---*\|.*\|)((\n\|.*\|)+)/gm, (_match, header, _separator, rows) => {
    let tableHtml = '<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; margin: 10px 0;">';
    
    // 处理表头
    tableHtml += '<thead><tr>';
    const headers = header.split('|').filter(h => h.trim() !== '');
    headers.forEach(h => {
      tableHtml += `<th>${h.trim()}</th>`;
    });
    tableHtml += '</tr></thead>';
    
    // 处理表体
    tableHtml += '<tbody>';
    const rowsArr = rows.split('\n').filter(r => r.trim() !== '');
    rowsArr.forEach(row => {
      tableHtml += '<tr>';
      const cells = row.split('|').filter(c => c.trim() !== '');
      cells.forEach(cell => {
        tableHtml += `<td>${cell.trim()}</td>`;
      });
      tableHtml += '</tr>';
    });
    tableHtml += '</tbody></table>';
    
    return tableHtml;
  });
  
  // 3. 处理无序列表
  html = html.replace(/^[\s]*[-*+]\s+(.*$)/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*?<\/li>)(?!<li>)/gs, '<ul>$1</ul>');
  
  // 4. 处理有序列表
  html = html.replace(/^[\s]*\d+\.\s+(.*$)/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*?<\/li>)(?!<li>)/gs, '<ol>$1</ol>');
  
  // 5. 处理粗体
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // 6. 处理斜体
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // 7. 处理标题
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
  
  // 8. 处理换行
  html = html.replace(/\n/g, '<br />');
  
  return { __html: html };
};
