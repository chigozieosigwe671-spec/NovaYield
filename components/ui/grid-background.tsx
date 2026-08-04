export default function GridBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">

      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to right, rgba(227,30,36,.08) 0px, rgba(227,30,36,.08) 1px, transparent 1px, transparent 70px)",
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgba(227,30,36,.08) 0px, rgba(227,30,36,.08) 1px, transparent 1px, transparent 70px)",
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at top center, rgba(227,30,36,.15), transparent 70%)",
        }}
      />

    </div>
  );
}