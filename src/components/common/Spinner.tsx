// moovy-frontend/src/components/common/Spinner.tsx
// 간단 로딩 스피너 (Bootstrap 활용)
export default function Spinner() {
  return (
    <div
      className="d-flex justify-content-center align-items-center py-5"
      role="status"
      aria-label="Loading"
    >
      <div className="spinner-border" />
    </div>
  );
}
