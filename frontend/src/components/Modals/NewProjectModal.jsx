import React, { useState, useEffect } from "react";
import { useProjects } from "../../context/ProjectContext";

const NewProjectModal = ({ isOpen, onClose }) => {
  const { addProject } = useProjects();
  const [formData, setFormData] = useState({
    name: "",
    client: "",
    budget: "",
    advanceAccepted: false,
    advanceType: "percentage",
    advanceValue: "",
    dueDate: "",
  });

  const [calculatedAdvance, setCalculatedAdvance] = useState(0);

  useEffect(() => {
    const budgetNum = parseFloat(formData.budget) || 0;
    const valueNum = parseFloat(formData.advanceValue) || 0;
    
    if (formData.advanceAccepted) {
      if (formData.advanceType === "percentage") {
        setCalculatedAdvance((budgetNum * valueNum) / 100);
      } else {
        setCalculatedAdvance(valueNum);
      }
    } else {
      setCalculatedAdvance(0);
    }
  }, [formData.budget, formData.advanceValue, formData.advanceType, formData.advanceAccepted]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const budget = parseFloat(formData.budget);
    addProject({
      ...formData,
      budget: budget,
      advanceAmount: calculatedAdvance,
      advanceValue: parseFloat(formData.advanceValue) || 0,
    });
    setFormData({
      name: "",
      client: "",
      budget: "",
      advanceAccepted: false,
      advanceType: "percentage",
      advanceValue: "",
      dueDate: "",
    });
    onClose();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h2 className="modal-title">Create New Project</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Project Name</label>
              <input 
                type="text" 
                name="name"
                className="form-input" 
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Website Redesign"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Client Name</label>
              <input 
                type="text" 
                name="client"
                className="form-input" 
                value={formData.client}
                onChange={handleChange}
                placeholder="e.g. Acme Corp"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Total Budget ($)</label>
              <input 
                type="number" 
                name="budget"
                className="form-input" 
                value={formData.budget}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input 
                type="date" 
                name="dueDate"
                className="form-input" 
                value={formData.dueDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '10px' }}>
            <label className="form-toggle">
              <input 
                type="checkbox" 
                name="advanceAccepted"
                checked={formData.advanceAccepted}
                onChange={handleChange}
              />
              <span className="form-label" style={{ marginBottom: 0 }}>Request Advance Payment</span>
            </label>
          </div>

          {formData.advanceAccepted && (
            <div style={{ 
              background: 'var(--bg-primary)', 
              padding: '20px', 
              borderRadius: 'var(--radius-sm)', 
              border: '1px solid var(--border-color)',
              animation: 'fadeIn 0.3s ease-out'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Advance Type</label>
                  <select 
                    name="advanceType"
                    className="form-select" 
                    value={formData.advanceType} 
                    onChange={handleChange}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">
                    {formData.advanceType === "percentage" ? "Percentage" : "Amount"}
                  </label>
                  <input 
                    type="number" 
                    name="advanceValue"
                    className="form-input" 
                    value={formData.advanceValue}
                    onChange={handleChange}
                    placeholder={formData.advanceType === "percentage" ? "20" : "500"}
                    required
                  />
                </div>
              </div>
              <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Calculated Advance:</span>
                <span style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--accent)' }}>
                  ${calculatedAdvance.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Create Project</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProjectModal;
