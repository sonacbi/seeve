import { memo } from "react";

const Cell = memo(({ cell, isActive, onClick, isSelected, onMouseDown, onMouseEnter, onDoubleClick,}) => {
    let content = cell?.content ?? "";

    switch (cell?.type) {
      case "formula":
        content = "Formula 생성칸";
        break;

      case "image":
        content = "Image 생성칸";
        break;

      case "graph":
        content = "Graph 생성칸";
        break;

      case "mindmap":
        content = "MindMap 생성칸";
        break;

      default:
        break;
    }
  return (
    <div
      className={isSelected ? "cell selected" : "cell"}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onDoubleClick={onDoubleClick}
      style={{
        border: isActive ? "2px solid #4f46e5" : "1px solid #ddd",
        width: "100%",
        height: "100%",
        gridColumn: `span ${cell?.colSpan ?? 1}`
      }}
    >
      
      {content}
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