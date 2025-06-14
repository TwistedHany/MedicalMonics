import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import "../styles/common.css";
import "../styles/AddMnemonicPage.css";

const AddMnemonicPage = ({ onMnemonicAdded, editingMnemonic, onMnemonicUpdated, clearEditing }) => {
  const { currentUser } = useAuth();
  const showToast = useToast();

  const [acronym, setAcronym] = useState("");
  const [fullForm, setFullForm] = useState("");
  const [category, setCategory] = useState("");
  const [bodySystem, setBodySystem] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [examRelevance, setExamRelevance] = useState("");
  const [tags, setTags] = useState("");

  useEffect(() => {
    if (editingMnemonic) {
      setAcronym(editingMnemonic.acronym);
      setFullForm(editingMnemonic.fullForm);
      setCategory(editingMnemonic.category || "");
      setBodySystem(editingMnemonic.bodySystem || "");
      setDifficulty(editingMnemonic.difficulty || "");
      setExamRelevance(editingMnemonic.examRelevance || "");
      setTags(editingMnemonic.tags || "");
    } else {
      setAcronym("");
      setFullForm("");
      setCategory("");
      setBodySystem("");
      setDifficulty("");
      setExamRelevance("");
      setTags("");
    }
  }, [editingMnemonic]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      showToast("User not authenticated.", "warning");
      return;
    }

    if (!acronym.trim() || !fullForm.trim()) {
      showToast("Mnemonic Title and Mnemonic Content are required.", "error");
      return;
    }

    const mnemonicData = {
      acronym,
      fullForm,
      category,
      bodySystem,
      difficulty,
      examRelevance,
      tags: tags.split(","),
      userId: currentUser.id,
    };

    try {
      const token = localStorage.getItem("authToken");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      if (editingMnemonic) {
        mnemonicData.updatedAt = new Date();
        const response = await axios.put(
          `http://localhost:5000/update-mnemonic/${editingMnemonic.id}`,
          mnemonicData,
          { headers }
        );
        showToast("Mnemonic updated successfully!", "success");
        if (onMnemonicUpdated) onMnemonicUpdated(response.data);
      } else {
        mnemonicData.createdAt = new Date();
        const response = await axios.post(
          "http://localhost:5000/add-mnemonic",
          mnemonicData,
          { headers }
        );
        showToast("Mnemonic added successfully!", "success");
        if (onMnemonicAdded) onMnemonicAdded(response.data);
      }

      setAcronym("");
      setFullForm("");
      setCategory("");
      setBodySystem("");
      setDifficulty("");
      setExamRelevance("");
      setTags("");

      if (clearEditing) clearEditing();
    } catch (error) {
      console.error("Error saving mnemonic: ", error);
      showToast(`Error saving mnemonic: ${error.message}`, "error");
    }
  };

  const handleCancel = () => {
    setAcronym("");
    setFullForm("");
    setCategory("");
    setBodySystem("");
    setDifficulty("");
    setExamRelevance("");
    setTags("");
    if (clearEditing) clearEditing();
  };

  return (
    <div className="mnemonic-page-wrapper">
      <div className="mnemonic-form-container">
        <div className="mnemonic-header">
          <h2 className="mnemonic-title">
            {editingMnemonic ? "Edit Mnemonic" : "Add New Mnemonic"}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="mnemonic-form">
          <div className="form-group">
            <label htmlFor="mnemonic-acronym-form" className="form-label">
              Mnemonic Title <span className="required">*</span>
            </label>
            <input
              type="text"
              id="mnemonic-acronym-form"
              value={acronym}
              onChange={(e) => setAcronym(e.target.value)}
              required
              className="form-input"
              placeholder="e.g., CRASH for Beta-Blocker Toxicity"
            />
          </div>
          <div className="form-group">
            <label htmlFor="mnemonic-fullform-form" className="form-label">
              Mnemonic Content <span className="required">*</span>
            </label>
            <textarea
              id="mnemonic-fullform-form"
              value={fullForm}
              onChange={(e) => setFullForm(e.target.value)}
              rows="5"
              required
              className="form-input"
              placeholder={`Enter the full mnemonic content. You can use bullet points or separate lines for each part.`}
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="mnemonic-category-form" className="form-label">
                Category <span className="required">*</span>
              </label>
              <select
                id="mnemonic-category-form"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="form-input"
              >
                <option value="Pathology">Pathology</option>
                <option value="Anatomy">Anatomy</option>
                <option value="Histology">Histology</option>
                <option value="Embryology">Embryology</option>
                <option value="Pharmacology">Pharmacology</option>
                <option value="Microbiology">Microbiology</option>
                <option value="Neurology">Neurology</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="mnemonic-body-system-form" className="form-label">
                Body System
              </label>
              <select
                id="mnemonic-body-system-form"
                value={bodySystem}
                onChange={(e) => setBodySystem(e.target.value)}
                className="form-input"
              >
                <option value="">Select a system (optional)</option>
                <option value="Cardiovascular">Cardiovascular</option>
                <option value="Nervous">Nervous</option>
                <option value="Respiratory">Respiratory</option>
                <option value="Gastrointestinal">Gastrointestinal</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="mnemonic-difficulty-form" className="form-label">
                Difficulty Level <span className="required">*</span>
              </label>
              <select
                id="mnemonic-difficulty-form"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                required
                className="form-input"
              >
                <option value="">Select difficulty</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="mnemonic-exam-relevance-form" className="form-label">
                Exam Relevance <span className="required">*</span>
              </label>
              <select
                id="mnemonic-exam-relevance-form"
                value={examRelevance}
                onChange={(e) => setExamRelevance(e.target.value)}
                required
                className="form-input"
              >
                <option value="">Any exam</option>
                <option value="USMLE Step 1">USMLE Step 1</option>
                <option value="USMLE Step 2 CK">USMLE Step 2 CK</option>
                <option value="Board Exams">Board Exams</option>
                <option value="Clinical Rotations">Clinical Rotations</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="mnemonic-tags-form" className="form-label">
              Tags (comma separated)
            </label>
            <input
              type="text"
              id="mnemonic-tags-form"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="form-input"
              placeholder="e.g., emergency, toxicology, cardiology"
            />
            <p className="form-hint">
              Add relevant tags to help others find your mnemonic
            </p>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              {editingMnemonic ? "Update Mnemonic" : "Submit Mnemonic"}
            </button>
            <button type="button" onClick={handleCancel} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMnemonicPage;
