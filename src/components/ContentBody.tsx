import { renderMarkdown } from "@/lib/content";

// Imported Markdown body with the site's typographic styles (.prose-body in globals.css).
export default function ContentBody({ markdown }: { markdown: string }) {
  return <div className="prose-body" dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }} />;
}
