import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { CustomImage } from './custom-image.extension';
import { TextAlign } from '@tiptap/extension-text-align';
import { MatAnchor } from "@angular/material/button";
import { MATERIAL_IMPORTS } from '../../material';
import DOMPurify from 'dompurify';
import { DomSanitizer } from '@angular/platform-browser';
import { Images } from '../../services/images/images';
import { ImageUploadNode } from './custom-image-upload.extension';

@Component({
  selector: 'app-rich-text-editor',
  imports: [
    MatAnchor,
    MATERIAL_IMPORTS
],
  templateUrl: './rich-text-editor.html',
  styleUrl: './rich-text-editor.scss',
})
export class RichTextEditor implements OnInit, OnDestroy {

  @ViewChild('editorElement', { static: true }) editorElement!: ElementRef;

  @Input() content: string = '';
  @Output() contentChange = new EventEmitter<string>();

  editor!: Editor;
  isPreviewExpanded = true;
  isImageDialogOpen = false;

  constructor(private cdr: ChangeDetectorRef, private sanitizer: DomSanitizer, private images: Images) {}

  ngOnInit(): void {

    // Prevent duplicate hook registration
    if (!(window as any).__dompurifyHookAdded) {
      (window as any).__dompurifyHookAdded = true;

    DOMPurify.addHook('uponSanitizeAttribute', (node, data) => {
      if (data.attrName === 'style') {
        const allowedStyles = ['text-align', 'color', 'background-color', 'font-size', 'font-family', 'width', 'height', 'left', 'top', 'position', 'overflow', 'overflow-clip-margin', 'margin-left', 'margin-right', 'display'];

        const allowedTextAlign = ['left', 'center', 'right'];
        const safeColorRegex = /^(#|rgb|rgba|hsl)/i;
        const safeFontSizeRegex = /^[0-9]+(px|em|rem|%)$/;

        const styles = data.attrValue
          .split(';')
          .map(s => s.trim())
          .filter(Boolean);

        const sanitized = styles.filter(s => {
          const [property, valueRaw] = s.split(':').map(p => p.trim().toLowerCase());

          if (!allowedStyles.includes(property)) return false;

          const value = valueRaw || '';

          switch (property) {
            case 'text-align':
              return allowedTextAlign.includes(value);

            case 'color':
            case 'background-color':
              return safeColorRegex.test(value);

            case 'font-size':
              return safeFontSizeRegex.test(value);

            case 'font-family':
              return !value.includes('url') && !value.includes('expression');

              case 'width':
              case 'height':
              case 'left':
              case 'top':
              case 'margin-left':
              case 'margin-right':
                return value === 'auto' ||/^-?[0-9]+(\.[0-9]+)?px$/.test(value);

              case 'position':
                return ['absolute', 'relative'].includes(value);

              case 'overflow':
                return ['hidden', 'visible'].includes(value);

              case 'display':
                return ['block', 'inline-block', 'flex'].includes(value);

            default:
              return false;
          }
        });

        if (sanitized.length) {
          data.attrValue = sanitized.join('; ');
        } else {
          data.keepAttr = false;
        }
      }

      // 🔒 Secure links
      if (data.attrName === 'href') {
        const value = data.attrValue.trim().toLowerCase();

        if (!value.startsWith('http://') && !value.startsWith('https://')) {
          data.keepAttr = false;
        }
      }
    });
  }

    this.editor = new Editor({
      element: this.editorElement.nativeElement,
      extensions: [
        StarterKit,
        CustomImage,
        ImageUploadNode,
        TextAlign.configure({
          types: ['heading', 'paragraph'],
          alignments: ['left', 'center', 'right'],
        }),
      ],
      content: this.parseContent(this.content),

      onUpdate: () => {
        const html = this.editor.getJSON();
        this.contentChange.emit(JSON.stringify(html));
        this.cdr.detectChanges();
      },

      onSelectionUpdate: () => {
        this.cdr.detectChanges();
      }
    });

  }

  get safeHtml() {

    let html = this.editor.getHTML();

    const clean = DOMPurify.sanitize(html, {
      ALLOWED_ATTR: ['style', 'href', 'src', 'alt', 'width', 'height'],
      ALLOWED_TAGS: ['p', 'h1', 'h2', 'h3', 'strong', 'em', 'u', 's', 'a', 'hr', 'br', 'ol', 'ul', 'li', 'pre', 'code', 'img', 'div'],
    });

    return this.sanitizer.bypassSecurityTrustHtml(clean);
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes['content'] && this.editor) {
      const newContent = changes['content'].currentValue;

      if (!newContent) return;

      const prased = this.parseContent(newContent);

      const current = this.editor.getJSON();

      if (JSON.stringify(current) !== JSON.stringify(prased)) {
        this.editor.commands.setContent(prased);
        this.cdr.detectChanges();
      }
    }
  }

  togglePreview() {
    this.isPreviewExpanded = !this.isPreviewExpanded;
  }

  resizeImage(width: number) {
  this.editor
    .chain()
    .focus()
    .updateAttributes('customImage', { width })
    .run();
  }

  setImageAlign(align: 'left' | 'center' | 'right') {
  this.editor
    .chain()
    .focus()
    .updateAttributes('customImage', { align })
    .run();
  }

  //insert upload box
  insertUploadBox() {
    this.editor
      .chain()
      .focus()
      .insertContent({
        type: 'imageUpload'
      })
      .run();
  }

  parseContent(content: string): string {
    if(!content) return '<p></p>';

    try {
      return JSON.parse(content);
    } catch {
      return content;
    }
  }

}
