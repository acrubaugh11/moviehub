import '../styles/home.css'

export default function ModalComponent({children, onClose }) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {children}
          
        </div>
        <button onClick={onClose} className="button">Close</button>
      </div>
    );
  }