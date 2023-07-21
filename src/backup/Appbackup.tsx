// import { useState } from "react";
// import "./App.css";

// export default function App() {
//   const [count, setCount] = useState(0);

//   const handleClick = (type: string) => {
//     if (type === "increment") {
//       setCount((curCount) => {
//         return curCount + 1;
//       });
//     } else {
//       setCount((curCount) => {
//         return curCount - 1;
//       });
//     }
//   };

//   return (
//     <>
//       <h1>
//         Count is:{" "}
//         <span style={{ color: "lightcoral", fontSize: "4.8rem" }}>{count}</span>
//       </h1>
//       <button
//         style={{ width: "50px", height: "50px" }}
//         onClick={() => handleClick("increment")}
//       >
//         +
//       </button>
//       <button
//         style={{ width: "50px", height: "50px" }}
//         onClick={() => handleClick("decrement")}
//       >
//         -
//       </button>
//     </>
//   );
// }
