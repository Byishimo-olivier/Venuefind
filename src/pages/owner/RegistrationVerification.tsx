import { Link, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import type { DragEvent, ChangeEvent } from 'react';
import { RegistrationShell } from './RegistrationShell';
import { getVenueDraft, saveVenueDraft } from '../../data/venues';
import type { VenueDocument } from '../../data/venues';

const documentTypes = [
  {
    category: 'rdb_license',
    title: 'RDB Business License',
    description: 'Upload your valid Rwanda Development Board business registration certificate.',
    hint: 'PDF, JPG, or PNG up to 8MB',
  },
  {
    category: 'vat_certificate',
    title: 'VAT Certificate',
    description: 'A valid VAT certificate from Rwanda Revenue Authority is required for service providers.',
    hint: 'PDF preferred for verification precision',
    warning: 'Failure to provide a clear VAT certificate may delay approval.',
  },
  {
    category: 'owner_identity',
    title: 'Identity (ID or Passport)',
    description: 'National ID or International Passport for the primary business owner.',
    hint: 'PDF, JPG, or PNG up to 8MB',
  },
];

export default function RegistrationVerification() {
  const navigate = useNavigate();
  const draft = getVenueDraft();
  const [documents, setDocuments] = useState<VenueDocument[]>(draft.verificationDocuments || []);
  const [draggingCategory, setDraggingCategory] = useState('');
  const [error, setError] = useState('');

  const documentsByCategory = useMemo(() => {
    return documents.reduce<Record<string, VenueDocument>>((map, document) => ({
      ...map,
      [document.category]: document,
    }), {});
  }, [documents]);

  const addFiles = async (category: string, files: FileList | File[]) => {
    setError('');
    const [file] = Array.from(files);
    if (!file) return;

    if (!['application/pdf', 'image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Please upload PDF, JPG, PNG, or WEBP documents only.');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError('Each document must be 8MB or smaller.');
      return;
    }

    const nextDocument: VenueDocument = {
      id: `${category}-${Date.now()}`,
      category,
      name: file.name,
      type: file.type,
      size: file.size,
      dataUrl: await readFileAsDataUrl(file),
      uploadedAt: new Date().toISOString(),
    };

    setDocuments((current) => [
      ...current.filter((item) => item.category !== category),
      nextDocument,
    ]);
  };

  const removeDocument = (category: string) => {
    setDocuments((current) => current.filter((item) => item.category !== category));
  };

  const handleDrop = async (event: DragEvent<HTMLLabelElement>, category: string) => {
    event.preventDefault();
    setDraggingCategory('');
    await addFiles(category, event.dataTransfer.files);
  };

  const handleContinue = () => {
    saveVenueDraft({ verificationDocuments: documents });
    navigate('/owner/register/review');
  };

  return (
    <RegistrationShell step={3}>
      <section className="reg-card wide docs">
        <h1>Documentation & Verification</h1>
        <p>To celebrate Rwandan excellence on our marketplace, we require official verification of your business and identity.</p>

        <div className="doc-status-row">
          {documentTypes.map((item) => {
            const document = documentsByCategory[item.category];
            return (
              <article key={item.category}>
                <strong>{document ? 'OK' : 'UP'}</strong>
                <h3>{item.title.replace('RDB Business ', '').replace('VAT ', '')}</h3>
                <span className={document ? 'ok' : ''}>{document ? document.name : 'Pending Upload'}</span>
              </article>
            );
          })}
        </div>

        {error && <p className="field-error centered">{error}</p>}

        {documentTypes.map((item) => (
          <article className="upload-row" key={item.category}>
            <div>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
              {item.warning && <b>{item.warning}</b>}
            </div>
            <label
              className={`upload-box real-upload-box ${draggingCategory === item.category ? 'is-dragging' : ''} ${documentsByCategory[item.category] ? 'has-file' : ''}`}
              onDragEnter={(event) => {
                event.preventDefault();
                setDraggingCategory(item.category);
              }}
              onDragOver={(event) => event.preventDefault()}
              onDragLeave={() => setDraggingCategory('')}
              onDrop={(event) => handleDrop(event, item.category)}
            >
              <input
                type="file"
                accept="application/pdf,image/jpeg,image/png,image/webp"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  if (event.target.files) void addFiles(item.category, event.target.files);
                  event.target.value = '';
                }}
              />
              <span>{documentsByCategory[item.category] ? 'Replace document' : `Drag and drop ${item.title} here`}</span>
              <small>{documentsByCategory[item.category]?.name || item.hint}</small>
              <em>Choose file</em>
            </label>
            {documentsByCategory[item.category] && (
              <div className="uploaded-doc-actions">
                <span className="file-pill">{documentsByCategory[item.category].name}</span>
                <button type="button" onClick={() => removeDocument(item.category)}>Remove</button>
              </div>
            )}
          </article>
        ))}

        <div className="reg-actions">
          <Link to="/owner/register/business">Back to Business Details</Link>
          <button type="button" className="reg-primary" onClick={handleContinue}>Save and Continue</button>
        </div>
      </section>
    </RegistrationShell>
  );
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
