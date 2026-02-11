function DocumentList({ documents, onPreview }) {
  return (
    <div>
      <h3>My Documents</h3>

      {documents.length === 0 && <p>No documents found</p>}

      {documents.map((doc) => (
        <div key={doc.id}>
          <span>{doc.name}</span>
      <button onClick={() => onPreview(doc)}>
            Preview
          </button>
        </div>
      ))}
    </div>
  );
}

export default DocumentList;
