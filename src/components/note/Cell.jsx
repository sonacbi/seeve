import { memo } from "react";

const Cell = memo(({ cell, isActive, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        border: isActive ? "2px solid #4f46e5" : "1px solid #ddd",
        width: "100%",
        height: "100%"
      }}
    >
      {cell?.content ?? ""}
    </div>
  );
});

export default Cell;

// const Cell = memo(({ cell, isActive, onClick }) => {
//   return (
//     <div
//       onClick={onClick}
//       style={{
//         border: isActive ? "2px solid #4f46e5" : "1px solid #ddd",
//         width: "100%",
//         height: "100%"
//       }}
//     >
//       {cell?.content ?? ""}
//     </div>
//   );
// });