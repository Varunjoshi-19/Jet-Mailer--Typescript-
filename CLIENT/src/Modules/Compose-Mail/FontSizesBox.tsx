import { useState } from "react";
import styles from "./fontsize.module.css";
import { UseComposeMailContext } from "@/Context/ComposeMailContext";

const fontSizes = [
  { label: "Small", value: "12px", font: "2" },
  { label: "Normal", value: "16px", font: "3" },
  { label: "Large", value: "20px", font: "5" },
  { label: "Huge", value: "28px", font: "7" },
];



const FontSizeBox = () => {

  const { setFontSizeBox, setSelectedFontSize, selectedFontSize, textareaRef, placeCaretAtEnd } = UseComposeMailContext();
  const [selectedSize, setSelectedSize] = useState<string>(`${selectedFontSize}`);



  const handleSelect = (value: string, fontSize: string) => {
    if (textareaRef.current != null) {
      placeCaretAtEnd(textareaRef.current);
    }
    document.execCommand("fontSize", true, fontSize);
    setSelectedSize(value);
    setSelectedFontSize(value);
    setFontSizeBox(false);

  };

  return (
    <>
      <ul className={styles.dropdownList}>
        {fontSizes.map((size) => (
          <li
            key={size.value}
            className={`${styles.dropdownItem} ${selectedSize === size.font ? styles.active : ""
              }`}
            style={{ fontSize: size.value }}
            onClick={() => handleSelect(size.value, size.font)}
          >
            {selectedSize === size.font && <span className={styles.check}>✔</span>}{" "}
            {size.label}
          </li>
        ))}
      </ul>

    </>
  );
};

export default FontSizeBox;
