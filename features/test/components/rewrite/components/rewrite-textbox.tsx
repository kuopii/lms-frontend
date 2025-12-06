export default function RewriteTextBox() {
  return (
    <div className="border-primary grid grid-cols-1 gap-5 divide-y-2 divide-white/40 rounded-[30px] border-2 p-8">
      <span className="pb-5 text-[22px] font-medium">Rewrite</span>
      <textarea
        name=""
        id=""
        className="thin-scrollbar h-[250px] w-full resize-none pr-10 text-justify text-base font-normal outline-none placeholder:text-white"
        placeholder="Type text..."
      ></textarea>
    </div>
  );
}
