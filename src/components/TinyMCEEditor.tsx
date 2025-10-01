import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface TinyMCEEditorProps {
  value: string;
  onChange: (content: string) => void;
  height?: number;
  placeholder?: string;
}

const TinyMCEEditor: React.FC<TinyMCEEditorProps> = ({ 
  value, 
  onChange, 
  height = 500,
  placeholder = "Write your content here..."
}) => {
  const editorRef = useRef<any>(null);

  const handleImageUpload = (blobInfo: any, progress: any): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      const formData = new FormData();
      formData.append('image', blobInfo.blob(), blobInfo.filename());

      fetch('http://localhost:8080/upload/image', {
        method: 'POST',
        body: formData,
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Upload failed');
        }
        return response.json();
      })
      .then(result => {
        if (result.success && result.url) {
          resolve(result.url);
        } else {
          reject(new Error('Upload failed'));
        }
      })
      .catch(error => {
        console.error('Image upload error:', error);
        reject(error);
      });
    });
  };

  return (
    <div className="tinymce-editor">
      <Editor
        apiKey="j69hl3kl4gbjuz66p7jhgwqjepwnukqeyujfgdxwteu8jdpn"
        onInit={(evt, editor) => editorRef.current = editor}
        value={value}
        onEditorChange={onChange}
        init={{
          height: height,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help | image',
          content_style: `
            body { 
              font-family: Helvetica, Arial, sans-serif; 
              font-size: 16px;
              line-height: 1.8;
              color: #212529;
            }
            h1, h2, h3, h4, h5, h6 {
              margin-top: 24px;
              margin-bottom: 16px;
              font-weight: 600;
              line-height: 1.3;
            }
            h1 { font-size: 2rem; }
            h2 { font-size: 1.75rem; }
            h3 { font-size: 1.5rem; }
            h4 { font-size: 1.25rem; }
            h5 { font-size: 1.1rem; }
            h6 { font-size: 1rem; }
            p { margin-bottom: 16px; }
            ul, ol { margin: 16px 0; padding-left: 30px; }
            li { margin-bottom: 8px; }
            img { max-width: 100%; height: auto; }
          `,
          placeholder: placeholder,
          // HTML 정리 옵션
          paste_as_text: false,
          paste_remove_styles_if_webkit: true,
          verify_html: true,
          cleanup: true,
          cleanup_on_startup: true,
          trim_span_elements: true,
          remove_trailing_brs: true,
          // 불필요한 속성 제거
          invalid_elements: 'script,style',
          extended_valid_elements: 'img[class|src|border=0|alt|title|hspace|vspace|width|height|align|onmouseover|onmouseout|name|style]',
          valid_elements: '*[*]',
          // data-* 속성 제거
          allow_html_data_urls: false,
          images_upload_handler: handleImageUpload,
          automatic_uploads: true,
          file_picker_types: 'image',
          file_picker_callback: (callback, value, meta) => {
            if (meta.filetype === 'image') {
              const input = document.createElement('input');
              input.setAttribute('type', 'file');
              input.setAttribute('accept', 'image/*');
              
              input.onchange = function() {
                const file = (this as HTMLInputElement).files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = function() {
                    if (reader.result && typeof reader.result === 'string') {
                      callback(reader.result, {
                        alt: file.name
                      });
                    }
                  };
                  reader.readAsDataURL(file);
                }
              };
              
              input.click();
            }
          }
        }}
      />
    </div>
  );
};

export default TinyMCEEditor;