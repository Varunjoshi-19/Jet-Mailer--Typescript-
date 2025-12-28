import React, { useState } from "react";
import styles from "./colorbox.module.css";
import { UseComposeMailContext } from "@/Context/ComposeMailContext";
import { newMessagePromptIcons } from "@/Utils/Items";




const ColorPickerBox = () => {

    const { colors } = newMessagePromptIcons;

    const { selectedBGColor, setSelectedBGColor, selectedTextColor, setSelectedTextColor, textareaRef, placeCaretAtEnd } = UseComposeMailContext();
    const [bgColor, setBgColor] = useState<string>(selectedBGColor);
    const [textColor, setTextColor] = useState<string>(selectedTextColor);

    function handleSelectedColor(type: string, color: string) {


        switch (type) {
            case "BG": {


                setSelectedBGColor(color);
                if (textareaRef.current != null) {
                    placeCaretAtEnd(textareaRef.current);
                }
                document.execCommand("hiliteColor", false, color);
                break;
            }
            case "TEXT": {

                setSelectedTextColor(color);
                if (textareaRef.current != null) {
                    placeCaretAtEnd(textareaRef.current);
                }
                document.execCommand("foreColor", false, color);
                break;
            }
            default: {
                return;
            }
        }


    }

    const renderColorGrid = (
        selected: string,
        type: string,
        setSelected: React.Dispatch<React.SetStateAction<string>>
    ) => (
        <div className={styles.grid}>
            {colors.map((color) => (
                <div
                    key={color}
                    className={`${styles.colorCell} ${selected === color ? styles.active : ""
                        }`}
                    style={{ backgroundColor: color }}
                    onClick={() => {
                        handleSelectedColor(type, color);
                        setSelected(color);
                    }}
                >
                    {selected === color && <span className={styles.check}>✔</span>}
                </div>
            ))}
        </div>
    );



    return (
        <div className={styles.container}>
            <div className={styles.section}>
                <div className={styles.title}>Background color</div>
                {renderColorGrid(bgColor, "BG", setBgColor)}
            </div>
            <div className={styles.section}>
                <div className={styles.title}>Text color</div>
                {renderColorGrid(textColor, "TEXT", setTextColor)}
            </div>
        </div>
    );
};





export default ColorPickerBox;
