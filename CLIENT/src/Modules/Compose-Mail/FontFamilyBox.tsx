import { useState } from "react";
import styles from "./FontFamilyBox.module.css";
import { UseComposeMailContext } from "@/Context/ComposeMailContext";
import { newMessagePromptIcons } from "@/Utils/Items";

const { fontFamiliesMap } = newMessagePromptIcons;



const FontFamilyBox = () => {

    const { setFontFamilyType, setFontFamilyBox, textareaRef, placeCaretAtEnd } = UseComposeMailContext();
    const [selectedFont, setSelectedFont] = useState<string>("");


    const handleSelect = (fontLabel: string, value: string) => {
        setFontFamilyType(fontLabel);

        if (textareaRef.current != null) {
            placeCaretAtEnd(textareaRef.current);
        }
        document.execCommand("fontName", false, value);
        setSelectedFont(value);
        setFontFamilyBox(false);
    };

    return (
        <>

            <ul className={styles.dropdownList}>
                {Array.from(fontFamiliesMap.entries()).map(([key, value]) => (
                    <li
                        key={key}
                        className={`${styles.dropdownItem} ${selectedFont === key ? styles.active : ""
                            }`}
                        style={{ fontFamily: key }}
                        onClick={() => handleSelect(value, key)}
                    >
                        {value}
                    </li>
                ))}
            </ul>

        </>
    );
};

export default FontFamilyBox;
