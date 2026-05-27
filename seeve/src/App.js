import { useState } from "react";

function App() {
  const [page, setPage] = useState(1);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* 왼쪽: 교수 자료 */}
      <div style={{ flex: 1, borderRight: "1px solid black", padding: 10 }}>
        <h2>교수 자료 (PDF 자리)</h2>
        <p>현재 페이지: p{page}</p>
        <button onClick={() => setPage(page + 1)}>다음 페이지</button>
      </div>

      {/* 오른쪽: 노트 */}
      <div style={{ flex: 1, padding: 10 }}>
        <h2>학습 노트</h2>
        <p>p{page}-1</p>
        <textarea style={{ width: "100%", height: "80%" }} />
      </div>
    </div>
  );
}

export default App;