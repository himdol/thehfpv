import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface TinyMCEEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: number;
}

const TinyMCEEditor: React.FC<TinyMCEEditorProps> = ({
  value,
  onChange,
  placeholder = "Write your blog content here...",
  height = 400
}) => {
  const editorRef = useRef<any>(null);

  const handleEditorChange = (content: string) => {
    onChange(content);
  };

  const handleImageUpload = (blobInfo: any, progress: any) => {
    return new Promise((resolve, reject) => {
      // 임시로 base64로 변환하여 사용 (실제 프로젝트에서는 서버에 업로드)
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = () => {
        reject('Image upload failed');
      };
      reader.readAsDataURL(blobInfo.blob());
    });
  };

  return (
    <div className="tinymce-editor">
      <Editor
        onInit={(evt, editor) => editorRef.current = editor}
        value={value}
        onEditorChange={handleEditorChange}
        init={{
          apiKey: 'j69hl3kl4gbjuz66p7jhgwqjepwnukqeyujfgdxwteu8jdpn',
          height: height,
          menubar: false,
          promotion: false,
          branding: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'help', 'wordcount', 'emoticons',
            'textcolor', 'colorpicker', 'textpattern', 'nonbreaking', 'pagebreak',
            'save', 'directionality', 'paste', 'textcolor', 'colorpicker'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor backcolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help | image | link | code | emoticons | ' +
            'insertdatetime | table | charmap | preview | fullscreen',
          content_style: `
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              font-size: 14px; 
              line-height: 1.6;
              color: #374151;
            }
            .mce-content-body {
              padding: 20px;
            }
            h1, h2, h3, h4, h5, h6 {
              color: #1f2937;
              margin-top: 1.5em;
              margin-bottom: 0.5em;
            }
            h1 { font-size: 2em; }
            h2 { font-size: 1.5em; }
            h3 { font-size: 1.25em; }
            blockquote {
              border-left: 4px solid #ef4444;
              padding-left: 1em;
              margin: 1em 0;
              color: #6b7280;
              font-style: italic;
            }
            code {
              background: #f3f4f6;
              padding: 0.2em 0.4em;
              border-radius: 3px;
              font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            }
            pre {
              background: #f3f4f6;
              padding: 1em;
              border-radius: 5px;
              overflow-x: auto;
            }
            pre code {
              background: none;
              padding: 0;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              margin: 1em 0;
            }
            table th, table td {
              border: 1px solid #d1d5db;
              padding: 0.5em;
              text-align: left;
            }
            table th {
              background: #f9fafb;
              font-weight: 600;
            }
            img {
              max-width: 100%;
              height: auto;
              border-radius: 5px;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }
            a {
              color: #ef4444;
              text-decoration: none;
            }
            a:hover {
              text-decoration: underline;
            }
          `,
          placeholder: placeholder,
          resize: true,
          statusbar: true,
          elementpath: true,
          paste_data_images: true,
          automatic_uploads: true,
          file_picker_types: 'image',
          images_upload_handler: handleImageUpload,
          setup: (editor: any) => {
            editor.on('init', () => {
              // 에디터 초기화 완료
              console.log('TinyMCE Editor initialized');
            });
          }
        }}
      />
    </div>
  );
};

export default TinyMCEEditor;
