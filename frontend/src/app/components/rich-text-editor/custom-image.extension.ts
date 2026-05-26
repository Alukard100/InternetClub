import { NodeViewRendererProps } from '@tiptap/core';
import Image from '@tiptap/extension-image';


export const CustomImage = Image.extend({
  name: 'customImage',
  addAttributes() {
    return {
      ...this.parent?.(),

      width: {
        default: null,
        parseHTML: element => element.getAttribute('width'),
        renderHTML: attributes => {
          if (!attributes['width']) return {};
          return { width: attributes['width'] };
        },
      },

      height: {
        default: null,
        parseHTML: element => element.getAttribute('height'),
        renderHTML: attributes => {
          if (!attributes['height']) return {};
          return { height: attributes['height'] };
        },
      },

      align: {
        default: 'center',
        parseHTML: element => element.getAttribute('data-align') || 'center',
        renderHTML: attributes => {
            return {
                'data-align': attributes['align'],
            };
        },
      },

        cropX: {default: 0 },
        cropY: {default: 0 },
        cropWidth: {default: null },
        cropHeight: {default: null },
    };
  },


    renderHTML({ HTMLAttributes }) {
        const {
            cropX = 0,
            cropY = 0,
            cropWidth,
            cropHeight,
            width,
            height,
            src
        } = HTMLAttributes;

        const align = HTMLAttributes['data-align'] || 'center';

        // if no cropping -> normal
        if (!cropWidth && !cropHeight) {
            return ['img', HTMLAttributes];
        }

        // wrap
        return [
            'div',
            {
                style: `
                    display: flex;
                    width: 100%;
                    justify-content: $ {
                    align === 'left' ?
                    'flex-start' :
                    align === 'right' ?
                    'flex-end' :
                    'center' 
                };
                margin: 8px 0;
                `,
            },
            [
                'div',
                {
                    'data-type': 'cropped-image',
                    style: `
                        position: relative;
                        overflow: hidden;
                        width: ${cropWidth || width}px;
                        height: ${cropHeight || height}px;
                        display: inline-block;
                        margin-left: ${align === 'left' ? '0' : 'auto'};
                        margin-right: ${align === 'right' ? '0' : 'auto'};
                    `,
                },
                ['img', {
                    src,
                    style: `
                        position: absolute;
                        width: ${width}px;
                        height: ${height}px;
                        left: ${-cropX}px;
                        top: ${-cropY}px;
                    `,
                },],
            ],
        ];
    },

    addNodeView() {
        return ({ node, editor }: NodeViewRendererProps) => {
            const container = document.createElement('div');
            container.style.position = 'relative';
            container.style.display = 'inline-block';
            container.style.overflow = 'hidden';
            container.style.border = '1px solid #00bcd4';

            container.addEventListener('dragstart', (e) => e.preventDefault());

            const img = document.createElement('img');
            img.src = node.attrs['src'];

            img.onload = () => {
                if (!node.attrs['width'] || !node.attrs['height']) {
                    const naturalWidth = img.naturalWidth;
                    const naturalHeight = img.naturalHeight;

                    editor.chain().focus().updateAttributes('customImage', {
                        width: naturalWidth,
                        height: naturalHeight,
                        cropWidth: naturalWidth,
                        cropHeight: naturalHeight
                    }).run();
                }
            };

            img.style.position = 'absolute';
            img.style.userSelect = 'none';
            img.addEventListener('dragstart', (e) => e.preventDefault());

            let imgWidth  = node.attrs['width'];
            let imgHeight  = node.attrs['height'];

            let width = node.attrs['cropWidth'] || imgWidth;
            let height = node.attrs['cropHeight'] || imgHeight;

            let cropX = node.attrs['cropX'] || 0;
            let cropY = node.attrs['cropY'] || 0;

            const aspectRation = width / height;

            function applyStyle() {
                // viewport (cropbox)
                container.style.width = width + 'px';
                container.style.height = height + 'px';

                // image
                img.style.width = imgWidth + 'px';
                img.style.height = imgHeight + 'px';

                img.style.left = -cropX + 'px';
                img.style.top = -cropY + 'px';

                cropX = Math.max(0, Math.min(cropX, imgWidth - width));
                cropY = Math.max(0, Math.min(cropY, imgHeight - height));
            }

            applyStyle();

            // ----------------------
            // Drag image (crop move)
            // ----------------------

            container.addEventListener('mousedown', (e) => {
                if ((e.target as HTMLElement).classList.contains('handle')) return;

                let startX = e.clientX;
                let startY = e.clientY;

                const onMove = (e: MouseEvent) => {
                    const dx = e.clientX - startX;
                    const dy = e.clientY - startY;

                    cropX -= dx;
                    cropY -= dy;

                    startX = e.clientX;
                    startY = e.clientY;

                    applyStyle();
                };

                const onUp = () => {

                    imgWidth = Math.round(imgWidth);
                    imgHeight = Math.round(imgHeight);
                    width = Math.round(width);
                    height = Math.round(height);
                    cropX = Math.round(cropX);
                    cropY = Math.round(cropY);

                    editor.chain().focus().updateAttributes('customImage', {
                        width: imgWidth,
                        height: imgHeight,
                        cropWidth: width,
                        cropHeight: height,
                        cropX,
                        cropY
                    }).run();
                    document.removeEventListener('mousemove', onMove);
                };

                document.addEventListener('mousemove', onMove);
                document.addEventListener('mouseup', onUp, { once: true });
            });

            // ----------------------
            // Resize handle (red corner)
            // ----------------------

            const resize = document.createElement('div');
            resize.classList.add('handle');

            resize.style.position = 'absolute';
            resize.style.width = '12px';
            resize.style.height = '12px';
            resize.style.backgroundColor = 'red';
            resize.style.right = '0';
            resize.style.bottom = '0';
            resize.style.cursor = 'nwse-resize';
            resize.style.zIndex = '20';

            resize.addEventListener('mousedown', (e) => {
                e.preventDefault();
                e.stopPropagation();

                let startX = e.clientX;
                let startWidth = imgWidth;

                const onMove = (e: MouseEvent) => {
                    const dx = e.clientX - startX;

                    imgWidth = Math.max(50, startWidth + dx);
                    imgHeight = Math.max(50, imgWidth / aspectRation);
                    
                    width = imgWidth;
                    height = imgHeight;

                    applyStyle();
                };

                const onUp = () => {
                    editor.chain().focus().updateAttributes('customImage', { width: imgWidth, height: imgHeight, cropWidth: width, cropHeight: height }).run();
                    document.removeEventListener('mousemove', onMove);
                };

                document.addEventListener('mousemove', onMove);
                document.addEventListener('mouseup', onUp, { once: true });
            });

            // ----------------------
            // Edge handles (cropping)
            // ----------------------

            function createEdge(cursor: string, position: any, onDrag: (dx: number, dy: number) => void) {
                const edge = document.createElement('div');
                edge.classList.add('handle');

                edge.style.position = 'absolute';
                edge.style.background = '#00bcd4';
                edge.style.opacity = '0.3';
                edge.style.cursor = cursor;
                edge.style.zIndex = '10';
                

                Object.assign(edge.style, position);

                edge.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    let startX = e.clientX;
                    let startY = e.clientY;

                    const onMove = (e: MouseEvent) => {
                        const dx = e.clientX - startX;
                        const dy = e.clientY - startY;

                        onDrag(dx, dy);

                        startX = e.clientX;
                        startY = e.clientY;

                        applyStyle();
                 };

                 const onUp = () => {
                    editor.chain().focus().updateAttributes('customImage', { cropX, cropY, cropWidth: width, cropHeight: height }).run();
                    document.removeEventListener('mousemove', onMove);
                 };

                document.addEventListener('mousemove', onMove);
                document.addEventListener('mouseup', onUp, { once: true });
            });
            return edge;
        }
        // LEFT
        container.appendChild(createEdge('ew-resize', {
            left: '0', top: '0', bottom: '0', width: '6px' }, (dx) => {
                cropX += dx;
                width -= dx;
        }));
        // RIGHT
        container.appendChild(createEdge('ew-resize', {
            right: '0', top: '0', bottom: '0', width: '6px' }, (dx) => {
                width += dx;
        }));
        // TOP
        container.appendChild(createEdge('ns-resize', {
            left: '0', top: '0', right: '0', height: '6px' }, (dx, dy) => {
                cropY += dy;
                height -= dy;
        }));
        // BOTTOM
        container.appendChild(createEdge('ns-resize', {
            left: '0', bottom: '0', right: '0', height: '6px' }, (dx, dy) => {
                height += dy;
        }));

        // ----------------------
        // ALIGNMENT
        // ----------------------

        const wrapper = document.createElement('div');

        wrapper.style.display = 'flex';
        wrapper.style.width = '100%';

        // alignment logic
        const align = node.attrs['align'] || 'center';

        if (align === 'left') {
        wrapper.style.justifyContent = 'flex-start';
        }

        if (align === 'center') {
        wrapper.style.justifyContent = 'center';
        }

        if (align === 'right') {
        wrapper.style.justifyContent = 'flex-end';
        }
        wrapper.style.margin = '8px 0';



        container.appendChild(img);
        container.appendChild(resize);
        wrapper.appendChild(container);

        return { dom: wrapper };
        };
    }


});