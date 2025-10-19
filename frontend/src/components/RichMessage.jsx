  import ReactMarkdown from "react-markdown";
  import remarkGfm from "remark-gfm";
  import rehypeHighlight from "rehype-highlight";
  import rehypeRaw from "rehype-raw";
  import "highlight.js/styles/night-owl.css";

  const RichMessage = ({ text }) => {
    return (
      <div className="prose prose-rich max-w-none text-md leading-snug [&>*]:my-1 [&>pre]:my-3 [&>table]:my-3 [&>h1]:mt-4 [&>h2]:mt-3 [&>ul]:pl-5">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeHighlight]}
          components={{
            a: ({ node, ...props }) => {
              const key = node?.position?.start?.offset || Math.random();
              return (
                <a
                  key={key}
                  {...props}
                  className="text-cyan-400 underline hover:text-cyan-300"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              );
            },
            code: ({ node, inline, className, children, ...props }) => {
              const key = node?.position?.start?.offset || Math.random();

              if (inline) {
                return (
                  <code key={key} className="px-1 rounded text-pink-400">
                    {children}
                  </code>
                );
              }

              return (
                <code key={key} className={className} {...props}>
                  {children}
                </code>
              );
            },
            li: ({ node, children, ...props }) => {
              const key = node?.position?.start?.offset || Math.random();
              return (
                <li key={key} {...props}>
                  {children}
                </li>
              );
            },
            pre: ({ node, children, ...props }) => {
              const key = node?.position?.start?.offset || Math.random();
              return (
                <pre key={key} {...props}>
                  {children}
                </pre>
              );
            },
          }}
        >
          {text}
        </ReactMarkdown>
      </div>
    );
  };

  export default RichMessage;