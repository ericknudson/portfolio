// Short frontmatter strings (titles, summaries) may use *asterisks* for italics,
// e.g. "Fable Dis*cover*".

const escape = (s: string) =>
	s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** As HTML, with *text* rendered as <em>text</em>. */
export const inlineHtml = (text: string) => escape(text).replace(/\*([^*]+)\*/g, '<em>$1</em>');

/** As plain text, for <title>, meta tags and other text-only contexts. */
export const plainText = (text: string) => text.replace(/\*([^*]+)\*/g, '$1');
