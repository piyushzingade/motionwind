export function ArrowConnector() {
  return (
    <>
      <div className="hidden md:flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-2">
          <div className="w-px h-8 bg-gradient-to-b from-transparent to-accent/30" />
          <div className="w-8 h-8 rounded-full border border-accent/20 bg-accent/5 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </div>
          <div className="w-px h-8 bg-gradient-to-b from-accent/30 to-transparent" />
        </div>
      </div>
      <div className="flex md:hidden items-center justify-center py-3">
        <div className="w-8 h-8 rounded-full border border-accent/20 bg-accent/5 flex items-center justify-center">
          <svg
            className="w-4 h-4 text-accent rotate-90"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </div>
      </div>
    </>
  );
}
