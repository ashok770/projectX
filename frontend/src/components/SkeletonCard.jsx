const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
    <div className="h-44 skeleton" />
    <div className="p-4 space-y-3">
      <div className="h-4 skeleton rounded-full w-3/4" />
      <div className="h-3 skeleton rounded-full w-1/2" />
      <div className="h-3 skeleton rounded-full w-2/3" />
      <div className="h-3 skeleton rounded-full w-1/3" />
      <div className="h-10 skeleton rounded-xl mt-4" />
    </div>
  </div>
);

export default SkeletonCard;
