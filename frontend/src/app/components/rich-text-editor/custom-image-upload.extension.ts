import { Node } from '@tiptap/core';

export const ImageUploadNode = Node.create({
  name: 'imageUpload',

  group: 'block',
  atom: true,

  addAttributes() {
    return {};
  },

  parseHTML() {
    return [{ tag: 'div[data-type="image-upload"]' }];
  },

  renderHTML() {
    return ['div', { 'data-type': 'image-upload' }];
  },

  addNodeView() {
    return ({ editor, getPos }) => {
      const container = document.createElement('div');
      container.className = 'image-upload-box';

      container.innerHTML = `
        <p>Drag & drop image here</p>
        <p>or</p>
        <input type="file" accept="image/*" />
      `;

      const input = container.querySelector('input');

      // Prevent editor interference
      container.addEventListener('dragover', e => e.preventDefault());

      container.addEventListener('drop', async (e: DragEvent) => {
        e.preventDefault();

        const file = e.dataTransfer?.files?.[0];
        if (file) {
          await upload(file);
        }
      });

      input?.addEventListener('change', async (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
          await upload(file);
        }
      });

      const upload = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        const token = localStorage.getItem('token');

        try {
          const res = await fetch('https://localhost:7061/api/LocalImageStorage', {
            method: 'POST',
            body: formData,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await res.json();

          // 🔥 Replace this node with image
          const pos = getPos();
          if (typeof pos === 'number') {

            editor
              .chain()
              .focus()
              .deleteRange({ from: pos, to: pos + 1 })
              .insertContentAt(pos, {
                type: 'customImage',
                attrs: { src: data.url },
              })
              .run();
          }

        } catch (err) {
          console.error('Upload failed', err);
        }
      };

      return {
        dom: container,
      };
    };
  },
});