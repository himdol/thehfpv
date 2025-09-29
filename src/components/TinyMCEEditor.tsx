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
      const formData = new FormData();
      formData.append('file', blobInfo.blob(), blobInfo.filename());

      fetch('http://localhost:8080/api/upload/image', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      })
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          resolve(result.url);
        } else {
          reject('Image upload failed: ' + result.message);
        }
      })
      .catch(error => {
        console.error('Image upload error:', error);
        // 서버 업로드 실패 시 base64로 폴백
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.onerror = () => {
          reject('Image upload failed');
        };
        reader.readAsDataURL(blobInfo.blob());
      });
    });
  };

  return (
    <div className="tinymce-editor">
      <Editor
        apiKey='j69hl3kl4gbjuz66p7jhgwqjepwnukqeyujfgdxwteu8jdpn'
        onInit={(evt, editor) => editorRef.current = editor}
        value={value}
        onEditorChange={handleEditorChange}
        init={{
          height: height,
          plugins: [
            // Core editing features
            'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
            // Your account includes a free trial of TinyMCE premium features
            // Try the most popular premium features until Oct 12, 2025:
            'checklist', 'mediaembed', 'casechange', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'advtemplate', 'ai', 'uploadcare', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown','importword', 'exportword', 'exportpdf'
          ],
          toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography uploadcare | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
          tinycomments_mode: 'embedded',
          tinycomments_author: 'Author name',
          mergetags_list: [
            { value: 'First.Name', title: 'First Name' },
            { value: 'Email', title: 'Email' },
          ],
          ai_request: (request: any, respondWith: any) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
          uploadcare_public_key: '1c6a463b9fe8a0af4e5e',
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
          images_upload_handler: handleImageUpload
        }}
      />
    </div>
  );
};

export default TinyMCEEditor;
