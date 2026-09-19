import React, { useState, useEffect } from 'react';
import {
  fetchAdminCertificates,
  saveCertificate,
  deleteCertificate,
  CertificateItem,
} from '../services/certificatesApi';
import FileUpload from '../components/FileUpload';
import ConfirmModal from '../components/ConfirmModal';
import {
  Award,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  FileText,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  Save,
  X,
  ExternalLink,
} from 'lucide-react';

export default function CertificatesManagement() {
  const [certs, setCerts] = useState<CertificateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  // Form edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editingCert, setEditingCert] = useState<Partial<CertificateItem>>({
    title: '',
    description: '',
    image_url: '',
    pdf_url: '',
    is_active: true,
    display_order: 1,
  });

  // Delete modal state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    setLoading(true);
    const data = await fetchAdminCertificates();
    setCerts(data);
    setLoading(false);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenAdd = () => {
    const nextOrder = certs.length > 0 ? Math.max(...certs.map((c) => c.display_order)) + 1 : 1;
    setEditingCert({
      title: '',
      description: '',
      image_url: '',
      pdf_url: '',
      is_active: true,
      display_order: nextOrder,
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (cert: CertificateItem) => {
    setEditingCert(cert);
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert.title || !editingCert.image_url) {
      alert('Please enter a Certificate Title and Upload an Image.');
      return;
    }

    await saveCertificate(editingCert as any);
    setIsEditing(false);
    showToast('✓ Certificate saved successfully');
    loadCertificates();
  };

  const handleToggleActive = async (cert: CertificateItem) => {
    await saveCertificate({ ...cert, is_active: !cert.is_active });
    showToast(`✓ Certificate "${cert.title}" ${!cert.is_active ? 'Activated' : 'Deactivated'}`);
    loadCertificates();
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    await deleteCertificate(deleteTargetId);
    setDeleteTargetId(null);
    showToast('✓ Certificate deleted successfully');
    loadCertificates();
  };

  const handleReorder = async (cert: CertificateItem, direction: 'up' | 'down') => {
    const sorted = [...certs].sort((a, b) => a.display_order - b.display_order);
    const idx = sorted.findIndex((c) => c.id === cert.id);
    if (idx < 0) return;

    if (direction === 'up' && idx > 0) {
      const prev = sorted[idx - 1];
      const temp = cert.display_order;
      await saveCertificate({ ...cert, display_order: prev.display_order });
      await saveCertificate({ ...prev, display_order: temp });
    } else if (direction === 'down' && idx < sorted.length - 1) {
      const next = sorted[idx + 1];
      const temp = cert.display_order;
      await saveCertificate({ ...cert, display_order: next.display_order });
      await saveCertificate({ ...next, display_order: temp });
    }
    loadCertificates();
  };

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-400" />
            <span>Certificates Management</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Manage corporate ISO certifications, channel partner badges, images, descriptions, and verification PDFs.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Certificate</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-bold text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Order</th>
                <th className="py-3.5 px-4">Image</th>
                <th className="py-3.5 px-4">Certificate Title & Details</th>
                <th className="py-3.5 px-4">PDF Document</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 font-medium">
                    Loading Certificates...
                  </td>
                </tr>
              ) : certs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 font-medium">
                    No certificates created yet. Click "Add New Certificate".
                  </td>
                </tr>
              ) : (
                certs
                  .sort((a, b) => a.display_order - b.display_order)
                  .map((cert, idx) => (
                    <tr key={cert.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* Order */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <span className="font-mono font-bold text-amber-400 w-5">
                            {cert.display_order}
                          </span>
                          <div className="flex flex-col">
                            <button
                              onClick={() => handleReorder(cert, 'up')}
                              disabled={idx === 0}
                              className="text-slate-500 hover:text-amber-400 disabled:opacity-30 cursor-pointer"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleReorder(cert, 'down')}
                              disabled={idx === certs.length - 1}
                              className="text-slate-500 hover:text-amber-400 disabled:opacity-30 cursor-pointer"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Image Thumbnail */}
                      <td className="py-3 px-4">
                        <div className="w-12 h-14 rounded-lg overflow-hidden bg-slate-950 border border-slate-700 p-1 flex items-center justify-center">
                          {cert.image_url ? (
                            <img src={cert.image_url} alt={cert.title} className="max-h-full max-w-full object-contain" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-slate-600" />
                          )}
                        </div>
                      </td>

                      {/* Title & Description */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5 max-w-xs">
                          <div className="font-bold text-white leading-snug">{cert.title}</div>
                          <div className="text-[11px] text-slate-400 truncate">{cert.description}</div>
                        </div>
                      </td>

                      {/* PDF */}
                      <td className="py-3 px-4">
                        {cert.pdf_url ? (
                          <a
                            href={cert.pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/30 hover:underline"
                          >
                            <FileText className="w-3 h-3" />
                            <span>Verification PDF</span>
                            <ExternalLink className="w-3 h-3 ml-0.5" />
                          </a>
                        ) : (
                          <span className="text-[11px] text-slate-500 font-medium">None</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleActive(cert)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                            cert.is_active
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                              : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                          }`}
                        >
                          {cert.is_active ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          <span>{cert.is_active ? 'Active' : 'Inactive'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(cert)}
                            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                            title="Edit Certificate"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTargetId(cert.id)}
                            className="p-1.5 text-slate-400 hover:text-red-400 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                            title="Delete Certificate"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Modal Form */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white max-h-[90vh] overflow-y-auto font-sans">
            <button
              onClick={() => setIsEditing(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>{editingCert.id ? 'Edit Certificate' : 'Add Certificate'}</span>
            </h2>

            <form onSubmit={handleSave} className="space-y-5">
              {/* Image Upload */}
              <FileUpload
                label="Certificate Document / Badge Image *"
                category="certificates/images"
                accept="image/jpeg,image/png,image/webp"
                currentUrl={editingCert.image_url}
                onUploadSuccess={(url) => setEditingCert({ ...editingCert, image_url: url })}
                onRemove={() => setEditingCert({ ...editingCert, image_url: '' })}
              />

              {/* Title */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Certificate Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingCert.title || ''}
                  onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })}
                  placeholder="e.g. ISO 9001:2015 Certification"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Description / Compliance Summary
                </label>
                <textarea
                  rows={3}
                  value={editingCert.description || ''}
                  onChange={(e) => setEditingCert({ ...editingCert, description: e.target.value })}
                  placeholder="Enter certificate details and compliance standard..."
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Optional PDF Upload */}
              <FileUpload
                label="Verification PDF (Optional)"
                category="certificates/pdfs"
                accept="application/pdf"
                currentUrl={editingCert.pdf_url}
                onUploadSuccess={(url) => setEditingCert({ ...editingCert, pdf_url: url })}
                onRemove={() => setEditingCert({ ...editingCert, pdf_url: '' })}
              />

              {/* Display Order & Active Toggle */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={editingCert.display_order || 1}
                    onChange={(e) =>
                      setEditingCert({ ...editingCert, display_order: parseInt(e.target.value) || 1 })
                    }
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5 flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer py-2">
                    <input
                      type="checkbox"
                      checked={editingCert.is_active}
                      onChange={(e) => setEditingCert({ ...editingCert, is_active: e.target.checked })}
                      className="w-4 h-4 accent-amber-500 rounded"
                    />
                    <span className="text-xs font-bold text-white">Active (Show on Public Site)</span>
                  </label>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Certificate</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Certificate?"
        message="Are you sure you want to delete this certificate? This action cannot be undone."
        confirmText="Delete Certificate"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
