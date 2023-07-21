import { useState, useEffect } from "react";
import "./App.scss";

interface buttonObj {
  id: string;
  value: string;
  type: string;
}

const operatorRegex = /[-+x÷]/;
const segmentsRegex = /((?:(?<=[+x÷-])-)?\d+\.?\d*)/;
const digitsRegex = /\d+\.?\d*/;
const literalsRegex = /[\d+=.-]/;
const transposeRegex = /Enter|Backspace|\/|\*|Escape/;

export default function App() {
  const [display, setDisplay] = useState("0");
  const [total, setTotal] = useState("");

  const handleOperation = (
    total: string,
    operand: string,
    operator: string
  ) => {
    const firstNum = parseFloat(total);
    const secondNum = parseFloat(operand);
    let newVal = 0;

    switch (operator) {
      case OPERATORS.add:
        newVal = firstNum + secondNum;
        break;
      case OPERATORS.subtract:
        newVal = firstNum - secondNum;
        break;
      case OPERATORS.multiply:
        newVal = firstNum * secondNum;
        break;
      case OPERATORS.divide:
        newVal = firstNum / secondNum;
        break;
    }
    return String(newVal);
  };

  useEffect(() => {
    if (display !== "0") {
      const segments: string[] = display.split(segmentsRegex).filter((e) => e);

      if (segments.length > 2) {
        const subtotal = segments.reduce((total, elem, ind, arr) => {
          if (digitsRegex.test(elem)) {
            return handleOperation(total, elem, arr[ind - 1]);
          }
          return total;
        });
        setTotal(subtotal);
      } else {
        setTotal(segments[0]);
      }
    } else {
      setTotal("");
    }
  }, [display]);

  useEffect(() => {
    function handleKeyPress({ key }: KeyboardEvent) {
      if (literalsRegex.test(key) || transposeRegex.test(key)) {
        let keyID = "#";
        if (literalsRegex.test(key)) {
          keyID += buttonArr.filter((e) => e.value === key)[0].id;
        } else {
          switch (key) {
            case HOTKEYS.multiply:
              keyID += "multiply";
              break;
            case HOTKEYS.divide:
              keyID += "divide";
              break;
            case HOTKEYS.equals.enter:
            case HOTKEYS.equals.equals:
              keyID += "equals";
              break;
            case HOTKEYS.clear:
              keyID += "clear";
              break;
            case HOTKEYS.delete:
              keyID += "delete";
              break;
            default:
              console.log(key);
          }
        }

        if (keyID.length > 1) {
          const button = document.querySelector(keyID) as HTMLElement;
          button && button.click();
        }
        console.log(keyID);
      }
    }

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const handleClick = ({ value, type }: buttonObj) => {
    //Display
    const segmentsDisplay = display.split(segmentsRegex).filter((e) => e);
    const currentDisplaySegment = segmentsDisplay[segmentsDisplay.length - 1];
    const audio: HTMLMediaElement = document.querySelector("#click");
    audio && (audio.volume = 0.5);
    audio && audio.play();

    switch (type) {
      case TYPES.CLEAR:
        setDisplay("0");
        break;
      case TYPES.DECIMAL:
        if (display.length > 15) return;
        !currentDisplaySegment.includes(".")
          ? setDisplay((prev) => prev + value)
          : "";
        break;
      case TYPES.DELETE:
        if (display.length === 1) {
          setDisplay("0");
        } else {
          setDisplay((prev) => prev.slice(0, -1));
        }
        break;
      case TYPES.NUMBER:
        if (display.length > 15) return;
        if (currentDisplaySegment === "0") {
          setDisplay((prev) => prev.slice(0, -1) + value);
        } else {
          setDisplay((prev) => prev + value);
        }
        break;
      case TYPES.OPERATOR:
        if (display.length > 15) return;
        if (digitsRegex.test(currentDisplaySegment)) {
          setDisplay((prev) => prev + value);
        } else if (operatorRegex.test(currentDisplaySegment)) {
          if (
            value === OPERATORS.subtract &&
            currentDisplaySegment.length === 1
          ) {
            setDisplay((prev) => prev + value);
          } else if (currentDisplaySegment.length === 2) {
            setDisplay((prev) => prev.slice(0, -2) + value);
          } else {
            setDisplay((prev) => prev.slice(0, -1) + value);
          }
        } else {
          setDisplay((prev) => prev + value);
        }
        break;
      case TYPES.EQUALS:
        setDisplay(total);
        break;
      default:
        setDisplay((prev) => prev + value);
    }
  };

  return (
    <div className="main-container">
      <section className="sec-display">
        <div className="container display">
          <span id="total">{total != "" ? `(${total})` : ""}</span>
          <span id="display">{display}</span>
        </div>
      </section>
      <section className="sec-keypad">
        <div className="container buttons">
          <h1 className="standard">Standard</h1>
          {buttonArr.map((button) => {
            return (
              <button
                id={button.id}
                className={button.type}
                onClick={() => handleClick(button)}
              >
                {button.value}
              </button>
            );
          })}
          <a
            id="profile-link"
            href="https://github.com/nathsycode"
            target="_blank"
          >
            @nathsycode
          </a>
        </div>
      </section>
    </div>
  );
}

const TYPES = {
  CLEAR: "clear",
  DELETE: "delete",
  NUMBER: "number",
  DECIMAL: "decimal",
  OPERATOR: "operator",
  EQUALS: "equals",
};

const OPERATORS = {
  add: "+",
  subtract: "-",
  multiply: "x",
  divide: "÷",
};

const HOTKEYS = {
  divide: "/",
  multiply: "*",
  equals: {
    equals: "=",
    enter: "Enter",
  },
  clear: "Escape",
  delete: "Backspace",
};

const buttonArr = [
  {
    id: TYPES.CLEAR,
    value: "AC",
    type: TYPES.CLEAR,
  },
  {
    id: TYPES.DELETE,
    value: "DEL",
    type: TYPES.DELETE,
  },
  {
    id: "zero",
    value: "0",
    type: TYPES.NUMBER,
  },
  {
    id: "one",
    value: "1",
    type: TYPES.NUMBER,
  },
  {
    id: "two",
    value: "2",
    type: TYPES.NUMBER,
  },
  {
    id: "three",
    value: "3",
    type: TYPES.NUMBER,
  },
  {
    id: "four",
    value: "4",
    type: TYPES.NUMBER,
  },
  {
    id: "five",
    value: "5",
    type: TYPES.NUMBER,
  },
  {
    id: "six",
    value: "6",
    type: TYPES.NUMBER,
  },
  {
    id: "seven",
    value: "7",
    type: TYPES.NUMBER,
  },
  {
    id: "eight",
    value: "8",
    type: TYPES.NUMBER,
  },
  {
    id: "nine",
    value: "9",
    type: TYPES.NUMBER,
  },
  {
    id: TYPES.DECIMAL,
    value: ".",
    type: TYPES.DECIMAL,
  },
  {
    id: "add",
    value: OPERATORS.add,
    type: TYPES.OPERATOR,
  },
  {
    id: "subtract",
    value: OPERATORS.subtract,
    type: TYPES.OPERATOR,
  },
  {
    id: "multiply",
    value: OPERATORS.multiply,
    type: TYPES.OPERATOR,
  },
  {
    id: "divide",
    value: OPERATORS.divide,
    type: TYPES.OPERATOR,
  },
  {
    id: TYPES.EQUALS,
    value: "=",
    type: TYPES.EQUALS,
  },
];
