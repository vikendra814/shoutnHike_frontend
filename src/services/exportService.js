import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

export const exportTxt = (content, filename = 'output.txt') => {
  const text = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, filename);
};

export const exportDocx = async (content, filename = 'output.docx') => {
  const lines = (typeof content === 'string' ? content : JSON.stringify(content, null, 2)).split('\n');

  const doc = new Document({
    sections: [{
      children: lines.map((line) =>
        new Paragraph({
          children: [new TextRun({ text: line, size: 24 })],
          heading: line.startsWith('#') ? HeadingLevel.HEADING_1 : undefined,
        })
      ),
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
};
