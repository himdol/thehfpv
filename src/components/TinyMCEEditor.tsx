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
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          placeholder: placeholder,
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