import { FaRegCopy } from "react-icons/fa";

const CopyableInput = ({ value, width }) => {
     const copyToClipboard = () => {
    navigator.clipboard.writeText(value);

    alert("Referral link copied!");
  };
  return (
    <div className="copy-input-wrapper" style={{ width }}>
      <input
        type="text"
        value={value}
        readOnly
        className="copy-input-field"
        onFocus={(e) => e.target.select()}
      />
      <button
        type="button"
        className="copy-input-btn"
        onClick={copyToClipboard}
        aria-label="Copy referral link"
        title="Copy"
      >
        <FaRegCopy size={16} />
      </button>
    </div>
  );
};
export default CopyableInput;