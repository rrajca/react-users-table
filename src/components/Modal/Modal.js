import ReactModal from "react-modal";

ReactModal.setAppElement("#root");
const Modal = ({
  isOpen,
  setModalIsOpen,
  onAfterClose,
  height,
  width,
  children,
}) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onAfterClose={onAfterClose}
      style={{
        overlay: {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(255, 255, 255, 0.75)",
        },
        content: {
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          top: "50%",
          left: "50%",
          height,
          width,
          border: "1px solid #ccc",
          background: "#fff",
          overflow: "auto",
          WebkitOverflowScrolling: "touch",
          borderRadius: "4px",
          outline: "none",
          padding: "20px",
          transform: "translate(-50%, -50%)",
        },
      }}
    >
      <div className="modal-contentWrapper">{children}</div>
      <div className="bottom-modal-bar">
        <button onClick={() => setModalIsOpen(false)}>Close</button>
      </div>
    </ReactModal>
  );
};

export default Modal;
