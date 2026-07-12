import { useState, useEffect } from "react";
import { fetchWithAuth } from "../../lib/api";
import { X, FileText, Trash2, Plus } from "lucide-react";

interface VehicleDocument {
  id: number;
  document_type: string;
  document_name: string;
  expiry_date: string;
  created_at: string;
}

interface VehicleDocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleId: number | null;
}

export default function VehicleDocumentsModal({ isOpen, onClose, vehicleId }: VehicleDocumentsModalProps) {
  const [documents, setDocuments] = useState<VehicleDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [docType, setDocType] = useState("Insurance");
  const [docName, setDocName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && vehicleId) {
      fetchDocuments();
      setShowAddForm(false);
      setDocName("");
      setExpiryDate("");
      setError("");
    }
  }, [isOpen, vehicleId]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const data = await fetchWithAuth(`/vehicles/${vehicleId}/documents`);
      setDocuments(data);
    } catch (err: any) {
      console.error("Error fetching docs", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      await fetchWithAuth("/vehicles/documents", {
        method: "POST",
        body: JSON.stringify({
          vehicle_id: vehicleId,
          document_type: docType,
          document_name: docName,
          expiry_date: expiryDate
        }),
      });
      setShowAddForm(false);
      fetchDocuments();
    } catch (err: any) {
      setError(err.message || "Failed to add document");
    }
  };

  const handleDelete = async (docId: number) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    try {
      await fetchWithAuth(`/vehicles/documents/${docId}`, { method: "DELETE" });
      fetchDocuments();
    } catch (err: any) {
      alert("Failed to delete document: " + err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Vehicle Documents</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {showAddForm ? (
            <form onSubmit={handleAddDocument} className="space-y-4 mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Upload New Document</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Document Type</label>
                  <select 
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary focus:ring-primary"
                  >
                    <option>Insurance</option>
                    <option>Registration</option>
                    <option>Permit</option>
                    <option>Pollution Certificate</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Document Name</label>
                  <input 
                    type="text" 
                    required
                    value={docName}
                    onChange={(e) => setDocName(e.target.value)}
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary focus:ring-primary"
                    placeholder="e.g. 2026 Insurance Policy"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiry Date</label>
                  <input 
                    type="date" 
                    required
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:opacity-90"
                >
                  Save Document
                </button>
              </div>
            </form>
          ) : (
            <div className="flex justify-end mb-4">
              <button 
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary/10 text-primary hover:bg-primary/20 rounded-lg font-medium transition-colors"
              >
                <Plus size={16} /> Add Document
              </button>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading documents...</div>
          ) : documents.length === 0 ? (
            <div className="text-center py-8 text-gray-500 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
              <FileText className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p>No documents found for this vehicle.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 rounded-lg">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{doc.document_name}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        <span className="font-medium text-gray-700 dark:text-gray-300">{doc.document_type}</span> • Expires: {new Date(doc.expiry_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(doc.id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Delete document"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
